import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function BundleCard({ bundle }) {
  const { lang } = useLang()
  const L = lang === 'el' ? 'el' : lang === 'ja' ? 'ja' : 'en'
  const pick = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? (v[L] || v.en) : v)
  const features = (bundle.features && (bundle.features[L] || bundle.features.en)) || []

  return (
    <div className="card-dark p-6 flex flex-col h-full hover:border-yamato-red/20 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className="text-yamato-red font-black text-xl">{pick(bundle.price_display)}</span>
      </div>
      <p className="section-subtitle">{bundle.type.replace('_',' ')}</p>
      <h3 className="text-white font-black text-xl mb-3">{pick(bundle.name)}</h3>
      <p className="text-white/50 text-sm leading-relaxed mb-5">{pick(bundle.description)}</p>
      <ul className="space-y-2 mb-6 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex gap-2 text-sm text-white/70"><span className="text-yamato-red mt-0.5">✓</span><span>{f}</span></li>
        ))}
      </ul>
      {bundle.cta_type === 'contact' ? (
        <Link to="/contact?subject=Game%20Card" className="btn-primary w-full text-center text-xs py-2.5">{pick(bundle.cta_label)}</Link>
      ) : bundle.cta_type === 'interest' ? (
        <Link to="/contact?type=interest" className="btn-primary w-full text-center text-xs py-2.5">{pick(bundle.cta_label)}</Link>
      ) : (
        <div className="btn-ghost w-full text-center text-xs py-2.5 cursor-default opacity-80">{pick(bundle.cta_label)}</div>
      )}
    </div>
  )
}
