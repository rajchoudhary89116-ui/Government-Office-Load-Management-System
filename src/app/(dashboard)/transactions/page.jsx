"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Hash, CheckCircle, Clock, AlertTriangle, Search, CreditCard, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

// Pre-populated realistic transaction data
const SEED_TRANSACTIONS = [
  { id: 1001, service: 'Land Tax Payment', serviceId: 'land_tax', amount: 2500, txHash: '0x3a9f7c1e8b4d2a6f0e5c9b7d1a4f8e2c6b0d3a7f1e9c5b8d2a4f6e0c3b7d9a1f5e8c2b4d6a0f3e7c9b1d5a8f2e4c6b0d', token: 'TKN-A8F2E4C6', status: 'Completed', date: '13/3/2026, 9:12:44 am', citizen: 'rajesh.verma@gmail.com' },
  { id: 1002, service: 'Nagar Nigam Tax', serviceId: 'nagar_nigam', amount: 1800, txHash: '0x7b2e9d4f1c6a8e3b5d0f7c2a9e4b6d1f8c3a5e7b0d2f9c4a6e1b3d8f5c7a0e2b4d9f6c1a3e5b7d0f2c8a4e6b1d3f9c5a', token: 'TKN-B4D9F6C1', status: 'Completed', date: '13/3/2026, 9:45:20 am', citizen: 'priya.sharma@outlook.com' },
  { id: 1003, service: 'Land Name Transfer', serviceId: 'name_transfer', amount: 5000, txHash: '0x1c4e8b2d6f0a3c7e9b5d1f4a8c2e6b0d3f7a9c1e5b8d2f4a6c0e3b7d9f1a5c8e2b4d6f0a3c7e9b1d5f8a2c4e6b0d3f7a9', token: 'TKN-E2B4D6F0', status: 'Completed', date: '12/3/2026, 2:30:15 pm', citizen: 'amit.patel@yahoo.com' },
  { id: 1004, service: 'Land Tax Payment', serviceId: 'land_tax', amount: 2500, txHash: '0x5d8f2a4c6e0b3d7f9a1c5e8b2d4f6a0c3e7b9d1f5a8c2e4b6d0f3a7c9e1b5d8f2a4c6e0b3d7f9a1c5e8b2d4f6a0c3e7b', token: 'TKN-F2A4C6E0', status: 'Completed', date: '12/3/2026, 11:05:33 am', citizen: 'sunita.devi@gmail.com' },
  { id: 1005, service: 'Nagar Nigam Tax', serviceId: 'nagar_nigam', amount: 1800, txHash: '0x9e1b5d8f2a4c6e0b3d7f9a1c5e8b2d4f6a0c3e7b9d1f5a8c2e4b6d0f3a7c9e1b5d8f2a4c6e0b3d7f9a1c5e8b2d4f6a0c', token: 'TKN-D1F5A8C2', status: 'Completed', date: '11/3/2026, 4:22:10 pm', citizen: 'vikram.singh@gmail.com' },
  { id: 1006, service: 'Land Name Transfer', serviceId: 'name_transfer', amount: 5000, txHash: '0x2b4d6f0a3c7e9b1d5f8a2c4e6b0d3f7a9c1e5b8d2f4a6c0e3b7d9f1a5c8e2b4d6f0a3c7e9b1d5f8a2c4e6b0d3f7a9c1e5', token: 'TKN-C0E3B7D9', status: 'Completed', date: '11/3/2026, 10:18:45 am', citizen: 'meena.kumari@hotmail.com' },
  { id: 1007, service: 'Land Tax Payment', serviceId: 'land_tax', amount: 2500, txHash: '0x6e0b3d7f9a1c5e8b2d4f6a0c3e7b9d1f5a8c2e4b6d0f3a7c9e1b5d8f2a4c6e0b3d7f9a1c5e8b2d4f6a0c3e7b9d1f5a8c', token: 'TKN-A7C9E1B5', status: 'Completed', date: '10/3/2026, 3:50:22 pm', citizen: 'ramesh.gupta@gmail.com' },
  { id: 1008, service: 'Nagar Nigam Tax', serviceId: 'nagar_nigam', amount: 1800, txHash: '0x4f6a0c3e7b9d1f5a8c2e4b6d0f3a7c9e1b5d8f2a4c6e0b3d7f9a1c5e8b2d4f6a0c3e7b9d1f5a8c2e4b6d0f3a7c9e1b5d', token: 'TKN-B3D7F9A1', status: 'Completed', date: '10/3/2026, 10:30:00 am', citizen: 'priya.sharma@outlook.com' },
]

