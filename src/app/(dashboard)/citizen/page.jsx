"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Landmark, FileText, CreditCard, CheckCircle, Clock, ArrowRight, Hash, Shield, AlertTriangle, ChevronDown, ChevronUp, FileCheck, Copy, MessageSquare, Plus, Image as ImageIcon, Send, X, AlertCircle, Camera, ThumbsUp, ThumbsDown, Users } from 'lucide-react'

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
  const searchParams = useSearchParams()
  const view = searchParams.get('view')
  const [user, setUser] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [step, setStep] = useState('select')
  const [txHash, setTxHash] = useState('')
  const [token, setToken] = useState('')
  const [transactions, setTransactions] = useState([])
  const [expandedCert, setExpandedCert] = useState(null)
  const [grievances, setGrievances] = useState([])
  const [grievanceText, setGrievanceText] = useState('')
  const [grievanceImages, setGrievanceImages] = useState([])
  const [isSubmittingGrievance, setIsSubmittingGrievance] = useState(false)
  const [grievanceTab, setGrievanceTab] = useState('feed') // 'submit' or 'feed'
  const [votedIds, setVotedIds] = useState({}) // track what the user has voted on

  useEffect(() => {
    if (view === 'grievance') {
      setStep('grievance')
    } else {
      setStep('select')
    }
  }, [view])

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
    const savedGr = localStorage.getItem('smartgov-grievances')
    if (savedGr) {
      setGrievances(JSON.parse(savedGr))
    } else {
      // Demo Data
      const demoGrievances = [
        {
          id: 101,
          text: "Pothole issue on the main market road. It's causing massive traffic jams during peak hours.",
          images: ["https://images.unsplash.com/photo-1544980766-72b589c682ee?auto=format&fit=crop&q=80&w=400"],
          status: 'In Progress',
          date: '12/03/2026, 09:15:00',
          user: 'Rahul Sharma',
          likes: 24,
          dislikes: 2
        },
        {
          id: 102,
          text: "Street lights are not working near the park entrance since last three days. It feels unsafe for evening walkers.",
          images: [],
          status: 'Submitted',
          date: '12/03/2026, 11:30:00',
          user: 'Anita Gupta',
          likes: 15,
          dislikes: 0
        },
        {
          id: 103,
          text: "Garbage collection truck hasn't arrived in Ward 4 for the past two days. Foul smell is spreading in the residential area.",
          images: ["https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400"],
          status: 'Submitted',
          date: '13/03/2026, 08:45:00',
          user: 'Manoj Singh',
          likes: 38,
          dislikes: 1
        }
      ]
      setGrievances(demoGrievances)
      localStorage.setItem('smartgov-grievances', JSON.stringify(demoGrievances))
    }
    
    const savedVotes = localStorage.getItem('smartgov-votes')
    if (savedVotes) {
      setVotedIds(JSON.parse(savedVotes))
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGrievanceImages(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleGrievanceSubmit = () => {
    if (!grievanceText.trim()) return
    
    setIsSubmittingGrievance(true)
    setTimeout(() => {
      const newGrievance = {
        id: Date.now(),
        text: grievanceText,
        images: grievanceImages,
        status: 'Submitted',
        date: new Date().toLocaleString('en-IN'),
        user: user?.name,
        email: user?.email,
        likes: 0,
        dislikes: 0
      }
      
      const updated = [newGrievance, ...grievances]
      setGrievances(updated)
      localStorage.setItem('smartgov-grievances', JSON.stringify(updated))
      
      setGrievanceText('')
      setGrievanceImages([])
      setStep('select')
      setIsSubmittingGrievance(false)
    }, 1500)
  }

  const handleVote = (id, type) => {
    if (votedIds[id]) return

    const updated = grievances.map(g => {
      if (g.id === id) {
        return {
          ...g,
          [type === 'like' ? 'likes' : 'dislikes']: g[type === 'like' ? 'likes' : 'dislikes'] + 1
        }
      }
      return g
    })

    const newVotes = { ...votedIds, [id]: type }
    setGrievanceTab('feed')
    setGrievances(updated)
    setVotedIds(newVotes)
    localStorage.setItem('smartgov-grievances', JSON.stringify(updated))
    localStorage.setItem('smartgov-votes', JSON.stringify(newVotes))
  }

  const resetFlow = () => {
    setSelectedService(null)
    setStep('select')
    setTxHash('')
    setToken('')
    setGrievanceTab('feed')
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

      {/* Grievance Portal View */}
      {step === 'grievance' && (
        <div className="flex-col gap-6">
          <div className="flex items-center justify-between">
            <button className="btn btn-outline" onClick={() => setStep('select')} style={{ gap: '0.5rem' }}>
              <ArrowRight size={18} style={{ transform: 'rotate(180deg)', marginRight: '4px' }} /> Dashboard
            </button>
            <div className="flex gap-2 bg-silver-light" style={{ padding: '4px', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <button 
                onClick={() => setGrievanceTab('feed')}
                className={`btn ${grievanceTab === 'feed' ? 'btn-primary' : ''}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: grievanceTab === 'feed' ? undefined : 'transparent', color: grievanceTab === 'feed' ? undefined : 'var(--text-muted)' }}
              >
                Public Feed
              </button>
              <button 
                onClick={() => setGrievanceTab('submit')}
                className={`btn ${grievanceTab === 'submit' ? 'btn-primary' : ''}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: grievanceTab === 'submit' ? undefined : 'transparent', color: grievanceTab === 'submit' ? undefined : 'var(--text-muted)' }}
              >
                Submit & My History
              </button>
            </div>
            <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={14} /> AI Priority Active
            </div>
          </div>

          {grievanceTab === 'feed' ? (
            <div className="flex-col gap-6">
              <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(90deg, rgba(26, 58, 107, 0.05), transparent)' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="var(--primary)" /> Public Grievance Feed
                </h3>
                <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Support issues in your community. Highly supported issues are prioritized by authorities.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {grievances.sort((a, b) => b.likes - a.likes).map(g => (
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
                        <button 
                          onClick={() => handleVote(g.id, 'like')}
                          disabled={votedIds[g.id]}
                          className="flex items-center gap-2" 
                          style={{ 
                            background: votedIds[g.id] === 'like' ? 'rgba(46, 125, 91, 0.1)' : 'transparent',
                            border: 'none', cursor: votedIds[g.id] ? 'default' : 'pointer',
                            padding: '0.5rem', borderRadius: '6px', color: votedIds[g.id] === 'like' ? 'var(--success)' : 'var(--text-muted)',
                            transition: 'all 0.2s'
                          }}
                        >
                          <ThumbsUp size={18} />
                          <span style={{ fontWeight: 700 }}>{g.likes}</span>
                        </button>
                        <button 
                          onClick={() => handleVote(g.id, 'dislike')}
                          disabled={votedIds[g.id]}
                          className="flex items-center gap-2" 
                          style={{ 
                            background: votedIds[g.id] === 'dislike' ? 'rgba(160, 50, 60, 0.1)' : 'transparent',
                            border: 'none', cursor: votedIds[g.id] ? 'default' : 'pointer',
                            padding: '0.5rem', borderRadius: '6px', color: votedIds[g.id] === 'dislike' ? 'var(--danger)' : 'var(--text-muted)',
                            transition: 'all 0.2s'
                          }}
                        >
                          <ThumbsDown size={18} />
                          <span style={{ fontWeight: 700 }}>{g.dislikes}</span>
                        </button>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={14} /> Priority: {g.likes > 20 ? 'High' : 'Normal'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {/* New Grievance Form */}
              <div className="glass-panel flex-col gap-4">
                <div className="flex items-center gap-3" style={{ marginBottom: '0.5rem' }}>
                  <Plus size={20} color="var(--primary)" />
                  <h3 style={{ margin: 0 }}>Submit New Grievance</h3>
                </div>
                
                <div className="input-group">
                  <label className="input-label">Describe your query or concern</label>
                  <textarea 
                    className="input-field" 
                    rows={5}
                    placeholder="Tell us what's on your mind... e.g., Street light not working, Water supply issue, Delay in service"
                    value={grievanceText}
                    onChange={(e) => setGrievanceText(e.target.value)}
                    style={{ resize: 'vertical', minHeight: '150px' }}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Attach Images (Optional)</label>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <label style={{
                      width: '80px', height: '80px', borderRadius: '8px',
                      border: '2px dashed var(--border)', display: 'flex',
                      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.3s ease'
                    }} className="hover-scale">
                      <Camera size={20} />
                      <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>Add</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                    
                    {grievanceImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                        <img src={img} alt="upload preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        <button 
                          onClick={() => setGrievanceImages(prev => prev.filter((_, i) => i !== idx))}
                          style={{
                            position: 'absolute', top: '-6px', right: '-6px',
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: 'var(--danger)', color: 'white', border: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  className="btn btn-primary" 
                  onClick={handleGrievanceSubmit}
                  disabled={!grievanceText.trim() || isSubmittingGrievance}
                  style={{ width: '100%', gap: '0.5rem', marginTop: '1rem' }}
                >
                  {isSubmittingGrievance ? 'Submitting...' : <><Send size={18} /> Submit Grievance</>}
                </button>
              </div>

              {/* My Grievances History */}
              <div className="glass-panel flex-col gap-4">
                <div className="flex items-center gap-3" style={{ marginBottom: '0.5rem' }}>
                  <Clock size={20} color="var(--primary)" />
                  <h3 style={{ margin: 0 }}>My Recent Submissions</h3>
                </div>
                
                <div className="flex-col gap-4" style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {grievances.filter(g => g.email === user?.email || g.user === user?.name).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                      <MessageSquare size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                      <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No grievances submitted by you yet.</p>
                    </div>
                  ) : (
                    grievances.filter(g => g.email === user?.email || g.user === user?.name).map(g => (
                      <div key={g.id} style={{
                        padding: '1.25rem', borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)', backgroundColor: 'var(--surface)'
                      }}>
                        <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                          <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{g.date}</p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>ID: GR-{g.id.toString().slice(-6)}</p>
                          </div>
                          <span className={`badge badge-${g.status === 'Submitted' ? 'info' : 'success'}`} style={{ fontSize: '0.7rem' }}>
                            {g.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{g.text}</p>
                        <div className="flex gap-2">
                          <div className="badge badge-success" style={{ fontSize: '0.7rem' }}>👍 {g.likes} Supports</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
