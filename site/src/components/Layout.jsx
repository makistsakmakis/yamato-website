import { useState, useEffect, useRef } from 'react'
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()
  const { lang, setLang, t, languages } = useLang()
  const { totalItems, openDrawer } = useCart()
  const { user, profile, loading: authLoading, signOut } = useAuth()

  const navItems = [
    { label: t.nav.home,        short: 'Home',        path: '/' },
    { label: t.nav.experience,  short: 'Experience',  path: '/the-experience' },
    { label: t.nav.gaming,      short: 'YA Gaming',   path: '/ya-gaming' },
    { label: t.nav.social,      short: 'YA Social',   path: '/ya-social' },
    { label: t.nav.collectibles,short: 'Collectibles / TCG', path: '/ya-collectibles' },
    { label: t.nav.bundles,     short: 'Bundles',     path: '/bundles-passes' },
    { label: t.nav.howto,       short: 'How to Play', path: '/how-to-play' },
    { label: t.nav.stores,      short: 'Stores',      path: '/stores' },
    { label: t.nav.events,      short: 'Events',      path: '/events' },
    { label: t.nav.club,        short: 'Club',        path: '/yamato-club' },
    { label: t.nav.contact,     short: 'Contact',     path: '/contact' },
  ]

  const utilityItems = [
    { label: t.nav.prizes || 'Prizes', path: '/prizes' },
    { label: t.nav.shop || 'Shop', path: '/shop' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const langLabels = { en: 'EN', el: 'ΕΛ', ja: '日本語' }

  return (
    <div className="min-h-screen bg-yamato-black flex flex-col">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-yamato-black/95 backdrop-blur border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-4">
          <Link to="/" className="flex items-center flex-none group">
            <img src="/logo-color.png" alt="YAMATO" className="h-14 w-auto" />
          </Link>

          <nav className="hidden lg:flex flex-1 min-w-0 items-center gap-0.5 overflow-hidden">
            {navItems.map(item => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'}
                className={({isActive}) => `nav-link whitespace-nowrap ${isActive ? 'text-yamato-red' : ''}`}>
                {item.short}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2 flex-none">
            {utilityItems.map(item => (
              <NavLink key={item.path} to={item.path}
                className={({isActive}) => `text-[9px] font-black tracking-widest uppercase px-2.5 py-1 border transition-colors whitespace-nowrap ${
                  item.path === '/shop'
                    ? isActive ? 'border-yamato-red bg-yamato-red text-white' : 'border-yamato-red/60 text-yamato-red hover:bg-yamato-red hover:text-white'
                    : isActive ? 'border-white/40 text-white bg-white/5' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                }`}>
                {item.label}
              </NavLink>
            ))}

            <div className="w-px h-4 bg-white/10 mx-1" />

            {languages.map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`text-[10px] font-bold tracking-widest px-1.5 py-1 transition-colors ${lang === l ? 'text-yamato-red' : 'text-white/30 hover:text-white/70'}`}>
                {langLabels[l]}
              </button>
            ))}

            {!authLoading && (
              user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    className="flex items-center gap-1.5 focus:outline-none group"
                    aria-label="Account menu"
                  >
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-white/20 group-hover:border-yamato-red transition-colors" />
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-yamato-red/20 border-2 border-yamato-red/40 text-yamato-red text-[11px] font-black flex items-center justify-center group-hover:border-yamato-red transition-colors select-none">
                        {(profile?.first_name?.[0] || user.email?.[0] || 'Y').toUpperCase()}
                      </span>
                    )}
                    <svg className={`w-3 h-3 text-white/40 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-yamato-dark border border-white/10 shadow-2xl shadow-black/60 z-50 py-1">
                      <div className="px-4 py-2.5 border-b border-white/5">
                        <p className="text-white text-[11px] font-bold truncate">{profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : (user.email || 'YAMATO Member')}</p>
                        <p className="text-white/30 text-[10px] truncate">{user.email}</p>
                      </div>
                      <NavLink to="/my-yamato" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-bold tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
                        {t.auth?.myYamato || 'My YAMATO'}
                      </NavLink>
                      <NavLink to="/yamato-club" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-bold tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>
                        YAMATO Club
                      </NavLink>
                      <div className="border-t border-white/5 mt-1 pt-1">
                        <button onClick={() => { setDropdownOpen(false); signOut() }}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[11px] font-bold tracking-widest uppercase text-yamato-red/70 hover:text-yamato-red hover:bg-yamato-red/5 transition-colors text-left">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/></svg>
                          {t.auth?.signOut || 'Sign Out'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <NavLink to="/sign-in"
                    className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 border border-white/20 text-white/50 hover:border-white/40 hover:text-white transition-colors">
                    {t.auth?.signIn || 'Sign In'}
                  </NavLink>
                  <NavLink to="/join-club"
                    className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 border border-yamato-red/50 text-yamato-red hover:bg-yamato-red hover:text-white transition-colors">
                    {t.cta?.joinClub || 'Join Club'}
                  </NavLink>
                </>
              )
            )}

            <button onClick={openDrawer} className="relative p-1 text-white/60 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-yamato-red text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>

          <button onClick={() => setMenuOpen(v => !v)} className="lg:hidden flex flex-col gap-1.5 p-2">
            <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-yamato-dark border-t border-white/5 py-4 px-4">
            <div className="grid grid-cols-2 gap-2">
              {[...navItems, ...utilityItems].map(item => (
                <NavLink key={item.path} to={item.path} end={item.path === '/'}
                  className={({isActive}) => `nav-link py-2 px-3 ${isActive ? 'text-yamato-red bg-yamato-gray rounded-sm' : ''}`}>
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-white/5 items-center">
              {languages.map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={`text-xs font-bold tracking-widest transition-colors ${lang === l ? 'text-yamato-red' : 'text-white/30'}`}>
                  {langLabels[l]}
                </button>
              ))}
              {!authLoading && (
                user ? (
                  <NavLink to="/my-yamato" onClick={() => setMenuOpen(false)}
                    className="text-xs font-bold tracking-widest text-yamato-red ml-2">
                    {t.auth?.myYamato || 'My YAMATO'}
                  </NavLink>
                ) : (
                  <>
                    <NavLink to="/sign-in" onClick={() => setMenuOpen(false)}
                      className="text-xs font-bold tracking-widest text-white/50 ml-2">
                      {t.auth?.signIn || 'Sign In'}
                    </NavLink>
                    <NavLink to="/join-club" onClick={() => setMenuOpen(false)}
                      className="text-xs font-bold tracking-widest text-yamato-red ml-1">
                      {t.cta?.joinClub || 'Join'}
                    </NavLink>
                  </>
                )
              )}
              <button onClick={() => { setMenuOpen(false); openDrawer() }} className="ml-auto relative p-1 text-white/60 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yamato-red text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <footer className="bg-yamato-dark border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="mb-5">
                <img src="/logo-white.png" alt="YAMATO" className="h-16 w-auto" />
              </div>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">{t.footer.desc}</p>
              <p className="text-yamato-red text-xs font-bold tracking-[0.3em] uppercase mt-3">Μπες στο παιχνίδι.</p>
              <div className="flex gap-4 mt-5">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-yamato-red transition-colors text-xs tracking-widest uppercase">Instagram</a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-yamato-red transition-colors text-xs tracking-widest uppercase">TikTok</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-yamato-red transition-colors text-xs tracking-widest uppercase">YouTube</a>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-white/50 mb-4">{t.footer.nav}</h3>
              <ul className="space-y-2">
                {navItems.slice(0, 6).map(item => (
                  <li key={item.path}><Link to={item.path} className="text-white/40 hover:text-white text-sm transition-colors">{item.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-white/50 mb-4">{t.footer.more}</h3>
              <ul className="space-y-2">
                {[...navItems.slice(6), ...utilityItems].map(item => (
                  <li key={item.path}><Link to={item.path} className="text-white/40 hover:text-white text-sm transition-colors">{item.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between gap-3">
            <p className="text-white/30 text-xs">{t.footer.rights}</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy-policy" className="text-white/20 hover:text-white/50 text-xs transition-colors">
                {lang === 'el' ? 'Πολιτική Απορρήτου' : 'Privacy Policy'}
              </Link>
              <p className="text-white/20 text-xs">{t.footer.legal}</p>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-yamato-dark border-t border-white/10 p-3 flex gap-2">
        <Link to="/stores" className="btn-primary flex-1 py-2 text-xs">{t.cta.findStore}</Link>
        {user ? (
          <Link to="/my-yamato" className="btn-secondary flex-1 py-2 text-xs">{t.auth?.myYamato || 'My YAMATO'}</Link>
        ) : (
          <Link to="/join-club" className="btn-secondary flex-1 py-2 text-xs">{t.cta.joinClub}</Link>
        )}
      </div>
    </div>
  )
}
