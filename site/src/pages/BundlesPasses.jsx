import { bundles } from '../data/bundles'
import BundleCard from '../components/BundleCard'
import SectionHero from '../components/SectionHero'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function BundlesPasses() {
  const { t } = useLang()
  const p = t.pages.bundles
  return (
    <div>
      <SectionHero subtitle={p.hero.sub} title={p.hero.title} description={p.hero.desc} />
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {bundles.map(b => <BundleCard key={b.id} bundle={b} />)}
        </div>
        <div className="bg-yamato-gray border border-white/5 rounded-sm p-8 text-center">
          <h3 className="text-white font-bold text-xl mb-3">{p.custom.title}</h3>
          <p className="text-white/50 text-sm mb-6">{p.custom.desc}</p>
          <Link to="/contact" className="btn-primary text-sm">{p.custom.cta}</Link>
        </div>
      </section>
    </div>
  )
}
