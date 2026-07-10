import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, ShoppingBag, Star, Heart, MapPin, Bell, LogOut, ChevronRight, Plus, Trash2, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import {
  upsertProfile, getOrders, getCustomerAddresses,
  upsertCustomerAddress, deleteCustomerAddress,
  getMarketingConsents, upsertMarketingConsent,
  getUserPreferences, replaceUserPreferences, uploadAvatar,
  formatDate, formatMonth } from '../lib/supabase'

// ── Reusable field ────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', disabled }) {
  return (
    <div>
      <label className="block text-white/40 text-xs font-bold tracking-widest uppercase mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`form-input w-full text-sm ${disabled ? 'opacity-40 cursor-default' : ''}`}
      />
    </div>
  )
}

// ── Save button with feedback ─────────────────────────────────────────────────
function SaveBtn({ saving, saved, label }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className={`btn-primary px-6 py-2.5 text-xs font-bold tracking-widest uppercase disabled:opacity-40 flex items-center gap-2 ${
        saved ? 'bg-green-600 border-green-600' : ''
      }`}
    >
      {saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : saving ? 'Saving…' : (label || 'Save')}
    </button>
  )
}

// ── SECTION: Profile ──────────────────────────────────────────────────────────
function ProfileSection({ user, profile, d, refreshProfile }) {
  const [avatarFile, setAvatarFile]       = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || null)

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const [form, setForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    date_of_birth: profile?.date_of_birth || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (profile) setForm({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      phone: profile.phone || '',
      date_of_birth: profile.date_of_birth || '',
    })
  }, [profile])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    try {
      let avatar_url = profile?.avatar_url || null
      if (avatarFile) {
        avatar_url = await uploadAvatar(user.id, avatarFile)
        setAvatarFile(null)
      }
      await upsertProfile(user.id, {
        ...form,
        profile_completed: true,
        email: user?.email || '',
        ...(avatar_url ? { avatar_url } : {}),
      })
      await refreshProfile()
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setSaveError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3 pb-2">
        <label className="cursor-pointer group relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-yamato-gray border-2 border-white/10 group-hover:border-yamato-red transition-colors flex items-center justify-center">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/30 text-4xl font-black">
                {form.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "Y"}
              </span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-7 h-7 bg-yamato-red rounded-full flex items-center justify-center border-2 border-yamato-black">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </label>
        <p className="text-white/30 text-xs">{d.avatarHint || "Tap to change photo"}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={d.firstName} value={form.first_name} onChange={set('first_name')} />
        <Field label={d.lastName}  value={form.last_name}  onChange={set('last_name')} />
      </div>
      <Field label={d.email}    value={user?.email || ''} disabled />
      <Field label={d.phone}    value={form.phone}        onChange={set('phone')} type="tel" />
      <Field label={d.birthdate} value={form.date_of_birth} onChange={set('date_of_birth')} type="date" />
      {saveError && <p className="text-yamato-red text-xs">{saveError}</p>}
      <div className="flex justify-end pt-2">
        <SaveBtn saving={saving} saved={saved} label={d.save} />
      </div>
    </form>
  )
}

