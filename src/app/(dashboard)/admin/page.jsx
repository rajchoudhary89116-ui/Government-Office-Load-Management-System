"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Users, AlertTriangle, CheckCircle, Bell, FileText, TrendingUp, Building } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [approvals, setApprovals] = useState([
    { id: 1, type: 'Land Name Transfer', citizen: 'Rajesh Verma', date: '13 Mar 2026', status: 'pending', priority: 'high' },
    { id: 2, type: 'Income Certificate', citizen: 'Priya Sharma', date: '12 Mar 2026', status: 'pending', priority: 'high' },
    { id: 3, type: 'Domicile Certificate', citizen: 'Amit Patel', date: '12 Mar 2026', status: 'pending', priority: 'medium' },
    { id: 4, type: 'Nagar Nigam Tax Refund', citizen: 'Sunita Devi', date: '11 Mar 2026', status: 'pending', priority: 'high' },
    { id: 5, type: 'Caste Certificate', citizen: 'Vikram Singh', date: '11 Mar 2026', status: 'pending', priority: 'medium' },
    { id: 6, type: 'Land Tax Reassessment', citizen: 'Meena Kumari', date: '10 Mar 2026', status: 'pending', priority: 'low' },
  ])

  useEffect(() => {
    const stored = localStorage.getItem('smartgov-user')
    if (!stored) {
      router.push('/login?role=employee')
      return
    }
    const parsed = JSON.parse(stored)
    if (parsed.role !== 'employee') {
      router.push('/login?role=employee')
      return
    }
    setUser(parsed)
  }, [router])

  const transactions = (() => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem('smartgov-transactions')
    return saved ? JSON.parse(saved) : []
  })()

  const handleApprove = (id) => {
    setApprovals(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'approved', approvedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) } : item
    ))
  }

  const pendingCount = approvals.filter(a => a.status === 'pending').length
  const approvedCount = approvals.filter(a => a.status === 'approved').length

  const recentNotifications = [
    { msg: 'Land Name Transfer #LNT-4821 requires your signature', time: '5 min ago', type: 'urgent' },
    { msg: 'Daily revenue report generated — ₹1,24,500 collected today', time: '1 hr ago', type: 'info' },
    { msg: 'Citizen grievance #GRV-1102 escalated to your office', time: '2 hrs ago', type: 'urgent' },
    { msg: 'System maintenance scheduled for tonight 11 PM – 2 AM', time: '3 hrs ago', type: 'info' },
  ]

  if (!user) return null

  return (
    <div className="flex-col gap-6">
      {/* Authority Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-panel">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pending Approvals</h3>
            <AlertTriangle size={18} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>{pendingCount}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Require immediate action</p>
        </div>
        <div className="glass-panel">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Approved Today</h3>
            <CheckCircle size={18} color="var(--success)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{approvedCount}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Processed by your office</p>
        </div>
        <div className="glass-panel">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Today's Revenue</h3>
            <TrendingUp size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
            ₹{(transactions.reduce((sum, t) => sum + t.amount + 25, 0) || 124500).toLocaleString()}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From {transactions.length || 47} transactions</p>
        </div>
        <div className="glass-panel">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Offices Online</h3>
            <Building size={18} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>12</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Out of 14 total</p>
        </div>
      </div>

      {/* Pending Approvals — all have Approve button */}
      <div className="glass-panel">
        <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
          <div className="flex items-center gap-3">
            <Shield size={22} color="var(--danger)" />
            <h2 style={{ marginBottom: 0 }}>Pending Approvals & Authorizations</h2>
          </div>
          <div className="flex items-center gap-3">
            {approvedCount > 0 && <span className="badge badge-success">{approvedCount} Approved</span>}
            {pendingCount > 0 && <span className="badge badge-danger">{pendingCount} Pending</span>}
          </div>
        </div>

        <div className="flex-col gap-4">
          {approvals.map(item => {
            const isApproved = item.status === 'approved'
            return (
              <div key={item.id} style={{
                padding: '1.25rem', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)', backgroundColor: 'var(--surface)',
                borderLeft: `4px solid ${isApproved ? 'var(--success)' : item.priority === 'high' ? 'var(--danger)' : item.priority === 'medium' ? 'var(--warning)' : 'var(--secondary)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                opacity: isApproved ? 0.7 : 1,
                transition: 'all 0.4s ease'
              }}>
                <div className="flex items-center gap-4">
                  <div style={{
                    width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                    background: isApproved ? 'rgba(46, 125, 91, 0.08)' : 'rgba(26, 58, 107, 0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {isApproved ? <CheckCircle size={20} color="var(--success)" /> : <FileText size={20} color="var(--primary)" />}
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '0.15rem' }}>{item.type}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Applicant: {item.citizen} • Submitted: {item.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isApproved ? (
                    <>
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> Approved at {item.approvedAt}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={`badge ${item.priority === 'high' ? 'badge-danger' : item.priority === 'medium' ? 'badge-warning' : 'badge-info'}`}>
                        {item.priority === 'high' ? 'Urgent' : item.priority === 'medium' ? 'Normal' : 'Low Priority'}
                      </span>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 1.25rem', fontSize: '0.8rem', gap: '0.35rem' }}
                        onClick={() => handleApprove(item.id)}
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-panel">
        <div className="flex items-center gap-3" style={{ marginBottom: '1.5rem' }}>
          <Bell size={20} color="var(--warning)" />
          <h2 style={{ marginBottom: 0 }}>System Notifications</h2>
        </div>
        <div className="flex-col gap-3">
          {recentNotifications.map((n, i) => (
            <div key={i} style={{
              padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)',
              backgroundColor: n.type === 'urgent' ? 'rgba(160, 50, 60, 0.04)' : 'rgba(26, 58, 107, 0.03)',
              border: `1px solid ${n.type === 'urgent' ? 'rgba(160,50,60,0.12)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div className="flex items-center gap-3">
                {n.type === 'urgent'
                  ? <AlertTriangle size={16} color="var(--danger)" />
                  : <CheckCircle size={16} color="var(--primary)" />}
                <span style={{ fontSize: '0.85rem' }}>{n.msg}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{n.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
