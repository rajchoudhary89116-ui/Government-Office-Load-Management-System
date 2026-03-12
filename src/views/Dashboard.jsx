import { Users, Building, TrendingUp, AlertTriangle, Clock } from 'lucide-react'

export default function Dashboard() {
  const offices = [
    { id: '1', name: 'Central Sub-Registrar', load: 'High', capacity: '90%', distance: '2.5 km', wait: '1h 45m', trend: 'up' },
    { id: '2', name: 'North District RTO', load: 'Medium', capacity: '65%', distance: '4.1 km', wait: '35m', trend: 'down' },
    { id: '3', name: 'West Zone Revenue', load: 'Low', capacity: '30%', distance: '6.8 km', wait: '10m', trend: 'up' },
  ]

  const peakHours = [
    { time: '10 AM', level: 'High', height: '80%' },
    { time: '12 PM', level: 'Medium', height: '45%' },
    { time: '2 PM', level: 'Low', height: '20%' },
    { time: '4 PM', level: 'Medium', height: '55%' },
  ]

  const getBadgeType = (load) => {
    switch (load) {
      case 'High': return 'badge-danger'
      case 'Medium': return 'badge-warning'
      case 'Low': return 'badge-success'
      default: return 'badge-info'
    }
  }

  return (
    <div className="flex-col gap-6 pixel-bg" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(125, 211, 252, 0.4)' }}>
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-panel text-center">
          <div className="flex items-center justify-between" style={{marginBottom: '1rem'}}>
            <h3 style={{fontSize: '1rem', color: 'var(--text-muted)'}}>Current AI Suggestion</h3>
            <Clock size={20} color="var(--primary)" />
          </div>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.25rem'}}>
            Best Time: 2:00 PM
          </div>
          <p className="text-sm" style={{color: 'var(--success)'}}>Low crowd density expected</p>
        </div>

        <div className="glass-panel text-center">
          <div className="flex items-center justify-between" style={{marginBottom: '1rem'}}>
            <h3 style={{fontSize: '1rem', color: 'var(--text-muted)'}}>Citywide Load</h3>
            <Users size={20} color="var(--warning)" />
          </div>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.25rem'}}>
            68%
          </div>
          <p className="text-sm">Average across all zones</p>
        </div>

        <div className="glass-panel text-center">
          <div className="flex items-center justify-between" style={{marginBottom: '1rem'}}>
            <h3 style={{fontSize: '1rem', color: 'var(--text-muted)'}}>Fastest Processing</h3>
            <Building size={20} color="var(--success)" />
          </div>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.25rem'}}>
            West Zone Rev.
          </div>
          <p className="text-sm">~10 min wait time</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6" style={{gridTemplateColumns: '2fr 1fr'}}>
        <div className="glass-panel">
          <div className="flex items-center justify-between" style={{marginBottom: '1.5rem'}}>
            <h2>Live Office Workload Heatmap</h2>
            <button className="btn btn-outline" style={{padding: '0.5rem 1rem', fontSize: '0.875rem'}}>View Map</button>
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
                    borderRadius: '8px', 
                    backgroundColor: 'rgba(29, 78, 216, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Building size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h4 style={{marginBottom: '0.1rem'}}>{office.name}</h4>
                    <p style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>{office.distance} away • Est. wait: {office.wait}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p style={{fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)'}}>CAPACITY</p>
                    <p style={{fontWeight: 500}}>{office.capacity}</p>
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

        <div className="glass-panel">
          <h2>Crowd Prediction</h2>
          <p style={{marginBottom: '1.5rem', fontSize: '0.875rem'}}>Today's estimated traffic based on history</p>
          
          <div style={{height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '2rem'}}>
            {peakHours.map((slot, i) => (
              <div key={i} style={{width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{
                  width: '100%', 
                  height: slot.height, 
                  backgroundColor: slot.level === 'High' ? 'var(--danger)' : slot.level === 'Medium' ? 'var(--warning)' : 'var(--success)',
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.8
                }}></div>
                <span style={{fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)'}}>{slot.time}</span>
              </div>
            ))}
          </div>
          
          <div style={{marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)'}}>
            <p style={{fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem'}}>
              <AlertTriangle size={16} color="var(--danger)" style={{flexShrink: 0, marginTop: '2px'}}/> 
              Avoid 10 AM. Next predicted peak at 4 PM due to scheme deadlines.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
