"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Landmark, FileText, CreditCard, CheckCircle, Clock, ArrowRight, Hash, Shield, AlertTriangle, ChevronDown, ChevronUp, FileCheck, Copy } from 'lucide-react'

function generateHash() {
  const chars = '0123456789abcdef'
  let hash = '0x'
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

function generateToken() {
  return 'TKN-' + Math.random().toString(36).substr(2, 8).toUpperCase()
}

const SERVICES = [
  {
    id: 'land_tax',
    name: 'Land Tax Payment',
    icon: Landmark,
    fee: 2500,
    description: 'Pay annual land tax for your registered property.',
    color: '#10b981',
  },
  {
    id: 'name_transfer',
    name: 'Land Name Transfer',
    icon: FileText,
    fee: 5000,
    description: 'Apply for ownership name transfer on land records.',
    color: '#f59e0b',
  },
  {
    id: 'nagar_nigam',
    name: 'Nagar Nigam Tax',
    icon: CreditCard,
    fee: 1800,
    description: 'Municipal corporation tax payment for your ward.',
    color: '#6366f1',
  },
]

const CERTIFICATE_DOCS = {
  income_certificate: {
    title: 'Income Certificate',
    subtitle: 'Required documents for Income Certificate application',
    fee: 50,
    items: [
      { doc: 'Aadhaar Card', copies: '2x Photocopies', mandatory: true },
      { doc: 'PAN Card', copies: '2x Photocopies', mandatory: true },
      { doc: 'Salary Slip / Income Proof', copies: '1x Original + 1x Photocopy', mandatory: true },
      { doc: 'Bank Statement (Last 6 months)', copies: '1x Original', mandatory: true },
      { doc: 'Ration Card', copies: '1x Photocopy', mandatory: true },
      { doc: 'Passport Size Photographs', copies: '2 Nos.', mandatory: true },
      { doc: 'Self-Declaration Affidavit', copies: '1x Original (Notarized)', mandatory: true },
      { doc: 'Address Proof (Electricity/Water Bill)', copies: '1x Photocopy', mandatory: false },
      { doc: 'Previous Year ITR (if applicable)', copies: '1x Photocopy', mandatory: false },
    ],
  },
  domicile_certificate: {
    title: 'Domicile Certificate',
    subtitle: 'Required documents for Domicile Certificate application',
    fee: 30,
    items: [
      { doc: 'Aadhaar Card', copies: '2x Photocopies', mandatory: true },
      { doc: 'Birth Certificate', copies: '1x Original + 1x Photocopy', mandatory: true },
      { doc: 'School Leaving Certificate / Marksheet', copies: '1x Photocopy', mandatory: true },
      { doc: 'Ration Card', copies: '1x Photocopy', mandatory: true },
      { doc: 'Passport Size Photographs', copies: '2 Nos.', mandatory: true },
      { doc: 'Address Proof (Electricity/Water Bill)', copies: '1x Photocopy', mandatory: false },
    ],
  },
  caste_certificate: {
    title: 'Caste Certificate',
    subtitle: 'Required documents for Caste Certificate application',
    fee: 30,
    items: [
      { doc: 'Aadhaar Card', copies: '2x Photocopies', mandatory: true },
      { doc: 'Father\'s Caste Certificate', copies: '1x Original + 1x Photocopy', mandatory: true },
      { doc: 'School Leaving Certificate', copies: '1x Photocopy', mandatory: true },
      { doc: 'Ration Card', copies: '1x Photocopy', mandatory: true },
      { doc: 'Passport Size Photographs', copies: '2 Nos.', mandatory: true },
      { doc: 'Affidavit on Stamp Paper', copies: '1x Original (Notarized)', mandatory: true },
    ],
  },
}

export default function CitizenDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [step, setStep] = useState('select')
  const [txHash, setTxHash] = useState('')
  const [token, setToken] = useState('')
  const [transactions, setTransactions] = useState([])
  const [expandedCert, setExpandedCert] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('smartgov-user')
    if (!stored) {
      router.push('/login?role=citizen')
      return
    }
    const parsed = JSON.parse(stored)
    if (parsed.role !== 'citizen') {
      router.push('/login?role=citizen')
      return
    }
    setUser(parsed)
    const savedTx = localStorage.getItem('smartgov-transactions')
    if (savedTx) {
      setTransactions(JSON.parse(savedTx))
    }
  }, [router])

  const handlePay = () => {
    setStep('processing')
    setTimeout(() => {
      const hash = generateHash()
      const tkn = generateToken()
      setTxHash(hash)
      setToken(tkn)

      const newTx = {
        id: Date.now(),
        service: selectedService.name,
        serviceId: selectedService.id,
        amount: selectedService.fee,
        txHash: hash,
        token: tkn,
        status: 'Completed',
        date: new Date().toLocaleString('en-IN'),
        citizen: user?.email || 'citizen@example.com',
      }

      const updated = [...transactions, newTx]
      setTransactions(updated)
      localStorage.setItem('smartgov-transactions', JSON.stringify(updated))
      setStep('receipt')
    }, 2500)
  }

  const resetFlow = () => {
    setSelectedService(null)
    setStep('select')
    setTxHash('')
    setToken('')
  }

  if (!user) return null

  return (
    <div className="flex-col gap-6">
      {/* Service Selection */}
      {step === 'select' && (
        <>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Welcome, {user.name}</h2>
            <p>Select a service to pay fees or apply for government services</p>
          </div>

          {/* Tax Payment Cards */}
          <div className="grid grid-cols-3 gap-6">
            {SERVICES.map(service => {
              const Icon = service.icon
              return (
                <button
                  key={service.id}
                  className="glass-panel service-card"
                  onClick={() => { setSelectedService(service); setStep('confirm') }}
                  style={{ cursor: 'pointer', textAlign: 'left', border: 'none', width: '100%' }}
                  id={`service-${service.id}`}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: `${service.color}20`, color: service.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
                  }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{service.name}</h3>
                  <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-main)' }}>₹{service.fee.toLocaleString()}</span>
                    <ArrowRight size={18} color="var(--primary)" />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Certificate Document Requirements */}
          <div className="glass-panel">
            <div className="flex items-center gap-3" style={{ marginBottom: '1.5rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FileCheck size={22} />
              </div>
              <div>
                <h2 style={{ marginBottom: '0.1rem' }}>Certificate Applications</h2>
                <p style={{ fontSize: '0.85rem' }}>Tap to view required documents for each certificate</p>
              </div>
            </div>

            <div className="flex-col gap-3">
              {Object.entries(CERTIFICATE_DOCS).map(([key, cert]) => {
                const isExpanded = expandedCert === key
                return (
                  <div key={key} style={{
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface)', overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}>
                    <button
                      onClick={() => setExpandedCert(isExpanded ? null : key)}
                      style={{
                        width: '100%', padding: '1rem 1.25rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        border: 'none', background: 'none', cursor: 'pointer',
                        color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '1rem'
                      }}
                      id={`cert-${key}`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} color={isExpanded ? 'var(--primary)' : 'var(--text-muted)'} />
                        <div style={{ textAlign: 'left' }}>
                          <span style={{ fontWeight: 600 }}>{cert.title}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>Fee: ₹{cert.fee}</span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                    </button>

                    {isExpanded && (
                      <div className="animate-fade-in" style={{ padding: '0 1.25rem 1.25rem' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                          {cert.subtitle}
                        </p>
                        <div className="flex-col gap-2">
                          {cert.items.map((item, idx) => (
                            <div key={idx} style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '0.6rem 0.75rem', borderRadius: '8px',
                              backgroundColor: item.mandatory ? 'rgba(239, 68, 68, 0.03)' : 'rgba(16, 185, 129, 0.03)',
                              border: `1px solid ${item.mandatory ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}`,
                            }}>
                              <div className="flex items-center gap-2">
                                <Copy size={14} color="var(--text-muted)" />
                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.doc}</span>
                                {item.mandatory && (
                                  <span style={{ fontSize: '0.65rem', color: '#dc2626', background: 'rgba(220,38,38,0.08)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                                    REQUIRED
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>
                                {item.copies}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                          <p style={{ fontSize: '0.8rem', color: 'var(--warning)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                            Please carry all original documents for verification at the counter. Photocopies should be self-attested.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* My Past Transactions */}
          {transactions.length > 0 && (
            <div className="glass-panel">
              <h2 style={{ marginBottom: '1rem' }}>My Transactions</h2>
              <div className="flex-col gap-4">
                {transactions.slice().reverse().map(tx => (
                  <div key={tx.id} style={{
                    padding: '1rem', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)', backgroundColor: 'var(--surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <div>
                      <h4 style={{ marginBottom: '0.25rem' }}>{tx.service}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tx.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Token</p>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem', fontFamily: 'monospace' }}>{tx.token}</p>
                      </div>
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={14} /> {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirm Payment */}
      {step === 'confirm' && selectedService && (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Confirm Payment</h2>

          <div style={{
            padding: '1.5rem', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)', backgroundColor: 'var(--surface)', marginBottom: '1.5rem'
          }}>
            <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: `${selectedService.color}20`, color: selectedService.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {(() => { const Icon = selectedService.icon; return <Icon size={24} /> })()}
              </div>
              <div>
                <h3 style={{ marginBottom: '0.1rem' }}>{selectedService.name}</h3>
                <p style={{ fontSize: '0.875rem' }}>{selectedService.description}</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
                <span>Service Fee</span>
                <span style={{ fontWeight: 600 }}>₹{selectedService.fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
                <span>Processing Fee</span>
                <span style={{ fontWeight: 600 }}>₹25</span>
              </div>
              <div className="flex justify-between" style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>
                  ₹{(selectedService.fee + 25).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2" style={{ marginBottom: '1.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.08)' }}>
            <Shield size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem' }}>This transaction is secured using Blockchain Smart Contract</span>
          </div>

          <div className="flex gap-4">
            <button className="btn btn-outline" onClick={resetFlow} style={{ flex: 1 }}>Cancel</button>
            <button className="btn btn-primary" onClick={handlePay} id="confirm-pay-btn" style={{ flex: 2, gap: '0.5rem' }}>
              <CreditCard size={18} />
              Pay ₹{(selectedService.fee + 25).toLocaleString()}
            </button>
          </div>
        </div>
      )}

      {/* Processing */}
      {step === 'processing' && (
        <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
          <div className="processing-spinner" style={{ marginBottom: '1.5rem' }}>
            <Shield size={40} color="var(--primary)" className="spin-icon" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Processing Transaction</h2>
          <p style={{ marginBottom: '1rem' }}>Executing smart contract on blockchain...</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
            <span>→ Validating identity...</span>
            <span>→ Deploying smart contract...</span>
            <span>→ Awaiting block confirmation...</span>
          </div>
        </div>
      )}

      {/* Receipt */}
      {step === 'receipt' && (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
            }}>
              <CheckCircle size={32} />
            </div>
            <h2 style={{ color: 'var(--success)', marginBottom: '0.25rem' }}>Payment Successful</h2>
            <p>Your transaction is recorded on the blockchain</p>
          </div>

          <div style={{
            padding: '1.5rem', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)', backgroundColor: 'var(--surface)', marginBottom: '1.5rem'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Service</p>
              <p style={{ fontWeight: 600 }}>{selectedService?.name}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Amount Paid</p>
              <p style={{ fontWeight: 600 }}>₹{((selectedService?.fee || 0) + 25).toLocaleString()}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                <Hash size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Transaction Hash
              </p>
              <p style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all', color: 'var(--primary)' }}>{txHash}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Service Token</p>
              <p style={{ fontWeight: 700, fontSize: '1.25rem', fontFamily: 'monospace', color: 'var(--success)' }}>{token}</p>
            </div>
          </div>

          <button className="btn btn-primary" onClick={resetFlow} style={{ width: '100%', gap: '0.5rem' }} id="new-transaction-btn">
            New Transaction <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
