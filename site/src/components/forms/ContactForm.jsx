import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { stores } from '../../data/stores'
import { submitContactMessage } from '../../lib/supabase'
import { useLang } from '../../context/LanguageContext'
export default function ContactForm({ defaultType = 'contact' }) {
  const { t } = useLang()
  const [searchParams] = useSearchParams()
  const c = t.pages.contact
  const subjects = c.subjects || []
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', phone:'', store:'', subject:'', message:'', type: defaultType, honeypot:'' })
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  // Preselect subject from ?subject= (canonical value)
  useEffect(() => {
    const s = searchParams.get('subject')
    if (s) setForm(p => ({ ...p, subject: s }))
  }, [searchParams])
  const handleSubmit = async e => {
    e.preventDefault()
    if (form.honeypot) return
    setError(''); setSending(true)
    try {
      await submitContactMessage({
        type: form.type, name: form.name, email: form.email, phone: form.phone,
        store: form.store, subject: form.subject, message: form.message,
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setSending(false)
    }
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
    <form name="contact" onSubmit={handleSubmit} className="space-y-4">
      <input name="bot-field" value={form.honeypot} onChange={set('honeypot')} className="hidden" aria-hidden="true" tabIndex={-1} autoComplete="off" />
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
          <label className="block text-xs text-white/40 tracking-wider uppercase mb-1.5">{c.subjectLabel || 'Subject'}</label>
          <select name="subject" value={form.subject} onChange={set('subject')} required className="form-input">
            <option value="">{c.subjectPlaceholder || 'Select a subject'}</option>
            {subjects.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs text-white/40 tracking-wider uppercase mb-1.5">Message *</label>
        <textarea name="message" value={form.message} onChange={set('message')} placeholder="How can we help?" required rows={5} className="form-input resize-none" />
      </div>
      {error && <p className="text-yamato-red text-sm">{error}</p>}
      <button type="submit" disabled={sending} className="btn-primary w-full py-3.5 disabled:opacity-40 disabled:cursor-not-allowed">{sending ? 'Sending…' : 'Send Message'}</button>
    </form>
  )
}
