import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function FAQAccordion({ faqs }) {
  const { lang } = useLang()
  const L = lang === 'el' ? 'el' : lang === 'ja' ? 'ja' : 'en'
  const [open, setOpen] = useState(null)
  const pick = (v) => (v && typeof v === 'object' ? (v[L] || v.en) : v)
  return (
    <div className="space-y-2">
      {faqs.map((faq) => (
        <div key={faq.id} className="border border-white/5 rounded-sm overflow-hidden">
          <button onClick={() => setOpen(open === faq.id ? null : faq.id)}
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-yamato-gray hover:bg-yamato-gray-mid transition-colors">
            <span className="text-white font-medium text-sm pr-4">{pick(faq.q ?? faq.question)}</span>
            <svg className={`w-4 h-4 text-yamato-red shrink-0 transition-transform ${open === faq.id ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === faq.id && (
            <div className="px-5 py-4 bg-yamato-gray-mid">
              <p className="text-white/60 text-sm leading-relaxed">{pick(faq.a ?? faq.answer)}</p>
              {faq.cta && (
                <Link to={faq.cta.to} className="btn-secondary inline-flex text-xs mt-4 px-5 py-2">{pick(faq.cta.label)}</Link>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
