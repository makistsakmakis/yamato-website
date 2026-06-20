import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

export default function SignIn() {
  const { t } = useLang()
  const a = t.auth || {}
  const { signInWithEmail, authLoading, user } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [sent, setSent]         = useState(false)
  const [error, setError]       = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  // If already signed in, go to dashboard
  useEffect(() => {
    if (user) navigate('/my-yamato', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    localStorage.setItem('yamato_remember_me', rememberMe ? '1' : '0')
    const redirectTo = `${window.location.origin}/my-yamato`
    const { error: err } = await signInWithEmail(email.trim().toLowerCase(), redirectTo)
    if (err) { setError(err.message); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-yamato-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo-white.png" alt="YAMATO" className="h-12 mx-auto mb-4" />
        </div>

        <div className="bg-yamato-darkgray border border-white/10 p-8">
          {!sent ? (
            <>
              <h1 className="text-xl font-black tracking-widest text-white uppercase text-center mb-2">
                {a.signInTitle || 'Sign In'}
              </h1>
              <p className="text-white/40 text-sm text-center mb-6">
                {a.signInDesc || "We'll send you a secure link — no password needed."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/60 text-xs font-bold tracking-widest uppercase mb-2">
                    {a.emailLabel || 'Email'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="form-input w-full text-sm"
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                {error && <p className="text-yamato-red text-xs">{error}</p>}

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div
                    onClick={() => setRememberMe(v => !v)}
                    className={`w-4 h-4 border flex items-center justify-center flex-none transition-colors ${rememberMe ? 'bg-yamato-red border-yamato-red' : 'border-white/30 bg-transparent'}`}
                  >
                    {rememberMe && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-white/50 text-xs">{a.rememberMe || 'Remember me for 30 days'}</span>
                </label>

                <button
                  type="submit"
                  disabled={authLoading || !email}
                  className="btn-primary w-full py-3 text-sm font-bold tracking-widest uppercase disabled:opacity-40"
                >
                  {authLoading ? (a.sending || 'Sending…') : (a.sendLink || 'Send Sign-In Link')}
                </button>
              </form>

              <p className="text-center text-white/30 text-xs mt-6">
                {a.noAccount || "Not a member yet?"}{' '}
                <Link to="/join-club" className="text-yamato-red hover:text-white transition-colors">
                  {a.joinCTA || 'Join Club →'}
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-yamato-red/15 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-yamato-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-black tracking-widest text-white uppercase">
                {a.checkEmail || 'Check Your Email'}
              </h2>
              <p className="text-white/50 text-sm leading-relaxed">
                {a.linkSentDesc
                  ? a.linkSentDesc.replace('{email}', email)
                  : `We sent a sign-in link to ${email}. Click it to access your YAMATO account.`}
              </p>
              <p className="text-white/25 text-xs">
                {a.spamNote || "Can't find it? Check your spam folder."}
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="text-yamato-red text-xs hover:text-white transition-colors mt-2"
              >
                {a.tryAgain || 'Try a different email'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
