import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { games } from '../data/games'
import { categories } from '../data/categories'
import GameCard from '../components/GameCard'
import GameModal from '../components/GameModal'
import SectionHero from '../components/SectionHero'
import { useLang } from '../context/LanguageContext'

const HOW_IT_WORKS = [
  { n: '01', title: 'Choose your prize game', desc: 'Claw machines, premium figure games, skill-based challenges — pick your arena.' },
  { n: '02', title: 'Aim, time and play',      desc: 'Every machine rewards skill and timing. The more you play, the better you get.' },
  { n: '03', title: 'Win your pop-culture prize', desc: 'Claim the figure, plush or collectible you came for.' },
  { n: '04', title: 'Take your hero home',    desc: 'Display it. Share it. Come back for the next one.' },
]

export default function YAGaming() {
  const [params, setParams] = useSearchParams()
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const { t } = useLang()
  const p = t.pages.gaming
  const activeCategory = params.get('cat') || p.all

  const isPrizeGamesActive = activeCategory === 'Prize Games'

  const filtered = useMemo(() => {
    let g = games
    if (activeCategory !== p.all) g = g.filter(x => x.category === activeCategory)
    if (search) g = g.filter(x =>
      x.title.toLowerCase().includes(search.toLowerCase()) ||
      x.description.toLowerCase().includes(search.toLowerCase())
    )
    return g
  }, [activeCategory, search, p.all])

  const counts = useMemo(() => {
    const c = {}
    games.forEach(g => { c[g.category] = (c[g.category] || 0) + 1 })
    return c
  }, [])

  return (
    <div>
      <SectionHero subtitle={p.hero.sub} title={p.hero.title} description={p.hero.desc} />

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Search */}
        <div className="mb-6">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={p.search} className="form-input max-w-sm" />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {[p.all, ...categories.map(c => c.name)].map(cat => (
            <button key={cat}
              onClick={() => { setParams(cat === p.all ? {} : { cat }); setSearch('') }}
              className={`text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-sm border transition-all ${
                activeCategory === cat
                  ? 'bg-yamato-red border-yamato-red text-white'
                  : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
              }`}>
              {cat} {cat !== p.all && <span className="ml-1 opacity-50">({counts[cat] || 0})</span>}
            </button>
          ))}
        </div>

        {/* HOW IT WORKS — shown when Prize Games filter is active */}
        {isPrizeGamesActive && (
          <section className="mb-12 py-12 bg-yamato-dark border border-white/5 -mx-4 px-4 sm:mx-0 sm:px-8 rounded-sm">
            <div className="text-center mb-10">
              <p className="section-subtitle">The Experience</p>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3">
                Play. Win. Display.
              </h2>
              <p className="text-white/40 text-sm max-w-lg mx-auto leading-relaxed">
                Choose your game, test your skill and win collectibles you will actually want to take home, display and share.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {HOW_IT_WORKS.map(s => (
                <div key={s.n} className="card-dark p-5 text-center">
                  <div className="text-yamato-red text-3xl font-black mb-3">{s.n}</div>
                  <h3 className="text-white font-bold text-sm mb-2 leading-snug">{s.title}</h3>
                  <p className="text-white/30 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/prizes" className="btn-primary text-sm px-8 py-3">
                View Current Prize Drops
              </Link>
            </div>
          </section>
        )}

        {/* Game grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(g => <GameCard key={g.id} game={g} onClick={setSelected} />)}
        </div>

        {filtered.length === 0 && (
          <p className="text-white/30 text-center py-20">{p.noResults}</p>
        )}
      </div>

      {selected && <GameModal game={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
