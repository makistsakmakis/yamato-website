import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import SectionHero from '../components/SectionHero'
import { getPrizeProducts } from '../lib/supabase'

function getGameType(nameEn = '') {
  const n = nameEn.toLowerCase()
  if (n.includes('plush') || n.includes('squishmallow') || n.includes('sleeping')) return 'Claw Machines'
  if (n.includes('figure') || n.includes('battle') || n.includes('11cm')) return 'Premium Figure Games'
  if (n.includes('backpack')) return 'Prize Games'
  return 'Prize Games'
}

const PRIZE_CATEGORIES = [
  { label: 'Anime Heroes', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" /></svg> },
  { label: 'Gaming Icons', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><rect x="2" y="7" width="20" height="12" rx="3" /><path strokeLinecap="round" d="M8 13h0M11 13h0" strokeWidth="2.5" /><path strokeLinecap="round" d="M17 11v4M15 13h4" /></svg> },
  { label: 'Movie & Series', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><rect x="2" y="4" width="20" height="16" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M2 8h20M7 4v4M12 4v4M17 4v4M7 12v4M12 12v4M17 12v4" /></svg> },
  { label: 'Cute & Kawaii', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.5 4.5h4.5l-3.7 2.7 1.4 4.3L12 12l-3.7 2.5 1.4-4.3L6 7.5h4.5z" /><circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" /><circle cx="7" cy="17" r="1" fill="currentColor" stroke="none" /><circle cx="17" cy="17" r="1" fill="currentColor" stroke="none" /></svg> },
  { label: 'Collector Figures', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 21h14M8 21v-4M16 21v-4M4 10l4 7h8l4-7M8 10V6a4 4 0 018 0v4" /></svg> },
]

const PAGE_SIZES = [10, 25, 50]

function PrizeCard({ prize, lang, p }) {
  const name = lang === 'el' ? (prize.name_gr || prize.name_en) : (prize.name_en || prize.name_gr)
  const gameType = getGameType(prize.name_en || '')
  const isFeatured = prize.is_featured_prize

  return (
    <div className="card-dark overflow-hidden group flex flex-col">
      <div className="relative bg-yamato-gray aspect-square overflow-hidden flex-none">
        {prize.image_url ? (
          <img src={prize.image_url} alt={name} loading="lazy"
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white/5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        )}
        {isFeatured && (
          <div className="absolute top-2 left-2">
            <span className="bg-yamato-red text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5">Featured</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="bg-black/60 text-white/50 text-[9px] tracking-wider uppercase px-2 py-0.5 backdrop-blur-sm">{gameType}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        {prize.hero_tag && <p className="text-yamato-red text-[10px] font-black tracking-widest uppercase mb-1">{prize.hero_tag}</p>}
        <h3 className="text-white font-bold text-sm mb-1 leading-snug flex-1">{name}</h3>
        {prize.brand && <p className="text-white/25 text-[10px] tracking-widest uppercase mb-3">{prize.brand}</p>}
        <p className="text-white/30 text-[10px] mb-4 leading-relaxed">{p.availableIn}</p>
        <Link to="/ya-gaming?cat=Prize+Games"
          className="block text-center text-[10px] font-black tracking-widest uppercase py-2.5 border border-yamato-red/40 text-yamato-red hover:bg-yamato-red hover:text-white hover:border-yamato-red transition-all duration-200">
          {p.playToWin}
        </Link>
      </div>
    </div>
  )
}

function FeaturedPrizeCard({ prize, lang }) {
  const name = lang === 'el' ? (prize.name_gr || prize.name_en) : (prize.name_en || prize.name_gr)
  return (
    <div className="relative group shrink-0 w-44 sm:w-52">
      <div className="relative bg-yamato-gray overflow-hidden aspect-square">
        {prize.image_url ? (
          <img src={prize.image_url} alt={name} loading="lazy"
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white/5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 left-2">
          <span className="bg-yamato-red text-white text-[8px] font-black tracking-widest uppercase px-2 py-0.5">★ FEATURED</span>
        </div>
      </div>
      <div className="pt-3 px-1">
        {prize.hero_tag && <p className="text-yamato-red text-[9px] font-black tracking-widest uppercase mb-0.5">{prize.hero_tag}</p>}
        <p className="text-white font-bold text-xs leading-snug">{name}</p>
        {prize.brand && <p className="text-white/25 text-[9px] tracking-widest uppercase mt-0.5">{prize.brand}</p>}
      </div>
    </div>
  )
}

export default function Prizes() {
  const { t, lang } = useLang()
  const p = t.pages.prizes
  const ui = t.ui

  const [prizes, setPrizes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [activeFilter, setActiveFilter] = useState(null)
  const [pageSize, setPageSize] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    getPrizeProducts()
      .then(data => { setPrizes(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  // Reset to page 1 when filter or page size changes
  useEffect(() => { setCurrentPage(1) }, [filterType, activeFilter, pageSize])

  const heroes = [...new Set(prizes.map(p => p.hero_tag).filter(Boolean))].sort()
  const brands = [...new Set(prizes.map(p => p.brand).filter(Boolean))].sort()
  const featuredPrizes = prizes.filter(pr => pr.is_featured_prize)

  const filtered = prizes.filter(prize => {
    if (filterType === 'hero' && activeFilter) return prize.hero_tag === activeFilter
    if (filterType === 'brand' && activeFilter) return prize.brand === activeFilter
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const selectFilter = (type, value) => {
    if (filterType === type && activeFilter === value) {
      setActiveFilter(null)
    } else {
      setFilterType(type)
      setActiveFilter(value)
    }
  }

  return (
    <div>
      <SectionHero subtitle="Prize Drops" title={p.hero.title} description={p.hero.desc} />

      {/* Note strip */}
      <div className="bg-yamato-gray border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-[11px] tracking-wider">{p.hero.note}</p>
          <Link to="/ya-gaming?cat=Prize+Games" className="btn-secondary text-xs py-2 px-5 shrink-0 whitespace-nowrap">
            {p.hero.cta2}
          </Link>
        </div>
      </div>

      {/* ── FEATURED PRIZES SPOTLIGHT ──────────────────────────── */}
      {!loading && featuredPrizes.length > 0 && (
        <section className="bg-yamato-dark border-b border-white/5 py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-yamato-red text-[10px] font-black tracking-widest uppercase mb-1">{p.featured.label}</p>
                <h2 className="text-white text-xl font-black uppercase tracking-tight">{p.featured.title}</h2>
              </div>
              <span className="text-white/20 text-[10px] tracking-widest uppercase hidden sm:block">
                {featuredPrizes.length} {ui.prizes}
              </span>
            </div>
            {/* Horizontal scroll row */}
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
              {featuredPrizes.map(prize => (
                <div key={prize.id} className="snap-start">
                  <FeaturedPrizeCard prize={prize} lang={lang} />
                </div>
              ))}
            </div>
            {/* Fade hint on mobile */}
            <div className="mt-3 flex items-center gap-2 sm:hidden">
              <div className="flex gap-1">
                {[...Array(Math.min(featuredPrizes.length, 5))].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-white/20" />
                ))}
              </div>
              <p className="text-white/20 text-[9px] tracking-widest uppercase">{ui.scrollHint}</p>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Category world pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {PRIZE_CATEGORIES.map(cat => (
            <div key={cat.label}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-white/5 text-yamato-red text-[10px] tracking-widest uppercase hover:border-yamato-red/20 transition-colors">
              {cat.icon}
              <span className="text-white/30">{cat.label}</span>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="mb-8 space-y-3">
          <div className="flex gap-2 flex-wrap">
            {['all', 'hero', 'brand'].map(type => (
              <button key={type}
                onClick={() => { setFilterType(type); setActiveFilter(null) }}
                className={`text-[10px] font-black tracking-widest uppercase px-4 py-2 border transition-all ${
                  filterType === type && !activeFilter
                    ? 'bg-yamato-red border-yamato-red text-white'
                    : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                }`}>
                {type === 'all' ? p.filters.all : type === 'hero' ? p.filters.hero : p.filters.brand}
              </button>
            ))}
          </div>

          {filterType === 'hero' && heroes.length > 0 && (
            <div className="flex gap-2 flex-wrap pl-1">
              {heroes.map(h => (
                <button key={h} onClick={() => selectFilter('hero', h)}
                  className={`text-[10px] font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    activeFilter === h ? 'bg-white/10 border-white/40 text-white' : 'border-white/5 text-white/30 hover:border-white/20 hover:text-white/60'
                  }`}>
                  {h}
                </button>
              ))}
            </div>
          )}

          {filterType === 'brand' && brands.length > 0 && (
            <div className="flex gap-2 flex-wrap pl-1">
              {brands.map(b => (
                <button key={b} onClick={() => selectFilter('brand', b)}
                  className={`text-[10px] font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    activeFilter === b ? 'bg-white/10 border-white/40 text-white' : 'border-white/5 text-white/30 hover:border-white/20 hover:text-white/60'
                  }`}>
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results bar + page size selector */}
        {!loading && !error && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="text-white/20 text-[10px] tracking-widest uppercase">
              {filtered.length} {filtered.length === 1 ? ui.prize : ui.prizes}
              {totalPages > 1 && ` · ${ui.pageOf} ${currentPage}/${totalPages}`}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-white/20 text-[10px] tracking-widest uppercase">{ui.perPage}</span>
              <div className="flex gap-1">
                {PAGE_SIZES.map(size => (
                  <button key={size} onClick={() => setPageSize(size)}
                    className={`text-[10px] font-black px-2.5 py-1 border transition-all ${
                      pageSize === size
                        ? 'bg-yamato-red border-yamato-red text-white'
                        : 'border-white/10 text-white/30 hover:border-white/30 hover:text-white'
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* States */}
        {loading && (
          <div className="text-center py-24">
            <div className="inline-block w-6 h-6 border-2 border-yamato-red/30 border-t-yamato-red rounded-full animate-spin mb-4" />
            <p className="text-white/20 text-xs tracking-widest uppercase">{ui.loadingPrizes}</p>
          </div>
        )}
        {error && (
          <div className="text-center py-24">
            <p className="text-white/30 text-sm mb-4">{ui.errorPrizes}</p>
            <Link to="/ya-gaming?cat=Prize+Games" className="btn-secondary text-xs py-2 px-5">{ui.explorePrizes}</Link>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-white/20 text-center py-16 text-sm">{p.noResults}</p>
        )}

        {/* Prize grid — paginated */}
        {!loading && !error && paginated.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {paginated.map(prize => (
              <PrizeCard key={prize.id} prize={prize} lang={lang} p={p} />
            ))}
          </div>
        )}

        {/* Pagination controls */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-white/10 text-white/40 text-[10px] font-black tracking-widest uppercase hover:border-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all">
              {ui.prevPage}
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 2)
                .reduce((acc, n, idx, arr) => {
                  if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…')
                  acc.push(n)
                  return acc
                }, [])
                .map((item, idx) =>
                  item === '…' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 py-2 text-white/20 text-[10px]">…</span>
                  ) : (
                    <button key={item} onClick={() => setCurrentPage(item)}
                      className={`w-8 h-8 text-[10px] font-black border transition-all ${
                        currentPage === item
                          ? 'bg-yamato-red border-yamato-red text-white'
                          : 'border-white/10 text-white/30 hover:border-white/30 hover:text-white'
                      }`}>
                      {item}
                    </button>
                  )
                )
              }
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-white/10 text-white/40 text-[10px] font-black tracking-widest uppercase hover:border-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all">
              {ui.nextPage}
            </button>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <section className="py-20 bg-yamato-dark border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="section-subtitle">{ui.howToWin}</p>
              <h2 className="section-title text-white mb-4">{p.cta.title}</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md">{p.cta.desc}</p>
              <Link to="/ya-gaming?cat=Prize+Games" className="btn-primary text-sm px-8 py-4">{p.cta.btn}</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ui.winSteps.map(s => (
                <div key={s.n} className="card-dark p-5">
                  <div className="text-yamato-red text-2xl font-black mb-2">{s.n}</div>
                  <h3 className="text-white font-bold text-xs mb-1">{s.title}</h3>
                  <p className="text-white/30 text-[10px] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
