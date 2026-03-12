"use client"

import { Activity, LayoutDashboard, FileCheck, Ticket, CalendarClock, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Layout({ children }) {
  const pathname = usePathname()

  const tabs = [
    { id: 'dashboard', label: 'Monitor Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'document', label: 'AI Doc Verification', icon: FileCheck, href: '/document' },
    { id: 'token', label: 'Smart Token System', icon: Ticket, href: '/token' },
    { id: 'officer', label: 'Officer Scheduling', icon: CalendarClock, href: '/officer' },
  ]

  const activeTabObj = tabs.find(t => t.href === pathname) || tabs[0]

  return (
    <div className="app-container">
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
            <div className="badge badge-success text-sm">
              <span style={{marginRight: '6px', display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)'}}></span>
              System Online
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
