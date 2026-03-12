"use client"

import { useState } from 'react'
import { UploadCloud, CheckCircle2, AlertCircle, FileText } from 'lucide-react'

export default function DocumentUpload() {
  const [fileState, setFileState] = useState('idle')
  const [progress, setProgress] = useState(0)

  const handleUpload = () => {
    setFileState('uploading')
    let val = 0
    const int = setInterval(() => {
      val += 15
      setProgress(Math.min(val, 100))
      if (val >= 100) {
        clearInterval(int)
        setFileState('complete')
      }
    }, 400)
  }

  return (
    <div className="flex-col gap-6" style={{maxWidth: '800px', margin: '0 auto'}}>
      <div className="glass-panel text-center">
        <h2>AI Document Pre-Verification</h2>
        <p>Upload your documents here before visiting the office to save time.</p>

        <div 
          onClick={fileState === 'idle' ? handleUpload : undefined}
          style={{
            marginTop: '2rem',
            border: '2px dashed var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2rem',
            cursor: fileState === 'idle' ? 'pointer' : 'default',
            backgroundColor: fileState === 'idle' ? 'rgba(29, 78, 216, 0.02)' : 'var(--surface)',
            transition: 'all 0.3s'
          }}
        >
          {fileState === 'idle' && (
            <div className="flex-col items-center gap-2">
              <UploadCloud size={48} color="var(--primary)" style={{marginBottom: '1rem'}} />
              <h3 style={{fontSize: '1.25rem'}}>Drag & Drop files or Browse</h3>
              <p className="text-sm">Supports PDF, JPG, PNG (Max 5MB)</p>
            </div>
          )}

          {fileState === 'uploading' && (
            <div className="flex-col items-center gap-4">
              <UploadCloud size={48} color="var(--primary-light)" className="animate-pulse" />
              <h3 style={{fontSize: '1.25rem'}}>AI Engine Analyzing...</h3>
              <div style={{width: '100%', maxWidth: '300px', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden'}}>
                <div style={{width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.3s'}} />
              </div>
            </div>
          )}

          {fileState === 'complete' && (
            <div className="flex-col items-center gap-4 animate-fade-in">
              <CheckCircle2 size={48} color="var(--success)" />
              <h3 style={{fontSize: '1.25rem'}}>Verification Complete</h3>
              <p className="text-success text-sm">Aadhaar Card successfully validated against templates.</p>
              <button className="btn btn-outline" style={{marginTop: '1rem'}} onClick={() => setFileState('idle')}>Upload Another</button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-panel">
          <h3 style={{marginBottom: '1.5rem', fontSize: '1.1rem'}}>Income Certificate Checklist</h3>
          
          <div className="flex-col gap-4">
            <div className="flex items-center justify-between p-3" style={{backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--radius-md)'}}>
              <div className="flex items-center gap-3">
                <FileText size={20} color="var(--success)" />
                <span style={{fontWeight: 500}}>Aadhaar Card</span>
              </div>
              <span className="badge badge-success">Verified</span>
            </div>

            <div className="flex items-center justify-between p-3" style={{backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-md)'}}>
              <div className="flex items-center gap-3">
                <AlertCircle size={20} color="var(--danger)" />
                <span style={{fontWeight: 500}}>Address Proof</span>
              </div>
              <span className="badge badge-danger">Missing</span>
            </div>

            <div className="flex items-center justify-between p-3" style={{border: '1px solid var(--border)', borderRadius: 'var(--radius-md)'}}>
              <div className="flex items-center gap-3">
                <FileText size={20} color="var(--text-muted)" />
                <span style={{fontWeight: 500, color: 'var(--text-muted)'}}>Passport Size Photo</span>
              </div>
              <span className="badge" style={{backgroundColor: 'var(--border)'}}>Pending Upload</span>
            </div>
          </div>
          
          <div style={{marginTop: '1.5rem'}}>
             <p className="text-sm" style={{color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
               <AlertCircle size={16} /> Please upload Address Proof before visiting.
             </p>
          </div>
        </div>

        <div className="glass-panel">
           <h3 style={{marginBottom: '1rem', fontSize: '1.1rem'}}>AI Detection Tips</h3>
           <ul style={{paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem'}} className="flex-col gap-2">
             <li style={{marginBottom: '0.5rem'}}>Ensure the document lies on a flat, contrasting background.</li>
             <li style={{marginBottom: '0.5rem'}}>Avoid shadows or glare covering important text.</li>
             <li style={{marginBottom: '0.5rem'}}>Ensure all four corners of the document are visible.</li>
             <li style={{marginBottom: '0.5rem'}}>AI supports English and Regional Language formats.</li>
           </ul>
        </div>
      </div>
    </div>
  )
}
