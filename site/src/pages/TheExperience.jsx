import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import CategoryCard from '../components/CategoryCard'
import { games } from '../data/games'
import SectionHero from '../components/SectionHero'
import { IconBolt, IconFilm, IconFlag } from '../components/Icons'
import { useLang } from '../context/LanguageContext'

const counts = categories.reduce((acc, c) => {
  acc[c.name] = games.filter(g => g.category === c.name).length
  return acc
}, {})

export default function TheExperience() {
  const { t } = useLang()
  const p = t.pages.experience
  return (
    <div>
      <SectionHero subtitle={p.hero.sub} title={p.hero.title} description={p.hero.desc} />

      <section className="py-20 max-w-7xl mx-auto px-4 fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-subtitle">{p.philosophy.label}</p>
            <h2 className="text-3xl font-black text-white mb-6">{p.philosophy.title}</h2>
            <p className="text-white/50 leading-relaxed mb-4">{p.philosophy.p1}</p>
            <p className="text-white/50 leading-relaxed mb-6">{p.philosophy.p2}</p>
            <div className="flex gap-4">
              <Link to="/ya-gaming" className="btn-primary text-xs py-2.5 px-6">{p.philosophy.ctaBrowse}</Link>
              <Link to="/stores" className="btn-secondary text-xs py-2.5 px-6">{p.philosophy.ctaFind}</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {p.stats.map(s => (
              <div key={s.l} className="card-dark p-6 text-center">
                <div className="text-3xl font-black text-yamato-red mb-2">{s.n}</div>
                <div className="text-white/50 text-xs tracking-widest uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-yamato-dark border-y border-white/5 fade-in">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="section-subtitle">{p.zones.label}</p>
            <h2 className="section-title text-white">{p.zones.title}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(c => <CategoryCard key={c.id} category={c} gameCount={counts[c.name]} />)}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 fade-in">
        <div className="text-center mb-14">
          <p className="section-subtitle">{p.diff.label}</p>
          <h2 className="section-title text-white">{p.diff.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {p.diffItems.map(({ title, desc }, i) => {
            const Icon = [IconBolt, IconFilm, IconFlag][i]
            return (
              <div key={title} className="card-dark p-8">
                <div className="text-yamato-red mb-5"><Icon className="w-9 h-9" /></div>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
