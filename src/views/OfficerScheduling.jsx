"use client"

import { useState } from 'react'
import { Calendar, UserCircle, Clock, CheckCircle, CalendarDays, ArrowRight } from 'lucide-react'

export default function OfficerScheduling() {
  const [booked, setBooked] = useState(null)
  const [selectedDay, setSelectedDay] = useState('today')

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const formatDate = (d) => d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const officers = [
    { name: 'Dr. R. K. Sharma', title: 'District Collector', slots: { today: ['10:00 AM', '11:30 AM', '2:00 PM'], tomorrow: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'] } },
    { name: 'Mrs. S. Gupta', title: 'Joint Commissioner', slots: { today: ['10:30 AM', '12:00 PM', '4:00 PM'], tomorrow: ['10:00 AM', '2:00 PM', '4:30 PM'] } },
    { name: 'Mr. A. Singh', title: 'Sub-Registrar (Head)', slots: { today: ['9:30 AM', '1:00 PM', '3:30 PM'], tomorrow: ['9:30 AM', '12:00 PM', '2:30 PM', '4:00 PM'] } }
  ]

  const handleBook = (officer, time) => {
    const date = selectedDay === 'today' ? today : tomorrow
    setBooked({
      officer: officer.name,
      title: officer.title,
      time,
      day: selectedDay,
      dateStr: formatDate(date),
    })
  }

  return (
    <div className="flex-col gap-6" style={{maxWidth: '800px', margin: '0 auto'}}>
      <div className="glass-panel" style={{marginBottom: '1rem'}}>
        <div className="flex items-center gap-4" style={{marginBottom: '1.5rem'}}>
          <div style={{padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)'}}>
            <Calendar size={28} color="var(--primary)" />
          </div>
          <div>
            <h2>Book an Appointment</h2>
            <p className="text-sm">Schedule a meeting with senior government officers. Choose a day and time slot.</p>
          </div>
        </div>

        {/* Day Selector */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          <button
            onClick={() => { setSelectedDay('today'); setBooked(null) }}
            className={`btn ${selectedDay === 'today' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, gap: '0.5rem', padding: '0.85rem 1.25rem' }}
            id="select-today"
          >
            <CalendarDays size={18} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600 }}>Today</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{formatDate(today)}</div>
            </div>
          </button>
          <button
            onClick={() => { setSelectedDay('tomorrow'); setBooked(null) }}
            className={`btn ${selectedDay === 'tomorrow' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, gap: '0.5rem', padding: '0.85rem 1.25rem' }}
            id="select-tomorrow"
          >
            <CalendarDays size={18} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600 }}>Tomorrow</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{formatDate(tomorrow)}</div>
            </div>
          </button>
        </div>

        {/* Confirmation Message */}
        {booked && (
          <div className="animate-fade-in" style={{
            padding: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '2rem'
          }}>
            <div className="flex items-center gap-3" style={{ marginBottom: '0.75rem' }}>
              <CheckCircle size={24} color="var(--success)" />
              <h3 style={{color: 'var(--success)', marginBottom: 0}}>Appointment Confirmed!</h3>
            </div>
            <div style={{
              padding: '1rem', borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface)', border: '1px solid var(--border)', marginBottom: '1rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>Officer</p>
                  <p style={{ fontWeight: 600 }}>{booked.officer}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>Designation</p>
                  <p style={{ fontWeight: 600 }}>{booked.title}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>Date</p>
                  <p style={{ fontWeight: 600 }}>{booked.dateStr}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>Time</p>
                  <p style={{ fontWeight: 700, color: 'var(--primary)' }}>{booked.time}</p>
                </div>
              </div>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              ✅ A confirmation SMS has been sent to your registered mobile number. Please arrive 10 minutes before your scheduled time with valid ID proof.
            </p>
            <button className="btn btn-outline" style={{marginTop: '1rem', borderColor: 'var(--success)', color: 'var(--success)'}} onClick={() => setBooked(null)}>
              Book Another Appointment
            </button>
          </div>
        )}

        {/* Officer Cards */}
        <div className="flex-col gap-4">
          {officers.map((officer, i) => {
            const slots = officer.slots[selectedDay]
            return (
              <div key={i} className="flex-col gap-3" style={{
                padding: '1.5rem', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface)'
              }}>
                <div className="flex items-center gap-3">
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(56,189,248,0.1))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <UserCircle size={24} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{fontSize: '1.1rem', marginBottom: '0.1rem'}}>{officer.name}</h3>
                    <span className="text-sm badge" style={{backgroundColor: 'var(--border)'}}>{officer.title}</span>
                  </div>
                </div>

                <div style={{marginTop: '0.5rem'}}>
                  <p className="text-sm" style={{marginBottom: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px'}}>
                    <Clock size={14} /> Available Slots — {selectedDay === 'today' ? 'Today' : 'Tomorrow'}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {slots.map((time, idx) => {
                      const isBooked = booked?.officer === officer.name && booked?.time === time && booked?.day === selectedDay
                      return (
                        <button
                          key={idx}
                          className="btn text-sm"
                          style={{
                            backgroundColor: isBooked ? 'var(--primary)' : 'rgba(29, 78, 216, 0.05)',
                            color: isBooked ? 'white' : 'var(--primary)',
                            padding: '0.5rem 1rem',
                            gap: '0.35rem'
                          }}
                          onClick={() => handleBook(officer, time)}
                        >
                          <Clock size={14} />
                          {time}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
