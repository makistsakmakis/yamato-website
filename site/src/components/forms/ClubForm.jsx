import { useState } from 'react'
import { stores } from '../../data/stores'
import { submitClubWaitlist } from '../../lib/supabase'
import { useLang } from '../../context/LanguageContext'
export default function ClubForm() {
  const { t } = useLang()
  const f = t.forms
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', store:'', gdpr:false, honeypot:'' })
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const handleSubmit = async e => {
    e.preventDefault()
    if (form.honeypot) return
    setError(''); setSending(true)
    try {
      await submitClubWaitlist({ name: form.name, email: form.email, store: form.store, gdpr_consent: form.gdpr })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError(f.error)
    } finally {
      setSending(false)
    }
  }
  if (submitted) return (
    <div className="text-center py-10">
      <div className="w-14 h-14 bg-yamato-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-yamato-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h3 className="text-white font-bold text-xl mb-2">{f.clubSentTitle}</h3>
      <p className="text-white/50 text-sm">{f.clubSentDesc}</p>
    </div>
  )
  return (
    <form name="yamato-club" onSubmit={handleSubmit} className="space-y-4">
      <input name="bot-field" value={form.honeypot} onChange={set('honeypot')} className="hidden" aria-hidden="true" tabIndex={-1} autoComplete="off" />
      <div>
        <label className="block text-xs text-white/40 tracking-wider uppercase mb-1.5">{f.fullName}</label>
        <input name="name" value={form.name} onChange={set('name')} placeholder={f.fullName} required className="form-input" />
      </div>
      <div>
        <label className="block text-xs text-white/40 tracking-wider uppercase mb-1.5">{f.email} *</label>
        <input name="email" type="email" value={form.email} onChange={set('email')} placeholder={f.emailPh} required className="form-input" />
      </div>
      <div>
        <label className="block text-xs text-white/40 tracking-wider uppercase mb-1.5">{f.preferredStore}</label>
        <select name="store" value={form.store} onChange={set('store')} className="form-input">
          <option value="">{f.selectStore}</option>
          {stores.filter(s=>s.active).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
      </div>
      <div className="flex gap-3 items-start pt-1">
        <input id="gdpr" name="gdpr" type="checkbox" checked={form.gdpr} onChange={set('gdpr')} required
          className="mt-0.5 w-4 h-4 rounded border-white/20 bg-yamato-gray-mid accent-yamato-red cursor-pointer" />
        <label htmlFor="gdpr" className="text-white/40 text-xs leading-relaxed cursor-pointer">
          {f.clubConsent} <span className="text-yamato-red">*</span>
        </label>
      </div>
      {error && <p className="text-yamato-red text-sm">{error}</p>}
      <button type="submit" disabled={!form.gdpr || sending} className="btn-primary w-full py-3.5 disabled:opacity-40 disabled:cursor-not-allowed">
        {sending ? f.clubJoining : f.clubJoin}
      </button>
    </form>
  )
}
