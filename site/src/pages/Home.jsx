import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedGames } from '../data/games'
import { categories } from '../data/categories'
import { getFeaturedEvents } from '../data/events'
import GameCard from '../components/GameCard'
import GameModal from '../components/GameModal'
import CategoryCard from '../components/CategoryCard'
import EventCard from '../components/EventCard'
import FAQAccordion from '../components/FAQAccordion'
import { faqs } from '../data/faqs'
import { useLang } from '../context/LanguageContext'
import { IconController, IconGroup, IconBag, IconCard } from '../components/Icons'
import { getPrizeShowcase } from '../lib/supabase'

const PILLAR_ICONS = [IconController, IconGroup, IconBag, IconCard]
const PILLAR_LINKS = ['/ya-gaming', '/ya-social', '/ya-collectibles', '/tcg-lounge']

function useCountUp(target, duration, start) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start || target === '∞') return
    const num = parseInt(target.replace('+',''))
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * num))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(num)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

function StatItem({ value, label, delay }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const isInfinity = value === '∞'
  const hasPlus = value.includes('+')
  const count = useCountUp(value, 1800, visible)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.5 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="text-3xl md:text-4xl font-black text-yamato-red mb-1">
        {isInfinity ? '∞' : (visible ? `${count}${hasPlus ? '+' : ''}` : '0')}
      </div>
      <div className="text-white/40 text-xs tracking-widest uppercase">{label}</div>
    </div>
  )
}

