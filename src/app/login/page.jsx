"use client"

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Shield, Users, Eye, EyeOff, ArrowRight, Building } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const roleParam = searchParams.get('role') || 'citizen'

  const [role, setRole] = useState(roleParam)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    // Mock auth – store role in localStorage and redirect
    setTimeout(() => {
      localStorage.setItem('smartgov-user', JSON.stringify({ email, role, name: email.split('@')[0] }))
      if (role === 'citizen') {
        router.push('/citizen')
      } else {
        router.push('/dashboard')
      }
    }, 800)
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none', color: 'white' }}>
            <div className="logo-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <Building size={18} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>SmartGov</span>
          </Link>
        </div>
        <div className="login-left-content">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>
            {role === 'citizen' ? 'Citizen Portal' : 'Employee Portal'}
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.85, lineHeight: 1.7, color: 'rgba(255,255,255,0.9)' }}>
            {role === 'citizen'
              ? 'Access government services, pay taxes, apply for land transfers, and track your applications — all from one secure portal.'
              : 'Manage office load, verify documents with AI, handle token queues, and monitor all citizen transactions from one powerful dashboard.'}
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="login-role-toggle">
            <button
              className={`role-toggle-btn ${role === 'citizen' ? 'active' : ''}`}
              onClick={() => setRole('citizen')}
              type="button"
              id="toggle-citizen"
            >
              <Users size={16} />
              Citizen
            </button>
            <button
              className={`role-toggle-btn ${role === 'employee' ? 'active' : ''}`}
              onClick={() => setRole('employee')}
              type="button"
              id="toggle-employee"
            >
              <Shield size={16} />
              Employee
            </button>
          </div>

          <h2 style={{ marginBottom: '0.5rem' }}>Sign In</h2>
          <p style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>
            Enter your credentials to access the {role} portal
          </p>

          {error && (
            <div className="login-error">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <label className="input-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder={role === 'citizen' ? 'citizen@example.com' : 'officer@gov.in'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label className="input-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  className="input-field"
                  style={{ width: '100%', paddingRight: '3rem' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)'
                  }}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              id="login-submit"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', gap: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : (
                <>
                  Sign In as {role === 'citizen' ? 'Citizen' : 'Employee'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
            <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
