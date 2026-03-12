"use client"

import { useState, useEffect, useMemo } from 'react'
import { Activity, LayoutDashboard, FileCheck, Ticket, CalendarClock, LogOut, Sun, Moon, Clock } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
      <div
        className="nebula"
        style={{
          width: '400px',
          height: '400px',
          top: '20%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent)',
        }}
      />
      <div
        className="nebula"
        style={{
          width: '300px',
          height: '300px',
          bottom: '15%',
          left: '20%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2), transparent)',
          animationDelay: '10s',
        }}
      />
    </div>
  )
}

export default function Layout({ children }) {
  const pathname = usePathname()
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

  const tabs = [
    { id: 'dashboard', label: 'Monitor Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'document', label: 'AI Doc Verification', icon: FileCheck, href: '/document' },
    { id: 'token', label: 'Smart Token System', icon: Ticket, href: '/token' },
    { id: 'officer', label: 'Officer Scheduling', icon: CalendarClock, href: '/officer' },
  ]

  const activeTabObj = tabs.find(t => t.href === pathname) || tabs[0]

  return (
    <div className="app-container">
      <SpaceBackground />

      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">
            <Activity size={20} />
          </div>
          <h2 style={{fontSize: '1.25rem', marginBottom: 0}}>SmartGov</h2>
        </div>

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

        <div className="nav-item" style={{color: 'var(--danger)', marginTop: 'auto'}}>
          <LogOut size={18} />
          <span>Citizen Portal</span>
        </div>
      </aside>

      <main className="main-content">
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <div>
            <h1 className="animate-fade-in" style={{marginBottom: '0.25rem'}}>
              {activeTabObj.label}
            </h1>
            <p className="animate-fade-in" style={{animationDelay: '0.1s'}}>
              Manage your services dynamically and beat the crowd.
            </p>
          </div>
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
            {mounted && (
              <button
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <div className="badge badge-info text-sm" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
              <Clock size={14} />
              Office Hours: 10 AM – 5 PM
            </div>
            <div className="glass-panel" style={{padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500}}>
              Suresh Kumar
            </div>
          </div>
        </header>

        <div className="animate-fade-in" style={{animationDelay: '0.2s', flex: 1}}>
          {children}
        </div>
      </main>
    </div>
  )
}
