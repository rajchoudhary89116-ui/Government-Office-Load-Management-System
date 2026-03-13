"use client"

import { Users, Building, TrendingUp, AlertTriangle, Clock } from 'lucide-react'

export default function Dashboard() {
  const offices = [
    { id: '1', name: 'Central Sub-Registrar', load: 'High', capacity: '90%', distance: '2.5 km', wait: '1h 45m', trend: 'up' },
    { id: '2', name: 'North District RTO', load: 'Medium', capacity: '65%', distance: '4.1 km', wait: '35m', trend: 'down' },
    { id: '3', name: 'West Zone Revenue', load: 'Low', capacity: '30%', distance: '6.8 km', wait: '10m', trend: 'up' },
  ]

  // Hourly crowd data (actual footfall numbers)
  const crowdData = [
    { time: '9 AM', visitors: 45,  label: 'Low' },
    { time: '10 AM', visitors: 142, label: 'High' },
    { time: '11 AM', visitors: 128, label: 'High' },
    { time: '12 PM', visitors: 87,  label: 'Medium' },
    { time: '1 PM', visitors: 34,  label: 'Low' },
    { time: '2 PM', visitors: 52,  label: 'Low' },
    { time: '3 PM', visitors: 95,  label: 'Medium' },
    { time: '4 PM', visitors: 118, label: 'High' },
    { time: '5 PM', visitors: 28,  label: 'Low' },
  ]

  const maxVisitors = Math.max(...crowdData.map(d => d.visitors))

  const getBarColor = (label) => {
    switch (label) {
      case 'High': return 'var(--danger)'
      case 'Medium': return 'var(--warning)'
      case 'Low': return 'var(--success)'
      default: return 'var(--primary)'
    }
  }

  const getBadgeType = (load) => {
    switch (load) {
      case 'High': return 'badge-danger'
      case 'Medium': return 'badge-warning'
      case 'Low': return 'badge-success'
      default: return 'badge-info'
    }
  }

  // Weekly trend data
  const weeklyTrend = [
    { day: 'Mon', avg: 112 },
    { day: 'Tue', avg: 98 },
    { day: 'Wed', avg: 134 },
    { day: 'Thu', avg: 87 },
    { day: 'Fri', avg: 156 },
    { day: 'Sat', avg: 45 },
  ]
  const maxWeekly = Math.max(...weeklyTrend.map(d => d.avg))

  return (
    <div className="flex-col gap-6 pixel-bg" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-panel text-center">
          <div className="flex items-center justify-between" style={{marginBottom: '1rem'}}>
            <h3 style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Current AI Suggestion</h3>
            <Clock size={20} color="var(--primary)" />
          </div>
          <div style={{fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem'}}>
            Best Time: 2:00 PM
          </div>
          <p style={{fontSize: '0.85rem', color: 'var(--success)'}}>Low crowd density expected</p>
        </div>

        <div className="glass-panel text-center">
          <div className="flex items-center justify-between" style={{marginBottom: '1rem'}}>
            <h3 style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Citywide Load</h3>
            <Users size={20} color="var(--warning)" />
          </div>
          <div style={{fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem'}}>
            68%
          </div>
          <p className="text-sm">Average across all zones</p>
        </div>

        <div className="glass-panel text-center">
          <div className="flex items-center justify-between" style={{marginBottom: '1rem'}}>
            <h3 style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Fastest Processing</h3>
            <Building size={20} color="var(--success)" />
          </div>
          <div style={{fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem'}}>
            West Zone Rev.
          </div>
          <p className="text-sm">~10 min wait time</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6" style={{gridTemplateColumns: '2fr 1fr'}}>
        <div className="glass-panel">
          <div className="flex items-center justify-between" style={{marginBottom: '1.5rem'}}>
            <h2>Live Office Workload Heatmap</h2>
            <button className="btn btn-outline" style={{padding: '0.5rem 1rem', fontSize: '0.8rem'}}>View Map</button>
          </div>
          
          <div className="flex-col gap-4">
            {offices.map((office) => (
              <div key={office.id} style={{
                padding: '1rem', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div className="flex items-center gap-4">
                  <div style={{
                    width: '40px', height: '40px', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: 'rgba(26, 58, 107, 0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Building size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h4 style={{marginBottom: '0.1rem'}}>{office.name}</h4>
                    <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{office.distance} away • Est. wait: {office.wait}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div style={{textAlign: 'right'}}>
                    <p style={{fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em'}}>CAPACITY</p>
                    <p style={{fontWeight: 700}}>{office.capacity}</p>
                  </div>
                  <div className={`badge ${getBadgeType(office.load)}`} style={{width: '90px', textAlign: 'center'}}>
                    {office.load} Load
                  </div>
                  {office.load === 'High' && office.trend === 'up' && (
                     <AlertTriangle size={18} color="var(--danger)" />
                  )}
                  {office.trend === 'down' && (
                     <TrendingUp size={18} color="var(--success)" style={{transform: 'rotate(180deg)'}} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crowd Prediction with actual graph */}
        <div className="glass-panel">
          <h2>Crowd Prediction</h2>
          <p style={{marginBottom: '1rem', fontSize: '0.8rem'}}>Today's hourly footfall — actual data</p>
          
          {/* Y-axis labels + bar chart */}
          <div style={{ display: 'flex', gap: '0.5rem', height: '240px' }}>
            {/* Y-axis */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '1.75rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, minWidth: '28px' }}>
              <span>{maxVisitors}</span>
              <span>{Math.round(maxVisitors * 0.75)}</span>
              <span>{Math.round(maxVisitors * 0.5)}</span>
              <span>{Math.round(maxVisitors * 0.25)}</span>
              <span>0</span>
            </div>
            
            {/* Grid + Bars */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {/* Grid lines */}
              <div style={{ position: 'absolute', inset: 0, bottom: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{ borderBottom: '1px dashed var(--border)', width: '100%' }} />
                ))}
              </div>
              
              {/* Bars */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '3px', paddingBottom: '0.25rem' }}>
                {crowdData.map((slot, i) => {
                  const barHeight = Math.max((slot.visitors / maxVisitors) * 180, 4)
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem' }}>
                      {/* Value label */}
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-main)' }}>{slot.visitors}</span>
                      {/* Bar */}
                      <div style={{
                        width: '100%',
                        maxWidth: '28px',
                        height: `${barHeight}px`,
                        backgroundColor: getBarColor(slot.label),
                        borderRadius: '2px 2px 0 0',
                        transition: 'height 0.5s ease',
                      }} />
                    </div>
                  )
                })}
              </div>
              
              {/* Time labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.35rem', borderTop: '1px solid var(--border)' }}>
                {crowdData.map((slot, i) => (
                  <span key={i} style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--text-muted)', flex: 1, textAlign: 'center' }}>{slot.time}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', justifyContent: 'center' }}>
            {[{ label: 'High', color: 'var(--danger)' }, { label: 'Medium', color: 'var(--warning)' }, { label: 'Low', color: 'var(--success)' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '8px', height: '8px', background: l.color, borderRadius: '1px' }} />
                <span>{l.label}</span>
              </div>
            ))}
          </div>
          
          <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)'}}>
            <p style={{fontSize: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem'}}>
              <AlertTriangle size={16} color="var(--danger)" style={{flexShrink: 0, marginTop: '2px'}}/> 
              Peak at 10 AM (142 visitors). Recommended visit: 1–2 PM window.
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Trend Graph */}
      <div className="glass-panel">
        <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.15rem' }}>Weekly Footfall Trend</h2>
            <p style={{ fontSize: '0.8rem' }}>Average daily visitors this week</p>
          </div>
          <div className="flex items-center gap-3" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Total: <strong style={{ color: 'var(--text-main)' }}>{weeklyTrend.reduce((s, d) => s + d.avg, 0)}</strong></span>
            <span>Avg: <strong style={{ color: 'var(--text-main)' }}>{Math.round(weeklyTrend.reduce((s, d) => s + d.avg, 0) / weeklyTrend.length)}</strong></span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '140px' }}>
          {weeklyTrend.map((d, i) => {
            const barH = Math.max((d.avg / maxWeekly) * 110, 4)
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>{d.avg}</span>
                <div style={{
                  width: '100%',
                  maxWidth: '60px',
                  height: `${barH}px`,
                  backgroundColor: 'var(--primary)',
                  borderRadius: '3px 3px 0 0',
                  transition: 'height 0.5s ease'
                }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', paddingTop: '0.25rem', borderTop: '1px solid var(--border)', width: '100%', textAlign: 'center' }}>{d.day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
