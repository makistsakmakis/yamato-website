import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { upsertProfile, createClubMembership, replaceUserPreferences, upsertMarketingConsent, uploadAvatar } from '../lib/supabase'

// ── Step indicator ────────────────────────────────────────────────────────────
function StepDots({ step, total }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i < step ? 'w-6 h-2 bg-yamato-red' :
            i === step ? 'w-6 h-2 bg-yamato-red' :
            'w-2 h-2 bg-white/20'
          }`}
        />
      ))}
    </div>
  )
}

// ── STEP 0: Email OTP Auth ────────────────────────────────────────────────────
function StepAuth({ onSuccess }) {
  const { t } = useLang()
  const a = t.auth
  const { signInWithEmail, authLoading, user } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent]   = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) onSuccess()
  }, [user, onSuccess])

  const handleSend = async (e) => {
    e.preventDefault()
    setError('')
    const { error } = await signInWithEmail(email.trim().toLowerCase(), `${window.location.origin}/join-club`)
    if (error) { setError(error.message || error.error_description || JSON.stringify(error) || 'Failed to send email'); return }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-14 h-14 rounded-full bg-yamato-red/15 flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-yamato-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-white font-black tracking-widest uppercase text-sm">
          {a.checkEmail || 'Check Your Email'}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed">
          {a.linkSentDesc
            ? a.linkSentDesc.replace('{email}', email)
            : `We sent a sign-in link to ${email}. Click it to continue your registration.`}
        </p>
        <p className="text-white/25 text-xs">{a.spamNote || "Can't find it? Check your spam folder."}</p>
        <button
          onClick={() => { setSent(false); setEmail(''); setError('') }}
          className="text-yamato-red text-xs hover:text-white transition-colors"
        >
          {a.tryAgain || 'Try a different email'}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSend} className="space-y-5">
      <div>
        <label className="block text-white/60 text-xs font-bold tracking-widest uppercase mb-2">
          {a.emailLabel}
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={a.emailPlaceholder}
          required
          autoFocus
          className="form-input w-full text-sm"
        />
      </div>
      {error && <p className="text-yamato-red text-xs">{error}</p>}
      <button
        type="submit"
        disabled={authLoading || !email}
        className="btn-primary w-full py-3 text-sm font-bold tracking-widest uppercase disabled:opacity-40"
      >
        {authLoading ? a.sending : (a.sendLink || 'Send Sign-In Link')}
      </button>
    </form>
  )
}

// ── STEP 1: Profile ───────────────────────────────────────────────────────────
function StepProfile({ profile, onNext }) {
  const { t } = useLang()
  const j = t.join
  const { user, refreshProfile } = useAuth()
  const [form, setForm] = useState({
    first_name: profile?.first_name || '',
    last_name:  profile?.last_name  || '',
    phone:      profile?.phone      || '',
    date_of_birth: profile?.date_of_birth || '',
  })
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [avatarFile, setAvatarFile]       = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || null)

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.first_name || !form.last_name) { setError('Name is required'); return }
    setSaving(true)
    try {
      let avatar_url = profile?.avatar_url || null
      if (avatarFile) {
        avatar_url = await uploadAvatar(user.id, avatarFile)
      }
      await upsertProfile(user.id, { ...form, profile_completed: true, email: user.email, ...(avatar_url ? { avatar_url } : {}) })
      await refreshProfile()
      onNext()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Avatar picker */}
      <div className="flex flex-col items-center gap-3 pb-2">
        <label className="cursor-pointer group relative" title="Change avatar">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-yamato-gray border-2 border-white/10 group-hover:border-yamato-red transition-colors flex items-center justify-center">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/30 text-3xl font-black">
                {form.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "Y"}
              </span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-yamato-red rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </label>
        <p className="text-white/30 text-xs">{j.avatarHint || "Tap to add a photo"}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/60 text-xs font-bold tracking-widest uppercase mb-2">
            {j.firstName}<span className="text-yamato-red ml-1">*</span>
          </label>
          <input type="text" value={form.first_name} onChange={e => setForm(f => ({...f, first_name: e.target.value}))} className="form-input w-full text-sm" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold tracking-widest uppercase mb-2">
            {j.lastName}<span className="text-yamato-red ml-1">*</span>
          </label>
          <input type="text" value={form.last_name} onChange={e => setForm(f => ({...f, last_name: e.target.value}))} className="form-input w-full text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-white/60 text-xs font-bold tracking-widest uppercase mb-2">{j.phone}</label>
        <input type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className="form-input w-full text-sm" />
      </div>
      <div>
        <label className="block text-white/60 text-xs font-bold tracking-widest uppercase mb-2">{j.birthdate}</label>
        <input type="date" value={form.date_of_birth} onChange={e => setForm(f => ({...f, date_of_birth: e.target.value}))} className="form-input w-full text-sm" />
      </div>
      {error && <p className="text-yamato-red text-xs">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="btn-primary w-full py-3 text-sm font-bold tracking-widest uppercase disabled:opacity-40"
      >
        {saving ? j.saving : j.next}
      </button>
    </form>
  )
}

// ── STEP 2: Interests ─────────────────────────────────────────────────────────
function StepInterests({ onNext }) {
  const { t } = useLang()
  const j = t.join
  const { user } = useAuth()
  const [selected, setSelected] = useState([])
  const [saving, setSaving]     = useState(false)

  const toggle = (interest) =>
    setSelected(s => s.includes(interest) ? s.filter(x => x !== interest) : [...s, interest])

  const handleNext = async () => {
    setSaving(true)
    try {
      if (selected.length > 0) {
        await replaceUserPreferences(user.id, 'category', selected.map(i => i.toLowerCase().replace(/[^a-z0-9]+/g, '_')))
      }
      onNext()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {j.interests.map(interest => (
          <button
            key={interest}
            type="button"
            onClick={() => toggle(interest)}
            className={`px-4 py-3 text-sm font-bold tracking-wide border transition-all duration-200 text-left ${
              selected.includes(interest)
                ? 'border-yamato-red bg-yamato-red/15 text-white'
                : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'
            }`}
          >
            {interest}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleNext}
        disabled={saving}
        className="btn-primary w-full py-3 text-sm font-bold tracking-widest uppercase disabled:opacity-40"
      >
        {saving ? j.saving : j.next}
      </button>
      <button type="button" onClick={onNext} className="w-full text-white/30 text-xs hover:text-white transition-colors">
        Skip
      </button>
    </div>
  )
}

// ── STEP 3: Consent ───────────────────────────────────────────────────────────
function StepConsent({ profile, onNext }) {
  const { t } = useLang()
  const j = t.join
  const { user, refreshProfile } = useAuth()
  const [termsAccepted, setTerms]   = useState(false)
  const [emailConsent, setEmail]    = useState(false)
  const [smsConsent, setSMS]        = useState(false)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!termsAccepted) { setError(j.termsRequired); return }
    setSaving(true)
    try {
      await createClubMembership(user.id, {
        marketingEmail: emailConsent,
        marketingSms: smsConsent,
      })
      await upsertMarketingConsent(user.id, {
        email_consent: emailConsent,
        sms_consent: smsConsent,
      })
      await refreshProfile()
      onNext()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Required */}
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={e => setTerms(e.target.checked)}
            className="mt-0.5 accent-yamato-red"
          />
          <span className="text-white/80 text-sm leading-relaxed">
            {j.agreeTerms.split('Privacy Policy')[0]}
            <Link to="/privacy-policy" target="_blank" className="text-yamato-red hover:underline">Privacy Policy</Link>
            .
          </span>
        </label>
      </div>

      {/* Optional */}
      <div className="border-t border-white/10 pt-5 space-y-4">
        <p className="text-white/40 text-xs uppercase tracking-widest">Optional</p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={emailConsent} onChange={e => setEmail(e.target.checked)} className="mt-0.5 accent-yamato-red" />
          <span className="text-white/60 text-sm leading-relaxed">{j.agreeEmail}</span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={smsConsent} onChange={e => setSMS(e.target.checked)} className="mt-0.5 accent-yamato-red" />
          <span className="text-white/60 text-sm leading-relaxed">{j.agreeSMS}</span>
        </label>
      </div>

      {error && <p className="text-yamato-red text-xs">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="btn-primary w-full py-3 text-sm font-bold tracking-widest uppercase disabled:opacity-40"
      >
        {saving ? j.saving : j.next}
      </button>
    </form>
  )
}

// ── STEP 4: Welcome ───────────────────────────────────────────────────────────
function StepWelcome() {
  const { t } = useLang()
  const j = t.join
  return (
    <div className="text-center space-y-6 py-4">
      <div className="text-6xl mb-4">🎮</div>
      <h2 className="text-2xl font-black text-white">{j.welcomeTitle}</h2>
      <p className="text-white/50 text-sm leading-relaxed">{j.welcomeDesc}</p>
      <div className="space-y-3 pt-2">
        <Link to="/prizes" className="btn-primary block py-3 text-sm font-bold tracking-widest uppercase text-center">
          {j.exploreCTA}
        </Link>
        <Link to="/my-yamato" className="block py-3 text-sm font-bold tracking-widest uppercase text-center border border-white/20 text-white/60 hover:border-white/40 hover:text-white transition-all">
          {j.dashboardCTA}
        </Link>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
const STEPS = ['auth', 'profile', 'interests', 'consent', 'welcome']

export default function JoinClub() {
  const { t } = useLang()
  const j = t.join
  const { user, profile, clubMembership, loading } = useAuth()
  const navigate = useNavigate()

  // Determine initial step
  const getInitialStep = () => {
    if (!user) return 0
    if (clubMembership) return 4           // already a member → welcome
    if (!profile?.profile_completed) return 1  // no profile yet
    return 2                               // profile exists, pick interests
  }

  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!loading) setStep(getInitialStep())
  }, [loading, user, profile, clubMembership])

  const stepTitles = [
    j.pageTitle,
    j.step1Title,
    j.step2Title,
    j.step3Title,
    j.welcomeTitle,
  ]

  const stepDescs = [
    null,
    j.step1Desc,
    j.step2Desc,
    j.step3Desc,
    null,
  ]

  const totalDots = 4 // auth → profile → interests → consent

  if (loading) {
    return (
      <div className="min-h-screen bg-yamato-black flex items-center justify-center">
        <div className="text-white/30 text-sm">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-yamato-black flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="section-subtitle mb-2">YAMATO Club</p>
          {step < 4 && <StepDots step={step} total={totalDots} />}
          <h1 className="text-2xl font-black text-white">{stepTitles[step]}</h1>
          {stepDescs[step] && (
            <p className="text-white/40 text-sm mt-2 leading-relaxed">{stepDescs[step]}</p>
          )}
        </div>

        {/* Card */}
        <div className="card-dark p-8">
          {step === 0 && <StepAuth onSuccess={() => setStep(1)} />}
          {step === 1 && <StepProfile profile={profile} onNext={() => setStep(2)} />}
          {step === 2 && <StepInterests onNext={() => setStep(3)} />}
          {step === 3 && <StepConsent profile={profile} onNext={() => setStep(4)} />}
          {step === 4 && <StepWelcome />}
        </div>

        {/* Footer links */}
        {step > 0 && step < 4 && (
          <p className="text-center text-white/20 text-xs mt-6">
            By continuing you agree to our{' '}
            <Link to="/privacy-policy" className="text-white/40 hover:text-yamato-red transition-colors">
              Privacy Policy
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
