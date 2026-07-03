import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

const KEY = 'yamato_cookie_consent'

export default function CookieConsent() {
  const { t } = useLang()
  const c = t.cookies || {}
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true)
    } catch {
      // localStorage unavailable — don't block the site
    }
  }, [])

  const choose = (value) => {
    try { localStorage.setItem(KEY, value) } catch { /* ignore */ }
    setVisible(false)
    // If you add analytics later, enable it here only when value === 'accepted'
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-yamato-dark border-t border-white/10 px-4 py-4 shadow-2xl shadow-black/60">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-white/60 text-xs leading-relaxed flex-1">
          {c.text || 'We use cookies to run this site.'}{' '}
          <Link to="/privacy-policy" className="text-yamato-red hover:text-white transition-colors underline">
            {c.privacy || 'Privacy Policy'}
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => choose('declined')}
            className="btn-ghost text-xs px-5 py-2"
          >
            {c.decline || 'Decline'}
          </button>
          <button
            onClick={() => choose('accepted')}
            className="btn-primary text-xs px-5 py-2"
          >
            {c.accept || 'Accept'}
          </button>
        </div>
      </div>
    </div>
  )
}
