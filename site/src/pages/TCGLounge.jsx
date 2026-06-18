import { Link } from 'react-router-dom'
import { collectibles } from '../data/collectibles'
import SectionHero from '../components/SectionHero'
import { IconCard, IconSwords, IconTarget } from '../components/Icons'
import { useLang } from '../context/LanguageContext'

const tcgProducts = collectibles.filter(c => c.type === 'tcg')
const ICONS = [IconCard, IconSwords, IconTarget]

export default function TCGLounge() {
  const { t } = useLang()
  const p = t.pages.tcg
  return (
    <div>
      <SectionHero subtitle={p.hero.sub} title={p.hero.title} description={p.hero.desc} />
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {p.games.map(({ name, desc }, i) => {
            const Icon = ICONS[i]
            return (
              <div key={name} className="card-dark p-6 text-center">
                <div className="text-yamato-red mb-4 flex justify-center"><Icon className="w-10 h-10" /></div>
                <h3 className="text-white font-bold text-lg mb-3">{name}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            )
          })}
        </div>
        <div className="mb-16">
          <p className="section-subtitle mb-4">{p.products.label}</p>
          <h3 className="text-2xl font-black text-white mb-8">{p.products.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {tcgProducts.map(item => (
              <div key={item.id} className="card-dark p-4 flex gap-4 items-start">
                <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-sm"
                  onError={e => { e.target.src = 'https://placehold.co/64x64/1a1a1a/E30613?text=Y' }} />
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">{item.name}</h4>
                  <p className="text-white/40 text-xs leading-relaxed">{item.description}</p>
                  <p className="text-xs text-white/30 mt-2 border border-white/10 rounded-sm px-2 py-1 inline-block">{p.inStore}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-yamato-gray border border-white/5 rounded-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="section-subtitle">{p.tournaments.label}</p>
              <h3 className="text-2xl font-black text-white mb-4">{p.tournaments.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">{p.tournaments.desc}</p>
              <div className="flex gap-3">
                <Link to="/events" className="btn-primary text-xs py-2.5 px-5">{p.tournaments.cta1}</Link>
                <Link to="/contact" className="btn-secondary text-xs py-2.5 px-5">{p.tournaments.cta2}</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {p.stats.map(([label, sub]) => (
                <div key={label} className="bg-yamato-gray-mid rounded-sm p-4 text-center">
                  <div className="text-yamato-red font-black text-lg mb-1">{label}</div>
                  <div className="text-white/40 text-xs">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
