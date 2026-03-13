"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, Users, AlertTriangle, CheckCircle, Bell, FileText, TrendingUp, Building, MessageSquare, Clock, ThumbsUp, AlertCircle } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = searchParams.get('view')
  const [user, setUser] = useState(null)
  const [grievances, setGrievances] = useState([])
  const [approvals, setApprovals] = useState([
    { id: 1, type: 'Land Name Transfer', citizen: 'Rajesh Verma', date: '13 Mar 2026', status: 'pending', priority: 'high' },
    { id: 2, type: 'Income Certificate', citizen: 'Priya Sharma', date: '12 Mar 2026', status: 'pending', priority: 'high' },
    { id: 3, type: 'Domicile Certificate', citizen: 'Amit Patel', date: '12 Mar 2026', status: 'pending', priority: 'medium' },
    { id: 4, type: 'Nagar Nigam Tax Refund', citizen: 'Sunita Devi', date: '11 Mar 2026', status: 'pending', priority: 'high' },
    { id: 5, type: 'Caste Certificate', citizen: 'Vikram Singh', date: '11 Mar 2026', status: 'pending', priority: 'medium' },
    { id: 6, type: 'Land Tax Reassessment', citizen: 'Meena Kumari', date: '10 Mar 2026', status: 'pending', priority: 'low' },
  ])

  useEffect(() => {
    const savedGr = localStorage.getItem('smartgov-grievances')
    if (savedGr) {
      setGrievances(JSON.parse(savedGr))
    }

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

  const highPriorityGrievanceCount = grievances.filter(g => g.likes > 20).length

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
    ...(highPriorityGrievanceCount > 0 ? [{ msg: `${highPriorityGrievanceCount} Citizen grievances escalated to High Priority by public support`, time: 'Just now', type: 'urgent' }] : []),
    { msg: 'System maintenance scheduled for tonight 11 PM – 2 AM', time: '3 hrs ago', type: 'info' },
  ]

  if (!user) return null

  return (
    <div className="flex-col gap-6">
      {view === 'grievances' ? (
        <div className="flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 style={{ margin: 0 }}>Grievance Hotline (Admin View)</h1>
            <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={14} /> AI Monitoring Enabled
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(90deg, rgba(220, 38, 38, 0.05), transparent)', borderLeft: '4px solid #dc2626' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#dc2626" /> Citizens Concerns Overview
            </h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Review reports submitted by citizens. High-priority issues are flagged based on social support.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {grievances.length === 0 ? (
              <div className="glass-panel grid-span-2" style={{ textAlign: 'center', padding: '4rem' }}>
                <MessageSquare size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                <p>No active grievances found.</p>
              </div>
            ) : (
              grievances.sort((a, b) => b.likes - a.likes).map(g => (
                <div key={g.id} className="glass-panel flex-col" style={{ padding: '1.25rem', gap: '1rem' }}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                        {g.user?.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{g.user}</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{g.date}</p>
                      </div>
                    </div>
                    <span className={`badge badge-${g.status === 'In Progress' ? 'warning' : 'info'}`} style={{ fontSize: '0.65rem' }}>
                      {g.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-main)', margin: 0 }}>{g.text}</p>

                  {g.images && g.images.length > 0 && (
                    <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
                      {g.images.map((img, i) => (
                        <img key={i} src={img} alt="grievance" style={{ height: '120px', width: '100%', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2" style={{ color: 'var(--success)' }}>
                        <ThumbsUp size={16} />
                        <span style={{ fontWeight: 700 }}>{g.likes} Supports</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: g.likes > 20 ? '#dc2626' : 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={14} /> {g.likes > 20 ? 'HIGH PRIORITY ESCALATION' : 'Normal Priority'}
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.75rem', padding: '0.4rem' }}>
                      Acknowledge & Investigate
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <>
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

          {/* Pending Approvals */}
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
        </>
      )}
    </div>
  )
}
