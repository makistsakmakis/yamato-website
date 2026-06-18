import { useState } from 'react'
import { stores } from '../../data/stores'
export default function ContactForm({ defaultType = 'contact' }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', phone:'', store:'', subject:'', message:'', type: defaultType, honeypot:'' })
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const handleSubmit = async e => {
    e.preventDefault()
    if (form.honeypot) return
    const data = new FormData(e.target)
    await fetch('/', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams(data).toString() })
    setSubmitted(true)
  }
  if (submitted) return (
    <div className="text-center py-12">
      <div className="w-14 h-14 bg-yamato-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-yamato-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h3 className="text-white font-bold text-xl mb-2">Message Sent</h3>
      <p className="text-white/50 text-sm">We'll get back to you shortly.</p>
    </div>
  )
  return (
    <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="form-name" value="contact" />
      <input type="hidden" name="type" value={form.type} />
      <input name="bot-field" value={form.honeypot} onChange={set('honeypot')} className="hidden" aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-white/40 tracking-wider uppercase mb-1.5">Name</label>
          <input name="name" value={form.name} onChange={set('name')} placeholder="Your name" required className="form-input" />
        </div>
        <div>
          <label className="block text-xs text-white/40 tracking-wider uppercase mb-1.5">Email *</label>
          <input name="email" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required className="form-input" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-white/40 tracking-wider uppercase mb-1.5">Store</label>
          <select name="store" value={form.store} onChange={set('store')} className="form-input">
            <option value="">All stores</option>
            {stores.filter(s=>s.active).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-white/40 tracking-wider uppercase mb-1.5">Subject</label>
          <input name="subject" value={form.subject} onChange={set('subject')} placeholder="Subject" className="form-input" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-white/40 tracking-wider uppercase mb-1.5">Message *</label>
        <textarea name="message" value={form.message} onChange={set('message')} placeholder="How can we help?" required rows={5} className="form-input resize-none" />
      </div>
      <button type="submit" className="btn-primary w-full py-3.5">Send Message</button>
    </form>
  )
}
