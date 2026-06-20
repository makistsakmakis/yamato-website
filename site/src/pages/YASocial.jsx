import { useState } from 'react'
import { games } from '../data/games'
import GameCard from '../components/GameCard'
import GameModal from '../components/GameModal'
import SectionHero from '../components/SectionHero'
import { useLang } from '../context/LanguageContext'

const socialGames = games.filter(g => g.category === 'Social Entertainment & AR')

export default function YASocial() {
  const [selected, setSelected] = useState(null)
  const { t } = useLang()
  const p = t.pages.social
  return (
    <div>
      <SectionHero subtitle={p.hero.sub} title={p.hero.title} description={p.hero.desc} />
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="mb-16 fade-in">
          <p className="section-subtitle">{p.section.label}</p>
          <h2 className="text-3xl font-black text-white mb-4">{p.section.title}</h2>
          <p className="text-white/50 leading-relaxed mb-4 max-w-2xl">{p.section.p1}</p>
          <p className="text-white/50 leading-relaxed max-w-2xl">{p.section.p2}</p>
        </div>
        <p className="section-subtitle mb-4 fade-in">{p.gamesLabel}</p>
        <h3 className="text-2xl font-black text-white mb-8 fade-in">{p.gamesTitle}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 fade-in">
          {socialGames.map(g => <GameCard key={g.id} game={g} onClick={setSelected} />)}
        </div>
      </section>
      {selected && <GameModal game={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
