import { useState } from 'react'
export default function FAQAccordion({ faqs }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="space-y-2">
      {faqs.map((faq) => (
        <div key={faq.id} className="border border-white/5 rounded-sm overflow-hidden">
          <button onClick={() => setOpen(open === faq.id ? null : faq.id)}
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-yamato-gray hover:bg-yamato-gray-mid transition-colors">
            <span className="text-white font-medium text-sm pr-4">{faq.question}</span>
            <svg className={`w-4 h-4 text-yamato-red shrink-0 transition-transform ${open === faq.id ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === faq.id && (
            <div className="px-5 py-4 bg-yamato-gray-mid">
              <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
