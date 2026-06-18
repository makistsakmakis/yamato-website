import { stores } from '../data/stores'
import StoreCard from '../components/StoreCard'
import SectionHero from '../components/SectionHero'
import { useLang } from '../context/LanguageContext'

export default function Stores() {
  const { t } = useLang()
  const p = t.pages.stores
  const active = stores.filter(s => s.active)
  const coming = stores.filter(s => !s.active)
  return (
    <div>
      <SectionHero subtitle={p.hero.sub} title={p.hero.title} description={p.hero.desc} />
      <section className="py-20 max-w-7xl mx-auto px-4">
        <p className="section-subtitle mb-4">{p.active.label}</p>
        <h2 className="text-2xl font-black text-white mb-8">{p.active.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {active.map(s => <StoreCard key={s.id} store={s} />)}
        </div>
        <div className="bg-yamato-gray border border-white/5 rounded-sm overflow-hidden mb-16 h-64 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-10 h-10 text-white/20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            <p className="text-white/40 text-sm mb-3">{p.mapExplore}</p>
            <div className="flex gap-3 justify-center">
              {active.map(s => s.map_url && (
                <a key={s.id} href={s.map_url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-1.5 px-4">{s.city}</a>
              ))}
            </div>
          </div>
        </div>
        {coming.length > 0 && (
          <>
            <p className="section-subtitle mb-4">{p.coming.label}</p>
            <h2 className="text-2xl font-black text-white mb-8">{p.coming.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coming.map(s => <StoreCard key={s.id} store={s} />)}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
