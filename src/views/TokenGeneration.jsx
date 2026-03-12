"use client"

import { useState } from 'react'
import { Ticket, MapPin, Clock, ArrowRight } from 'lucide-react'

export default function TokenGeneration() {
  const [step, setStep] = useState(1)

  return (
    <div className="flex-col gap-6" style={{maxWidth: '800px', margin: '0 auto'}}>
      

      <div className="flex items-center justify-between" style={{marginBottom: '2rem', padding: '0 2rem'}}>
         {['Select Service', 'Choose Office', 'Get Token'].map((label, idx) => (
           <div key={idx} className="flex-col items-center gap-2" style={{opacity: step >= idx + 1 ? 1 : 0.4}}>
             <div style={{
               width: '32px', height: '32px', borderRadius: '50%',
               backgroundColor: step >= idx + 1 ? 'var(--primary)' : 'var(--border)',
               color: step >= idx + 1 ? 'white' : 'var(--text-muted)',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               fontWeight: 'bold'
             }}>{idx + 1}</div>
             <span className="text-sm">{label}</span>
           </div>
         ))}
      </div>

      <div className="glass-panel animate-fade-in" style={{minHeight: '400px', display: 'flex', flexDirection: 'column'}}>
        {step === 1 && (
          <div className="flex-col gap-6" style={{flex: 1}}>
            <h2>What service do you need?</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Income Certificate', 'Aadhaar Update', 'Land Record Copy', 'Pension Application'].map((svc, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-4" 
                  style={{border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: 'var(--surface)'}}
                  onClick={() => setStep(2)}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = 'rgba(29, 78, 216, 0.05)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--surface)' }}
                >
                  <span style={{fontWeight: 500}}>{svc}</span>
                  <ArrowRight size={18} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-col gap-6" style={{flex: 1}}>
            <h2>Select a nearby center</h2>
            <p className="text-sm">System has auto-balanced the load. Consider the recommended options.</p>
            
            <div className="flex-col gap-4">
              <div 
                className="flex items-center justify-between p-4" 
                style={{border: '2px solid var(--success)', borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: 'rgba(16, 185, 129, 0.05)'}}
                onClick={() => setStep(3)}
              >
                <div>
                  <div className="flex items-center gap-2" style={{marginBottom: '0.25rem'}}>
                    <h3 style={{fontSize: '1.2rem', color: 'var(--text-main)'}}>West Zone Revenue</h3>
                    <span className="badge badge-success">Recommended</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm" style={{color: 'var(--text-muted)'}}>
                    <span className="flex items-center gap-1"><MapPin size={14}/> 6.8 km away</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> 10 min wait</span>
                  </div>
                </div>
                <button className="btn btn-primary" style={{padding: '0.5rem 1rem'}}>Select</button>
              </div>

              <div 
                className="flex items-center justify-between p-4" 
                style={{border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: 'var(--surface)'}}
                onClick={() => setStep(3)}
              >
                <div>
                  <div className="flex items-center gap-2" style={{marginBottom: '0.25rem'}}>
                    <h3 style={{fontSize: '1.2rem', color: 'var(--text-main)'}}>Central Sub-Registrar</h3>
                    <span className="badge badge-danger">High Load</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm" style={{color: 'var(--text-muted)'}}>
                    <span className="flex items-center gap-1"><MapPin size={14}/> 2.5 km away</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> 1h 45m wait</span>
                  </div>
                </div>
                <button className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>Select</button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-col items-center justify-center gap-6" style={{flex: 1, textAlign: 'center'}}>
             <div style={{
               padding: '2rem 4rem',
               borderRadius: '1.5rem',
               background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
               color: 'white',
               boxShadow: 'var(--shadow-lg)'
             }}>
               <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '0.5rem'}}>Digital Token</p>
               <h1 style={{fontSize: '4rem', color: 'white', margin: '0', lineHeight: 1}}>#54</h1>
               <div style={{marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.2)'}}>
                 <p style={{fontSize: '1.1rem', fontWeight: 500}}>West Zone Revenue</p>
                 <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '0.25rem'}}>Est. Service: 1:30 PM (in 10m)</p>
               </div>
             </div>

             <div className="flex gap-4" style={{marginTop: '1rem'}}>
               <button className="btn btn-outline" onClick={() => setStep(1)}>Generate Another</button>
               <button className="btn btn-primary" onClick={() => alert('SMS Sent: "Token #54 will be called in 10 mins at West Zone"')}>Receive SMS Updates</button>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
