import { formatDate } from '../lib/supabase';
import { Link } from 'react-router-dom'
import { collectibles } from '../data/collectibles'
import SectionHero from '../components/SectionHero'
import { IconCard, IconSwords, IconTarget } from '../components/Icons'
import { useLang } from '../context/LanguageContext'

const typeLabel = { tcg:'TCG', apparel:'Apparel', figure:'Figure', accessory:'Accessory', merchandise:'Merch' }
const typeBadge = { tcg:'bg-purple-900/40 text-purple-300', apparel:'bg-blue-900/40 text-blue-300', figure:'bg-orange-900/40 text-orange-300', accessory:'bg-green-900/40 text-green-300' }
const ICONS = [IconCard, IconSwords, IconTarget]

export default function YACollectibles() {
  const { t } = useLang()
  const p = t.pages.collectibles
  const tcg = t.pages.tcg

  return (
    <div>
      <SectionHero subtitle={p.hero.sub} title={p.hero.title} description={p.hero.desc} />

      {/* ── COLLECTIBLES GRID ─────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collectibles.map(item => (
            <div key={item.id} className="card-dark group overflow-hidden">
              <div className="aspect-square overflow-hidden bg-yamato-gray-mid">
                <img src={item.image_url} alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { e.target.src = 'https://placehold.co/400x400/1a1a1a/E30613?text=YAMATO' }} />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className={`tag ${typeBadge[item.type] || 'bg-white/10 text-white/50'}`}>{typeLabel[item.type] || item.type}</span>
                  {!item.available_in_store && item.drop_date && (
                    <span className="text-yamato-red text-xs font-bold">Drop: {new Intl.DateTimeFormat(navigator.language, {month:'short', day:'numeric'}).format(new Date(item.drop_date))}</span>
                  )}
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{item.name}</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-4">{item.description}</p>
                {item.available_in_store ? (
                  <div className="text-xs text-white/30 border border-white/10 rounded-sm px-3 py-2 text-center">{p.inStore}</div>
                ) : (
                  <Link to="/contact" className="btn-primary w-full text-center text-xs py-2">{p.registerInterest}</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ───────────────────────────────────────────────────────── */}
      <div className="border-t border-white/5" />

      {/* ── TCG LOUNGE SECTION ────────────────────────────────────────────── */}
      <section className="py-20 bg-yamato-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">{p.tcgSection.label}</p>
            <h2 className="section-title text-white">{p.tcgSection.title}</h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed mt-4">{p.tcgSection.desc}</p>
          </div>

          {/* TCG game cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {tcg.games.map((game, i) => {
              const Icon = ICONS[i] || IconCard
              return (
                <div key={game.name} className="card-dark p-6 text-center">
                  <div className="text-yamato-red mb-4 flex justify-center">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{game.name}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{game.desc}</p>
                </div>
              )
            })}
          </div>

          {/* TCG stats */}
          {tcg.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {tcg.stats.map(([val, label]) => (
                <div key={label} className="card-dark p-5 text-center">
                  <p className="text-yamato-red font-black text-lg tracking-widest uppercase">{val}</p>
                  <p className="text-white/40 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tournaments CTA */}
          <div className="card-dark p-8 md:p-12 text-center max-w-2xl mx-auto">
            <p className="section-subtitle">{tcg.tournaments.label}</p>
            <h3 className="section-title text-white text-2xl">{tcg.tournaments.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed mt-4 mb-8">{tcg.tournaments.desc}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/events" className="btn-primary px-6 py-3 text-xs font-bold tracking-widest uppercase">
                {tcg.tournaments.cta1}
              </Link>
              <Link to="/contact" className="btn-secondary px-6 py-3 text-xs font-bold tracking-widest uppercase">
                {tcg.tournaments.cta2}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
