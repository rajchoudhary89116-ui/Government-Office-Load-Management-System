"use client"

import { useState } from 'react'
import { Calendar, UserCircle, Clock } from 'lucide-react'

export default function OfficerScheduling() {
  const [booked, setBooked] = useState(null)

  const officers = [
    { name: 'Dr. R. K. Sharma', title: 'District Collector', slots: ['10:00 AM', '11:30 AM', '2:00 PM'] },
    { name: 'Mrs. S. Gupta', title: 'Joint Commissioner', slots: ['10:30 AM', '12:00 PM', '4:00 PM'] },
    { name: 'Mr. A. Singh', title: 'Sub-Registrar (Head)', slots: ['9:30 AM', '1:00 PM', '3:30 PM'] }
  ]

  const handleBook = (officer, time) => {
    setBooked({ officer: officer.name, time, title: officer.title })
  }

  return (
    <div className="flex-col gap-6" style={{maxWidth: '800px', margin: '0 auto'}}>
      <div className="glass-panel" style={{marginBottom: '1rem'}}>
        <div className="flex items-center gap-4" style={{marginBottom: '1rem'}}>
          <div style={{padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)'}}>
            <Calendar size={28} color="var(--primary)" />
          </div>
          <div>
            <h2>Book a Meeting with Senior Officers</h2>
            <p className="text-sm">Select an available time slot below to bypass the regular queue.</p>
          </div>
        </div>

        {booked && (
          <div className="animate-fade-in" style={{padding: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '2rem'}}>
            <h3 style={{color: 'var(--success)', marginBottom: '0.5rem'}}>Meeting Confirmed!</h3>
            <p style={{color: 'var(--text-main)', fontWeight: 500}}>You are scheduled to meet {booked.officer} ({booked.title}) at {booked.time} today.</p>
            <p className="text-sm" style={{marginTop: '0.5rem'}}>A confirmation SMS has been sent. Please arrive 10 minutes early.</p>
            <button className="btn btn-outline" style={{marginTop: '1rem', borderColor: 'var(--success)', color: 'var(--success)'}} onClick={() => setBooked(null)}>Book Another</button>
          </div>
        )}

        <div className="flex-col gap-4">
          {officers.map((officer, i) => (
            <div key={i} className="flex-col gap-3" style={{padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface)'}}>
               <div className="flex items-center gap-3">
                 <UserCircle size={24} color="var(--text-muted)" />
                 <div>
                   <h3 style={{fontSize: '1.1rem'}}>{officer.name}</h3>
                   <span className="text-sm badge" style={{backgroundColor: 'var(--border)'}}>{officer.title}</span>
                 </div>
               </div>
               
               <div style={{marginTop: '0.5rem'}}>
                 <p className="text-sm" style={{marginBottom: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px'}}>
                   <Clock size={14} /> Available Slots Today
                 </p>
                 <div className="flex gap-3 flex-wrap">
                   {officer.slots.map((time, idx) => (
                     <button 
                       key={idx} 
                       className="btn text-sm" 
                       style={{
                         backgroundColor: booked?.officer === officer.name && booked?.time === time ? 'var(--primary)' : 'rgba(29, 78, 216, 0.05)',
                         color: booked?.officer === officer.name && booked?.time === time ? 'white' : 'var(--primary)',
                         padding: '0.5rem 1rem'
                       }}
                       onClick={() => handleBook(officer, time)}
                     >
                       {time}
                     </button>
                   ))}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