export default function Home() {
  const featured = getFeaturedGames()
  const featuredEvents = getFeaturedEvents()
  const [selected, setSelected] = useState(null)
  const [featuredPrizes, setFeaturedPrizes] = useState([])
  const { t } = useLang()
  const h = t.home

  useEffect(() => {
    getPrizeShowcase().then(setFeaturedPrizes).catch(() => {})
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center hero-grid overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yamato-black/50 to-yamato-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yamato-red/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yamato-red/10 border border-yamato-red/20 px-4 py-1.5 rounded-full mb-8 fade-in">
            <div className="w-1.5 h-1.5 bg-yamato-red rounded-full animate-pulse" />
            <span className="text-yamato-red text-xs font-bold tracking-widest uppercase">{t.hero.badge}</span>
          </div>
          <div className="mb-6 fade-in" style={{ animationDelay: '100ms' }}>
            <img src="/logo-color.png" alt="YAMATO" className="h-20 md:h-28 w-auto mx-auto" />
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none mb-6 fade-in" style={{ animationDelay: '200ms' }}>
            {t.hero.h1a}<br /><span className="text-yamato-red">{t.hero.h1b}</span><br />{t.hero.h1c}
          </h1>
          <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto mb-4 fade-in" style={{ animationDelay: '300ms' }}>
            {t.hero.sub}
          </p>
          <p className="text-yamato-red font-bold tracking-[0.3em] uppercase text-sm mb-10 fade-in" style={{ animationDelay: '350ms' }}>
            {t.hero.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{ animationDelay: '400ms' }}>
            <Link to="/the-experience" className="btn-primary text-sm px-8 py-4">{t.hero.cta1}</Link>
            <Link to="/stores" className="btn-ghost text-sm px-8 py-4">{t.hero.cta2}</Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-yamato-gray border-y border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <StatItem value="100+" label={t.stats.machines}  delay={0}   />
            <StatItem value="10"   label={t.stats.zones}     delay={150} />
            <StatItem value="3"    label={t.stats.locations} delay={300} />
            <StatItem value="∞"    label={t.stats.fun}       delay={450} />
          </div>
        </div>
      </section>

      {/* FEATURED GAMES */}
      <section className="py-20 max-w-7xl mx-auto px-4 fade-in">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-subtitle">{h.featuredGames.sub}</p>
            <h2 className="section-title text-white">{h.featuredGames.title}</h2>
          </div>
          <Link to="/ya-gaming" className="btn-secondary text-xs py-2 px-4 hidden sm:flex">{t.cta.viewAll}</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map(g => <GameCard key={g.id} game={g} onClick={setSelected} />)}
        </div>
        <Link to="/ya-gaming" className="btn-secondary text-xs py-2.5 px-6 mt-6 sm:hidden block text-center w-full">{h.featuredGames.mobileCta}</Link>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-yamato-dark border-y border-white/5 fade-in">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-subtitle">{h.categories.sub}</p>
              <h2 className="section-title text-white">{h.categories.title}</h2>
            </div>
            <Link to="/ya-gaming" className="btn-secondary text-xs py-2 px-4 hidden sm:flex">{t.cta.browseAll}</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map(c => <CategoryCard key={c.id} category={c} />)}
          </div>
        </div>
      </section>

      {/* PRIZE DROPS TEASER — live from Supabase (featured prizes only) */}
      {featuredPrizes.length > 0 && (
        <section className="py-20 bg-yamato-dark border-t border-white/5 fade-in">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-subtitle">{h.prizeDrops.sub}</p>
                <h2 className="section-title text-white">Prize Drops</h2>
              </div>
              <Link to="/prizes" className="btn-secondary text-xs py-2 px-4 hidden sm:flex">{h.prizeDrops.cta}</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
              {featuredPrizes.slice(0, 5).map(prize => {
                const name = prize.name_en || prize.name_gr
                return (
                  <div key={prize.id} className="card-dark overflow-hidden group">
                    <div className="relative aspect-square bg-yamato-gray overflow-hidden">
                      {prize.image_url ? (
                        <img src={prize.image_url} alt={name} loading="lazy"
                          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white/5 text-3xl">★</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="bg-yamato-red text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5">{h.prizeDrops.dropBadge}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      {prize.hero_tag && (
                        <p className="text-yamato-red text-[9px] font-black tracking-widest uppercase mb-1">{prize.hero_tag}</p>
                      )}
                      <p className="text-white text-xs font-bold leading-snug line-clamp-2">{name}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-white/20 text-[10px] tracking-widest uppercase">{h.prizeDrops.locationNote}</p>
          </div>
        </section>
      )}

      {/* PRIZE GAMES TEASER */}
      <section className="py-20 max-w-7xl mx-auto px-4 fade-in">
        <div className="bg-yamato-gray border border-white/5 rounded-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: text */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <p className="section-subtitle">{h.prizeTeaser.sub}</p>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase leading-tight mb-4">
                {h.prizeTeaser.title}<br />
                <span className="text-yamato-red">{h.prizeTeaser.titleAccent}</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-sm">
                {h.prizeTeaser.desc}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/ya-gaming?cat=Prize+Games" className="btn-primary text-sm px-7 py-3.5">
                  {h.prizeTeaser.cta1}
                </Link>
                <Link to="/prizes" className="btn-ghost text-sm px-7 py-3.5">
                  {h.prizeTeaser.cta2}
                </Link>
              </div>
            </div>
            {/* Right: 4-step grid */}
            <div className="bg-yamato-dark border-l border-white/5 p-8 grid grid-cols-2 gap-3 content-center">
              {h.prizeTeaser.steps.map(s => (
                <div key={s.n} className="card-dark p-4 text-center">
                  <div className="text-yamato-red text-2xl font-black mb-1">{s.n}</div>
                  <p className="text-white font-bold text-xs mb-1">{s.title}</p>
                  <p className="text-white/30 text-[10px] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE PILLARS */}
      <section className="py-20 max-w-7xl mx-auto px-4 fade-in">
        <div className="text-center mb-14">
          <p className="section-subtitle">{h.pillars.sub}</p>
          <h2 className="section-title text-white">{h.pillars.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {h.pillars.items.map(({ title, desc }, i) => {
            const Icon = PILLAR_ICONS[i]
            return (
              <Link key={title} to={PILLAR_LINKS[i]} className="card-dark p-6 hover:border-yamato-red/30 transition-all duration-300 hover:-translate-y-1 group block">
                <div className="text-yamato-red mb-4"><Icon className="w-8 h-8" /></div>
                <h3 className="text-white font-bold text-base mb-2 group-hover:text-yamato-red transition-colors">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* EVENTS */}
      {featuredEvents.length > 0 && (
        <section className="py-20 bg-yamato-dark border-y border-white/5 fade-in">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-subtitle">{h.events.sub}</p>
                <h2 className="section-title text-white">{h.events.title}</h2>
              </div>
              <Link to="/events" className="btn-secondary text-xs py-2 px-4 hidden sm:flex">{h.events.cta}</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredEvents.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          </div>
        </section>
      )}

      {/* BUNDLES CTA */}
      <section className="py-20 max-w-7xl mx-auto px-4 fade-in">
        <div className="bg-yamato-gray border border-white/5 rounded-sm p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="section-subtitle">{h.bundles.sub}</p>
            <h2 className="text-3xl font-black text-white mb-3">{h.bundles.title}</h2>
            <p className="text-white/50 text-sm max-w-sm">{h.bundles.desc}</p>
          </div>
          <Link to="/bundles-passes" className="btn-primary text-sm px-8 py-4 shrink-0">{h.bundles.cta}</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-yamato-dark border-t border-white/5 fade-in">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="section-subtitle">{h.faq.sub}</p>
            <h2 className="section-title text-white">{h.faq.title}</h2>
          </div>
          <FAQAccordion faqs={faqs.slice(0, 4)} />
          <div className="text-center mt-6">
            <Link to="/how-to-play" className="btn-secondary text-xs py-2.5 px-6">{h.faq.cta}</Link>
          </div>
        </div>
      </section>

      {/* CLUB CTA */}
      <section className="py-24 relative overflow-hidden fade-in">
        <div className="absolute inset-0 hero-grid opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-yamato-red/10 blur-3xl" />
        <div className="relative z-10 text-center px-4">
          <p className="section-subtitle">{h.club.sub}</p>
          <h2 className="section-title text-white mb-4">{h.club.title}</h2>
          <p className="text-white/50 max-w-sm mx-auto mb-8 text-sm">{h.club.desc}</p>
          <Link to="/yamato-club" className="btn-primary text-sm px-10 py-4">{h.club.cta}</Link>
        </div>
      </section>

      {selected && <GameModal game={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
