import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedEvents } from '../data/events'
import EventCard from '../components/EventCard'
import FAQAccordion from '../components/FAQAccordion'
import { faqs } from '../data/faqs'
import { useLang } from '../context/LanguageContext'
import { IconController, IconGroup, IconBag, IconCard } from '../components/Icons'
import { getPrizeShowcase } from '../lib/supabase'

const PILLAR_ICONS = [IconController, IconGroup, IconBag, IconCard]
const PILLAR_LINKS = ['/ya-gaming', '/ya-social', '/shop', '/shop']

// Experience tab control content (see "Choose your night")
const EXPERIENCE_TABS = [
  {
    key: 'gameplay', en: 'GAMEPLAY', jp: '遊ぶ',
    punch: '95 machines',
    body: "From claw machines and racing cabinets to pinball, retro legends and VR. A swipe with the YAMATO card and you're in.",
    ctas: [
      { label: 'Check the Zones', to: '/ya-gaming' },
      { label: 'Get your CARD', to: '/how-to-play' },
    ],
    photos: ['/experience/photo3.jpg', '/experience/photo1.jpg'],
  },
  {
    key: 'collections', en: 'COLLECTIONS', jp: '集める',
    punch: 'KIWAMI — the collection',
    body: 'Pokémon TCG, graded cards, designer toys and anime figures in museum-grade display cases. Come for the open, stay for the Vault.',
    ctas: [
      { label: 'Get in the Action', to: '/events' },
      { label: 'Buy Online', to: '/shop?category=TCG' },
    ],
    photos: ['/experience/photo5.jpg'],
  },
  {
    key: 'events', en: 'EVENTS', jp: '祝う',
    punch: 'Your space',
    body: 'Birthdays, corporate Events, Tournaments. We take care of food, drink, and play — you just show up.',
    ctas: [
      { label: 'Find Out', to: '/events' },
      { label: 'Book your Night', to: '/contact' },
    ],
    photos: ['/experience/photo2.jpg'],
  },
  {
    key: 'social', en: 'SOCIAL PLAY', jp: '社交',
    punch: 'Bring the whole Gang!',
    body: "YAMATO's Social Entertainment & AR zone is where the magic happens for groups. Challenge each other at AR Darts, or gather around the shuffleboard.",
    ctas: [
      { label: 'Find Out', to: '/ya-social' },
      { label: 'Book your Night', to: '/contact' },
    ],
    photos: ['/experience/photo4.jpg'],
  },
]

function ExperienceTabs() {
  const [active, setActive] = useState(0)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [slider, setSlider] = useState({ left: 0, width: 0 })
  const tabRefs = useRef([])
  const tab = EXPERIENCE_TABS[active]

  // Position the red slider under the active tab
  useEffect(() => {
    const move = () => {
      const el = tabRefs.current[active]
      if (el) setSlider({ left: el.offsetLeft, width: el.offsetWidth })
    }
    move()
    window.addEventListener('resize', move)
    return () => window.removeEventListener('resize', move)
  }, [active])

  // Reset carousel when tab changes; auto-advance if multiple photos
  useEffect(() => {
    setPhotoIdx(0)
    if (tab.photos.length < 2) return
    const id = setInterval(() => setPhotoIdx(i => (i + 1) % tab.photos.length), 4000)
    return () => clearInterval(id)
  }, [active])

  return (
    <div>
      {/* Tabs */}
      <div className="relative mb-8">
        <div className="flex gap-6 sm:gap-10 overflow-x-auto nav-no-scrollbar">
          {EXPERIENCE_TABS.map((tb, i) => (
            <button
              key={tb.key}
              ref={el => (tabRefs.current[i] = el)}
              onClick={() => setActive(i)}
              className="pb-4 flex-none text-left focus:outline-none group"
            >
              <span className={`block font-black text-lg sm:text-2xl tracking-tight uppercase transition-colors ${active === i ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                {tb.en}
              </span>
              <span className={`block text-sm mt-0.5 transition-colors ${active === i ? 'text-yamato-red' : 'text-white/25 group-hover:text-yamato-red/60'}`}>
                {tb.jp}
              </span>
            </button>
          ))}
        </div>
        {/* thin gray line + red slider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/15" />
        <div
          className="absolute bottom-0 h-1 bg-yamato-red transition-all duration-300 ease-out"
          style={{ left: slider.left, width: slider.width }}
        />
      </div>

      {/* Panel */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* Left: text + CTAs */}
        <div className="flex flex-col">
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase leading-tight mb-6">{tab.punch}</h3>
          <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-md mb-auto">{tab.body}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            {tab.ctas.map((c, i) => (
              <Link
                key={c.to + i}
                to={c.to}
                className={i === 0 ? 'btn-primary text-xs px-6 py-3.5' : 'btn-ghost text-xs px-6 py-3.5'}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
        {/* Right: photo / carousel */}
        <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[340px] bg-yamato-gray rounded-sm overflow-hidden border border-white/5">
          {tab.photos.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={tab.en}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === photoIdx ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          {tab.photos.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {tab.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPhotoIdx(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === photoIdx ? 'bg-yamato-red' : 'bg-white/40'}`}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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
  const featuredEvents = getFeaturedEvents()
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
        {/* Giant Japanese watermark — 温かい歓迎 (warm welcome) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <span className="font-black leading-none whitespace-nowrap" style={{ fontSize: '20vw', color: '#83071f', opacity: 0.14 }}>温かい歓迎</span>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yamato-red/10 border border-yamato-red/20 px-4 py-1.5 rounded-full mb-8 fade-in">
            <div className="w-1.5 h-1.5 bg-yamato-red rounded-full animate-pulse" />
            <span className="text-yamato-red text-xs font-bold tracking-widest uppercase">{t.hero.badge}</span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-white leading-[0.95] mb-6 fade-in" style={{ animationDelay: '150ms' }}>
            PLAY <span className="text-yamato-red">LIKE IN</span> TOKYO
          </h1>
          <p className="text-white/45 text-sm md:text-base max-w-xl mx-auto mb-2 fade-in" style={{ animationDelay: '280ms' }}>
            大和へようこそ　·　59 El. Venizelou, N. Erythraia
          </p>
          <p className="text-white/45 text-sm md:text-base max-w-xl mx-auto mb-10 fade-in" style={{ animationDelay: '340ms' }}>
            An arcade panorama full of claw, racing, pinball, retro &amp; VR. Come and stay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{ animationDelay: '420ms' }}>
            <Link to="/stores" className="btn-primary text-sm px-8 py-4">{t.hero.cta2}</Link>
            <Link to="/how-to-play" className="btn-ghost text-sm px-8 py-4">The Card</Link>
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

      {/* CHOOSE YOUR NIGHT — experience tabs */}
      <section className="py-20 bg-yamato-dark border-y border-white/5 fade-in">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10">
            <p className="section-subtitle">遊び方 · HOW TO EXPERIENCE IT</p>
            <h2 className="section-title text-white">Choose your night</h2>
          </div>
          <ExperienceTabs />
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

    </div>
  )
}
