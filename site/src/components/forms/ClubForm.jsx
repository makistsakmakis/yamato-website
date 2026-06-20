import { useState } from 'react'
import { stores } from '../../data/stores'
export default function ClubForm() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', store:'', gdpr:false, honeypot:'' })
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const handleSubmit = async e => {
    e.preventDefault()
    if (form.honeypot) return
    const data = new FormData(e.target)
    await fetch('/', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams(data).toString() })
    setSubmitted(true)
  }
  if (submitted) return (
    <div className="text-center py-10">
      <div className="w-14 h-14 bg-yamato-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-yamato-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h3 className="text-white font-bold text-xl mb-2">You're on the list!</h3>
      <p className="text-white/50 text-sm">Welcome to the YAMATO Club waitlist. We'll reach out when we launch.</p>
    </div>
  )
  return (
    <form name="yamato-club" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="form-name" value="yamato-club" />
      <input name="bot-field" value={form.honeypot} onChange={set('honeypot')} className="hidden" aria-hidden="true" />
      <div>
        <label className="block text-xs text-white/40 tracking-wider uppercase mb-1.5">Full Name</label>
        <input name="name" value={form.name} onChange={set('name')} placeholder="Your full name" required className="form-input" />
      </div>
      <div>
        <label className="block text-xs text-white/40 tracking-wider uppercase mb-1.5">Email *</label>
        <input name="email" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required className="form-input" />
      </div>
      <div>
        <label className="block text-xs text-white/40 tracking-wider uppercase mb-1.5">Preferred Store</label>
        <select name="store" value={form.store} onChange={set('store')} className="form-input">
          <option value="">Select a store</option>
          {stores.filter(s=>s.active).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
      </div>
      <div className="flex gap-3 items-start pt-1">
        <input id="gdpr" name="gdpr" type="checkbox" checked={form.gdpr} onChange={set('gdpr')} required
          className="mt-0.5 w-4 h-4 rounded border-white/20 bg-yamato-gray-mid accent-yamato-red cursor-pointer" />
        <label htmlFor="gdpr" className="text-white/40 text-xs leading-relaxed cursor-pointer">
          I consent to YAMATO storing my email for club membership communication and marketing. I can unsubscribe at any time. <span className="text-yamato-red">*</span>
        </label>
      </div>
      <button type="submit" disabled={!form.gdpr} className="btn-primary w-full py-3.5 disabled:opacity-40 disabled:cursor-not-allowed">
        Join the YAMATO Club
      </button>
    </form>
  )
}