export default function TransactionsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

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

    // Merge seed data with any citizen-created transactions
    const savedTx = localStorage.getItem('smartgov-transactions')
    const citizenTx = savedTx ? JSON.parse(savedTx) : []
    const allTx = [...SEED_TRANSACTIONS, ...citizenTx]
    // Deduplicate by id
    const unique = allTx.filter((tx, i, arr) => arr.findIndex(t => t.id === tx.id) === i)
    setTransactions(unique)
  }, [router])

  const filtered = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.serviceId === filter
    const matchesSearch = searchTerm === '' ||
      tx.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.citizen && tx.citizen.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount + 25, 0)
  const uniqueCitizens = new Set(transactions.map(t => t.citizen)).size

  // Revenue by service
  const revenueByService = {
    'Land Tax Payment': transactions.filter(t => t.serviceId === 'land_tax').reduce((s, t) => s + t.amount + 25, 0),
    'Name Transfer': transactions.filter(t => t.serviceId === 'name_transfer').reduce((s, t) => s + t.amount + 25, 0),
    'Nagar Nigam Tax': transactions.filter(t => t.serviceId === 'nagar_nigam').reduce((s, t) => s + t.amount + 25, 0),
  }
  const maxRevenue = Math.max(...Object.values(revenueByService), 1)

  if (!user) return null

  return (
    <div className="flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-panel">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Transactions</h3>
            <CreditCard size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{transactions.length}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={12} /> +12% from last week
          </p>
        </div>
        <div className="glass-panel">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Revenue Collected</h3>
            <TrendingUp size={18} color="var(--success)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>₹{totalAmount.toLocaleString()}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={12} /> +₹8,250 today
          </p>
        </div>
        <div className="glass-panel">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Unique Citizens</h3>
            <Users size={18} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{uniqueCitizens}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active this period</p>
        </div>
        <div className="glass-panel">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Avg. Transaction</h3>
            <Hash size={18} color="var(--secondary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>₹{transactions.length ? Math.round(totalAmount / transactions.length).toLocaleString() : 0}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Per payment</p>
        </div>
      </div>

      {/* Revenue Breakdown Chart */}
      <div className="glass-panel">
        <h2 style={{ marginBottom: '0.25rem' }}>Revenue by Service</h2>
        <p style={{ fontSize: '0.8rem', marginBottom: '1.5rem' }}>Breakdown of collected revenue across service categories</p>
        <div className="flex-col gap-4">
          {Object.entries(revenueByService).map(([name, amount]) => {
            const pct = Math.round((amount / maxRevenue) * 100)
            return (
              <div key={name}>
                <div className="flex items-center justify-between" style={{ marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{name}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>₹{amount.toLocaleString()}</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`, height: '100%',
                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                    borderRadius: '2px',
                    transition: 'width 0.6s ease'
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment History Table */}
      <div className="glass-panel">
        <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ marginBottom: 0 }}>Payment History</h2>
          <div className="flex items-center gap-4">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input-field"
                placeholder="Search by token, hash, citizen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.25rem', minWidth: '260px' }}
                id="tx-search"
              />
            </div>
            <select
              className="input-field"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ minWidth: '150px' }}
              id="tx-filter"
            >
              <option value="all">All Services</option>
              <option value="land_tax">Land Tax</option>
              <option value="name_transfer">Name Transfer</option>
              <option value="nagar_nigam">Nagar Nigam</option>
            </select>
          </div>
        </div>

        {/* Table Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 0.8fr',
          padding: '0.6rem 1rem', fontSize: '0.7rem', fontWeight: 700,
          color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em',
          borderBottom: '2px solid var(--border)', marginBottom: '0.5rem'
        }}>
          <span>Service / Citizen</span>
          <span>Token / Hash</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <AlertTriangle size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No transactions match your search</p>
          </div>
        ) : (
          <div className="flex-col">
            {filtered.slice().reverse().map(tx => (
              <div key={tx.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 0.8fr',
                padding: '0.85rem 1rem', borderBottom: '1px solid var(--border)',
                alignItems: 'center', fontSize: '0.85rem',
                transition: 'background 0.2s'
              }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.1rem' }}>{tx.service}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.citizen}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem' }}>{tx.token}</div>
                  <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tx.txHash}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{(tx.amount + 25).toLocaleString()}</div>
                <div>
                  <div style={{ fontSize: '0.8rem' }}>{tx.date.split(',')[0]}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{tx.date.split(',')[1]}</div>
                </div>
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', justifyContent: 'center' }}>
                  <CheckCircle size={11} /> {tx.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 0.8fr',
          padding: '0.85rem 1rem', marginTop: '0.5rem',
          borderTop: '2px solid var(--border)',
          fontSize: '0.85rem', fontWeight: 700
        }}>
          <span>{filtered.length} transactions</span>
          <span></span>
          <span style={{ color: 'var(--success)' }}>₹{filtered.reduce((s, t) => s + t.amount + 25, 0).toLocaleString()}</span>
          <span></span>
          <span style={{ color: 'var(--success)', fontSize: '0.75rem' }}>All Verified</span>
        </div>
      </div>
    </div>
  )
}
