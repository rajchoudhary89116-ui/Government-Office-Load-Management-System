"use client"

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Building, Shield, Users, ArrowRight, ChevronRight, Landmark, FileCheck, Ticket, Sun, Moon, Sparkles } from 'lucide-react'

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function HeroBackground() {
  const stars = useMemo(() => {
    const rng = seededRandom(42)
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${rng() * 100}%`,
      top: `${rng() * 100}%`,
      size: `${rng() * 2 + 1}px`,
      duration: `${rng() * 4 + 2}s`,
      delay: `${rng() * 5}s`,
    }))
  }, [])

  return (
    <div className="hero-bg">
      {stars.map(star => (
        <div
          key={`star-${star.id}`}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            '--duration': star.duration,
            animationDelay: star.delay,
          }}
        />
      ))}
      <div className="nebula" style={{ width: '500px', height: '500px', top: '10%', right: '5%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25), transparent)' }} />
      <div className="nebula" style={{ width: '350px', height: '350px', bottom: '10%', left: '15%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15), transparent)', animationDelay: '10s' }} />
    </div>
  )
}

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('smartgov-theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('smartgov-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('smartgov-theme', 'light')
    }
  }

  const features = [
    { icon: Landmark, title: 'Tax & Fees', desc: 'Pay Land tax, Name transfer fees, and Nagar Nigam Tax with blockchain-secured transactions.' },
    { icon: FileCheck, title: 'AI Doc Verification', desc: 'Upload and verify documents instantly with AI-powered checks.' },
    { icon: Ticket, title: 'Smart Token System', desc: 'Skip the queue with intelligent token generation and appointment booking.' },
    { icon: Shield, title: 'Blockchain Security', desc: 'Every transaction is secured with smart contracts and immutable records.' },
  ]

  return (
    <div className="landing-page">
      <HeroBackground />

      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="flex items-center gap-2">
            <div className="logo-icon">
              <Building size={18} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.03em' }}>SmartGov</span>
          </div>
          <nav className="landing-nav">
            {mounted && (
              <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
            <Link href="/login?role=citizen" className="btn btn-outline landing-login-btn" id="citizen-login-header">
              <Users size={16} />
              Citizen Login
            </Link>
            <Link href="/login?role=employee" className="btn btn-primary landing-login-btn" id="employee-login-header">
              <Shield size={16} />
              Employee Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-badge animate-fade-in">
          <Sparkles size={14} />
          Blockchain-Powered Government Services
        </div>
        <h1 className="hero-title animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Smart Government<br />Office Management
        </h1>
        <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Streamline your government office visits with AI-powered load balancing, smart tokens,
          and blockchain-secured fee payments. No more long queues.
        </p>
        <div className="hero-actions animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link href="/login?role=citizen" className="btn btn-primary btn-lg" id="citizen-get-started">
            Get Started as Citizen
            <ArrowRight size={18} />
          </Link>
          <Link href="/login?role=employee" className="btn btn-outline btn-lg" id="employee-portal-btn">
            Employee Portal
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features-section animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <h2 className="section-title">Everything You Need</h2>
        <p className="section-subtitle">Modern tools to make government services efficient and transparent</p>
        <div className="features-grid">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="feature-card glass-panel" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                <div className="feature-icon-wrap">
                  <Icon size={24} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Role Cards */}
      <section className="roles-section animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <h2 className="section-title">Choose Your Portal</h2>
        <div className="roles-grid">
          <Link href="/login?role=citizen" className="role-card glass-panel" id="citizen-role-card">
            <div className="role-icon citizen-icon">
              <Users size={32} />
            </div>
            <h3>Citizen Portal</h3>
            <ul className="role-features">
              <li>Pay Land Tax & Nagar Nigam Tax</li>
              <li>Apply for Land Name Transfer</li>
              <li>Track Application Status</li>
              <li>Blockchain-verified Receipts</li>
            </ul>
            <div className="role-cta">
              Enter Portal <ArrowRight size={16} />
            </div>
          </Link>

          <Link href="/login?role=employee" className="role-card glass-panel" id="employee-role-card">
            <div className="role-icon employee-icon">
              <Shield size={32} />
            </div>
            <h3>Employee Portal</h3>
            <ul className="role-features">
              <li>Monitor Office Load Dashboard</li>
              <li>AI Doc Verification</li>
              <li>Manage Token Queue</li>
              <li>View All Transaction Status</li>
            </ul>
            <div className="role-cta">
              Enter Portal <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 SmartGov — Government Office Load Management System</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.03em' }}>Made by Team Sero Coders</p>
      </footer>
    </div>
  )
}
