import { events } from '../data/events'
import EventCard from '../components/EventCard'
import SectionHero from '../components/SectionHero'
import { useLang } from '../context/LanguageContext'

export default function Events() {
  const { t } = useLang()
  const p = t.pages.events
  const featured = events.filter(e => e.featured)
  const rest = events.filter(e => !e.featured)
  return (
    <div>
      <SectionHero subtitle={p.hero.sub} title={p.hero.title} description={p.hero.desc} />
      <section className="py-20 max-w-7xl mx-auto px-4">
        {featured.length > 0 && (
          <div className="mb-14">
            <p className="section-subtitle mb-4">{p.featured.label}</p>
            <h2 className="text-2xl font-black text-white mb-8">{p.featured.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          </div>
        )}
        {rest.length > 0 && (
          <div className="mb-14">
            <p className="section-subtitle mb-4">{p.upcoming.label}</p>
            <h2 className="text-2xl font-black text-white mb-8">{p.upcoming.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rest.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          </div>
        )}
        <div className="bg-yamato-gray border border-white/5 rounded-sm p-8 text-center">
          <p className="section-subtitle">{p.social.label}</p>
          <h3 className="text-2xl font-black text-white mb-4">{p.social.title}</h3>
          <p className="text-white/50 text-sm mb-6">{p.social.desc}</p>
          <div className="flex gap-4 justify-center">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-2.5 px-6">Instagram</a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-2.5 px-6">TikTok</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs py-2.5 px-6">YouTube</a>
          </div>
        </div>
      </section>
    </div>
  )
}
