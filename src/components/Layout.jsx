"use client"

import { useState, useEffect, useMemo } from 'react'
import { Activity, LayoutDashboard, FileCheck, Ticket, CalendarClock, LogOut, Sun, Moon, Clock, Landmark, Receipt, Shield, BarChart3, Users, AlertTriangle, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function SpaceBackground() {
  const stars = useMemo(() => {
    const rng = seededRandom(42)
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${rng() * 100}%`,
      top: `${rng() * 100}%`,
      size: `${rng() * 2 + 1}px`,
      duration: `${rng() * 4 + 2}s`,
      delay: `${rng() * 5}s`,
    }))
  }, [])

  const meteors = useMemo(() => {
    const rng = seededRandom(99)
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      left: `${rng() * 80 + 10}%`,
      top: `${rng() * 30}%`,
      duration: `${rng() * 4 + 6}s`,
      delay: `${i * 3 + rng() * 2}s`,
    }))
  }, [])

  return (
    <div className="space-bg">
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
      {meteors.map(meteor => (
        <div
          key={`meteor-${meteor.id}`}
          className="meteor"
          style={{
            left: meteor.left,
            top: meteor.top,
            '--duration': meteor.duration,
            animationDelay: meteor.delay,
          }}
        />
      ))}
      <div className="nebula" style={{ width: '400px', height: '400px', top: '20%', right: '10%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent)' }} />
      <div className="nebula" style={{ width: '300px', height: '300px', bottom: '15%', left: '20%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2), transparent)', animationDelay: '10s' }} />
    </div>
  )
}

export default function Layout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('smartgov-theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }
    const storedUser = localStorage.getItem('smartgov-user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
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

  const handleLogout = () => {
    localStorage.removeItem('smartgov-user')
    router.push('/')
  }

  const role = user?.role || 'employee'

  // EMPLOYEE = Government Authority — administrative/management tools only
  const employeeTabs = [
    { id: 'dashboard', label: 'Office Load Monitor', icon: BarChart3, href: '/dashboard' },
    { id: 'transactions', label: 'Revenue & Transactions', icon: Receipt, href: '/transactions' },
    { id: 'token', label: 'Queue Management', icon: Ticket, href: '/token' },
    { id: 'admin', label: 'Admin Panel', icon: Settings, href: '/admin' },
  ]

  // CITIZEN = Public-facing services
  const citizenTabs = [
    { id: 'citizen', label: 'Fees & Tax Payment', icon: Landmark, href: '/citizen' },
    { id: 'document', label: 'AI Doc Verification', icon: FileCheck, href: '/document' },
    { id: 'officer', label: 'Book Appointment', icon: CalendarClock, href: '/officer' },
    { id: 'token', label: 'Smart Token System', icon: Ticket, href: '/token' },
  ]

  const tabs = role === 'citizen' ? citizenTabs : employeeTabs
  const activeTabObj = tabs.find(t => t.href === pathname) || tabs[0]

  const portalLabel = role === 'employee' ? 'Government Authority' : 'Citizen Services'

  return (
    <div className="app-container">
      <SpaceBackground />

      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon" style={role === 'employee' ? { background: 'linear-gradient(135deg, #dc2626, #b91c1c)' } : undefined}>
            {role === 'employee' ? <Shield size={20} /> : <Activity size={20} />}
          </div>
          <div>
            <h2 style={{fontSize: '1.15rem', marginBottom: 0}}>SmartGov</h2>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{portalLabel}</span>
          </div>
        </div>

        {user && (
          <div style={{
            padding: '0.75rem', borderRadius: 'var(--radius-md)',
            background: role === 'employee' ? 'rgba(220, 38, 38, 0.06)' : 'rgba(99, 102, 241, 0.06)',
            marginBottom: '1.5rem', fontSize: '0.85rem',
            borderLeft: role === 'employee' ? '3px solid #dc2626' : '3px solid var(--primary)'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '0.15rem' }}>{user.name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {role === 'employee' ? 'Authorized Officer' : 'Registered Citizen'}
            </div>
          </div>
        )}

        <nav className="nav-links" style={{flex: 1}}>
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{textDecoration: 'none'}}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="nav-item" onClick={handleLogout} style={{color: 'var(--danger)', marginTop: 'auto', cursor: 'pointer'}}>
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </aside>

      <main className="main-content">
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <div>
            <h1 className="animate-fade-in" style={{marginBottom: '0.25rem'}}>
              {activeTabObj.label}
            </h1>
            <p className="animate-fade-in" style={{animationDelay: '0.1s'}}>
              {role === 'citizen'
                ? 'Access government services and manage your applications.'
                : 'Government administrative control panel — monitor, manage, and authorize.'}
            </p>
          </div>
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
            {mounted && (
              <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <div className="badge badge-info text-sm" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
              <Clock size={14} />
              Office Hours: 10 AM – 5 PM
            </div>
            <div className="glass-panel" style={{
              padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500,
              borderLeft: role === 'employee' ? '3px solid #dc2626' : undefined
            }}>
              {role === 'employee' ? `Officer ${user?.name || 'Guest'}` : (user?.name || 'Guest')}
            </div>
          </div>
        </header>

        <div className="animate-fade-in" style={{animationDelay: '0.2s', flex: 1}}>
          {children}
        </div>

        <footer style={{ textAlign: 'center', padding: '1.25rem 1rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.03em' }}>
          Made by Team Sero Coders
        </footer>
      </main>
    </div>
  )
}