// ── SECTION: Club ─────────────────────────────────────────────────────────────
function ClubSection({ clubMembership, d }) {
  if (!clubMembership) {
    return (
      <div className="text-center py-10 space-y-4">
        <Star className="w-12 h-12 text-white/20 mx-auto" />
        <p className="text-white/40 text-sm">{d.notMember}</p>
        <Link to="/join-club" className="btn-primary inline-block px-8 py-3 text-xs font-bold tracking-widest uppercase">
          {d.joinNow}
        </Link>
      </div>
    )
  }

  const since = clubMembership.member_since
    ? formatMonth(clubMembership.member_since)
    : '—'

  return (
    <div className="space-y-6">
      {/* Status card */}
      <div className="bg-yamato-red/10 border border-yamato-red/30 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-yamato-red" />
          <span className="text-yamato-red font-bold text-sm uppercase tracking-widest">YAMATO Club</span>
          <span className="ml-auto text-xs font-bold uppercase text-green-400">{d.active}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-white/30 uppercase tracking-wider mb-1">{d.memberSince}</p>
            <p className="text-white font-semibold">{since}</p>
          </div>
          {clubMembership.member_number && (
            <div>
              <p className="text-white/30 uppercase tracking-wider mb-1">{d.memberNumber}</p>
              <p className="text-white font-semibold font-mono">{clubMembership.member_number}</p>
            </div>
          )}
        </div>
      </div>

      {/* Benefits preview */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Star, label: 'Prize Drop Updates' },
          { icon: Bell, label: 'Member-Only News' },
          { icon: Heart, label: 'Birthday Surprise' },
          { icon: ShoppingBag, label: 'Special Offers' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="border border-white/10 p-4 flex items-center gap-3">
            <Icon className="w-4 h-4 text-yamato-red shrink-0" />
            <span className="text-white/60 text-xs font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SECTION: Preferences ──────────────────────────────────────────────────────
function PreferencesSection({ user, d }) {
  const CATEGORIES = ['anime_heroes','gaming_icons','movies_series','cute_kawaii','collector_figures','prize_drops','special_offers','events']
  const LABELS     = ['Anime Heroes','Gaming Icons','Movies & Series','Cute & Kawaii','Collector Figures','Prize Drops','Special Offers','Events']

  const [selected, setSelected] = useState([])
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  useEffect(() => {
    getUserPreferences(user.id).then(prefs => {
      setSelected(prefs.filter(p => p.preference_type === 'category').map(p => p.preference_value))
    }).catch(() => {})
  }, [user.id])

  const toggle = (v) => setSelected(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v])

  const handleSave = async () => {
    setSaving(true)
    try {
      await replaceUserPreferences(user.id, 'category', selected)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-white/40 text-sm">{d.preferencesDesc}</p>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            type="button"
            onClick={() => toggle(cat)}
            className={`px-4 py-3 text-xs font-bold tracking-wide border transition-all text-left ${
              selected.includes(cat)
                ? 'border-yamato-red bg-yamato-red/15 text-white'
                : 'border-white/15 text-white/40 hover:border-white/30 hover:text-white'
            }`}
          >
            {LABELS[i]}
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`btn-primary px-6 py-2.5 text-xs font-bold tracking-widest uppercase disabled:opacity-40 flex items-center gap-2 ${saved ? 'bg-green-600 border-green-600' : ''}`}
        >
          {saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : saving ? 'Saving…' : d.save}
        </button>
      </div>
    </div>
  )
}

// ── SECTION: Orders ───────────────────────────────────────────────────────────
function OrdersSection({ user, d }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders(user.id).then(o => { setOrders(o); setLoading(false) }).catch(() => setLoading(false))
  }, [user.id])

  if (loading) return <p className="text-white/30 text-sm">Loading…</p>
  if (!orders.length) return (
    <div className="text-center py-10">
      <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-3" />
      <p className="text-white/40 text-sm">{d.noOrders}</p>
      {/* Shop CTA hidden for later (e-shop disabled) */}
    </div>
  )

  return (
    <div className="space-y-3">
      {orders.map(o => (
        <div key={o.id} className="border border-white/10 p-4 flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-semibold">Order #{o.id?.slice(-8)}</p>
            <p className="text-white/40 text-xs mt-0.5">{formatDate(o.created_at)}</p>
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-sm">€{Number(o.total || 0).toFixed(2)}</p>
            <span className="text-xs text-green-400 font-medium uppercase">{o.status || 'completed'}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── SECTION: Addresses ────────────────────────────────────────────────────────
function AddressesSection({ user, d }) {
  const [addresses, setAddresses] = useState([])
  const [adding, setAdding]       = useState(false)
  const [form, setForm]           = useState({ address_type:'shipping', first_name:'', last_name:'', street:'', city:'', postal_code:'', country:'GR', phone:'' })
  const [saving, setSaving]       = useState(false)

  const load = useCallback(() => {
    getCustomerAddresses(user.id).then(setAddresses).catch(() => {})
  }, [user.id])

  useEffect(() => { load() }, [load])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await upsertCustomerAddress(user.id, form)
      load()
      setAdding(false)
      setForm({ address_type:'shipping', first_name:'', last_name:'', street:'', city:'', postal_code:'', country:'GR', phone:'' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    await deleteCustomerAddress(id)
    load()
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="space-y-4">
      {!addresses.length && !adding && (
        <div className="text-center py-8">
          <MapPin className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">{d.noAddresses}</p>
        </div>
      )}

      {addresses.map(addr => (
        <div key={addr.id} className="border border-white/10 p-4 flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-yamato-red">
                {addr.address_type === 'billing' ? d.billing : d.shipping}
              </span>
              {addr.is_default && (
                <span className="text-xs text-white/40 border border-white/20 px-1.5 py-0.5">{d.defaultAddress}</span>
              )}
            </div>
            <p className="text-white text-sm font-medium">{addr.first_name} {addr.last_name}</p>
            <p className="text-white/50 text-xs">{addr.street}</p>
            <p className="text-white/50 text-xs">{addr.postal_code} {addr.city}</p>
          </div>
          <button onClick={() => handleDelete(addr.id)} className="text-white/20 hover:text-yamato-red transition-colors shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {!adding ? (
        <button
          onClick={() => setAdding(true)}
          className="w-full border border-dashed border-white/20 py-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:border-yamato-red/50 hover:text-yamato-red transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />{d.addAddress}
        </button>
      ) : (
        <form onSubmit={handleSave} className="border border-white/10 p-5 space-y-4">
          <div className="flex gap-3">
            {['shipping','billing'].map(t => (
              <button key={t} type="button" onClick={() => setForm(f => ({ ...f, address_type: t }))}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${form.address_type === t ? 'border-yamato-red text-yamato-red' : 'border-white/20 text-white/40 hover:border-white/40'}`}>
                {t === 'shipping' ? d.shipping : d.billing}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.first_name} onChange={set('first_name')} placeholder={d.firstName} className="form-input text-sm" required />
            <input value={form.last_name}  onChange={set('last_name')}  placeholder={d.lastName}  className="form-input text-sm" required />
          </div>
          <input value={form.street}      onChange={set('street')}      placeholder={d.street}     className="form-input w-full text-sm" required />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.postal_code} onChange={set('postal_code')} placeholder={d.postalCode} className="form-input text-sm" />
            <input value={form.city}        onChange={set('city')}        placeholder={d.city}       className="form-input text-sm" required />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="btn-primary px-5 py-2 text-xs font-bold uppercase tracking-widest disabled:opacity-40">
              {saving ? 'Saving…' : d.save}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white border border-white/10 hover:border-white/30 transition-all">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// ── SECTION: Marketing ────────────────────────────────────────────────────────
function MarketingSection({ user, d }) {
  const [emailOn, setEmailOn] = useState(false)
  const [smsOn, setSmsOn]     = useState(false)
  const [loaded, setLoaded]   = useState(false)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    getMarketingConsents(user.id).then(consents => {
      setEmailOn(consents.some(c => c.channel === 'email' && c.status === 'accepted'))
      setSmsOn(consents.some(c => c.channel === 'sms'   && c.status === 'accepted'))
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [user.id])

  const handleSave = async () => {
    setSaving(true)
    try {
      await upsertMarketingConsent(user.id, 'marketing_news', 'email', emailOn)
      await upsertMarketingConsent(user.id, 'marketing_news', 'sms',   smsOn)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) return <p className="text-white/30 text-sm">Loading…</p>

  return (
    <div className="space-y-6">
      <p className="text-white/40 text-sm">{d.privacyNote}</p>
      <div className="space-y-4">
        {[
          { label: d.emailConsent, value: emailOn, set: setEmailOn },
          { label: d.smsConsent,   value: smsOn,   set: setSmsOn },
        ].map(({ label, value, set }) => (
          <label key={label} className="flex items-center justify-between p-4 border border-white/10 cursor-pointer hover:border-white/20 transition-colors">
            <span className="text-white/70 text-sm">{label}</span>
            <div
              onClick={() => set(v => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-yamato-red' : 'bg-white/20'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${value ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </label>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`btn-primary px-6 py-2.5 text-xs font-bold tracking-widest uppercase disabled:opacity-40 flex items-center gap-2 ${saved ? 'bg-green-600 border-green-600' : ''}`}
        >
          {saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : saving ? 'Saving…' : d.save}
        </button>
      </div>
    </div>
  )
}

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV = [
  { key: 'profile',     icon: User,       dk: 'profile'    },
  { key: 'club',        icon: Star,       dk: 'club'       },
  { key: 'preferences', icon: Heart,      dk: 'preferences'},
  { key: 'orders',      icon: ShoppingBag,dk: 'orders'     },
  { key: 'addresses',   icon: MapPin,     dk: 'addresses'  },
  { key: 'marketing',   icon: Bell,       dk: 'marketing'  },
]

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MyYamato() {
  const { t } = useLang()
  const d = t.dashboard
  const { user, profile, clubMembership, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('profile')

  useEffect(() => {
    if (!loading && !user) navigate('/join-club', { replace: true })
  }, [loading, user, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-yamato-black flex items-center justify-center">
        <div className="text-white/30 text-sm">Loading…</div>
      </div>
    )
  }

  const displayName = profile?.first_name
    ? `${profile.first_name}${profile.last_name ? ' ' + profile.last_name : ''}`
    : user.email

  return (
    <div className="min-h-screen bg-yamato-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Page header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <p className="section-subtitle">{d.title}</p>
            <h1 className="text-2xl font-black text-white mt-1">{displayName}</h1>
            <p className="text-white/30 text-xs mt-1">{user.email}</p>
          </div>
          {clubMembership && (
            <span className="text-xs font-bold uppercase tracking-widest text-yamato-red border border-yamato-red/40 px-3 py-1.5">
              YAMATO Club
            </span>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <nav className="lg:w-56 shrink-0">
            <ul className="space-y-1">
              {NAV.map(({ key, icon: Icon, dk }) => (
                <li key={key}>
                  <button
                    onClick={() => setActive(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                      active === key
                        ? 'bg-yamato-red/10 border-l-2 border-yamato-red text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {d[dk]}
                  </button>
                </li>
              ))}
              <li className="pt-2 border-t border-white/10 mt-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/30 hover:text-yamato-red transition-colors"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  {d.signOut}
                </button>
              </li>
            </ul>
          </nav>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="card-dark p-6 md:p-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 pb-4 border-b border-white/10">
                {d[NAV.find(n => n.key === active)?.dk]}
              </h2>

              {active === 'profile'     && <ProfileSection     user={user} profile={profile} d={d} refreshProfile={useAuth().refreshProfile} />}
              {active === 'club'        && <ClubSection        clubMembership={clubMembership} d={d} />}
              {active === 'preferences' && <PreferencesSection user={user} d={d} />}
              {active === 'orders'      && <OrdersSection      user={user} d={d} />}
              {active === 'addresses'   && <AddressesSection   user={user} d={d} />}
              {active === 'marketing'   && <MarketingSection   user={user} d={d} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
