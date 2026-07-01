import { stores } from '../data/stores'
import StoreCard from '../components/StoreCard'
import SectionHero from '../components/SectionHero'
import { useLang } from '../context/LanguageContext'

export default function Stores() {
  const { t } = useLang()
  const p = t.pages.stores
  const active = stores.filter(s => s.active)
  return (
    <div>
      <SectionHero subtitle={p.hero.sub} title={p.hero.title} description={p.hero.desc} />
      <section className="py-20 max-w-7xl mx-auto px-4">
        <p className="section-subtitle mb-4">{p.active.label}</p>
        <h2 className="text-2xl font-black text-white mb-8">{p.active.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {active.map(s => <StoreCard key={s.id} store={s} />)}
        </div>
      </section>
    </div>
  )
}
