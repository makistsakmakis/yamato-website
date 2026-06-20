import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import SectionHero from '../components/SectionHero'
import { useLang } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { IconStar, IconBag, IconTrophy, IconCard, IconGroup, IconFilm } from '../components/Icons'

const BENEFIT_ICONS = [IconStar, IconBag, IconTrophy, IconCard, IconGroup, IconFilm]

export default function YamatoClub() {
  const { t } = useLang()
  const p = t.pages.club
  const { user, clubMembership, profile } = useAuth()

  return (
    <div>
      <SectionHero subtitle={p.hero.sub} title={p.hero.title} description={p.hero.desc} />
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="section-subtitle">{p.benefits.label}</p>
          <h2 className="section-title text-white">{p.benefits.title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {p.benefitItems.map((b, i) => {
            const Icon = BENEFIT_ICONS[i]
            return (
              <div key={b.title} className="card-dark p-6">
                <div className="text-yamato-red mb-4"><Icon className="w-7 h-7" /></div>
                <h3 className="text-white font-bold text-sm mb-2">{b.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{b.desc}</p>
              </div>
            )
          })}
        </div>

        {/* CTA / Member status */}
        <div className="max-w-lg mx-auto">
          <div className="card-dark p-8 text-center">
            {clubMembership ? (
              // Already a member — show status
              <div className="space-y-5">
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-yamato-red" />
                  <span className="text-yamato-red font-bold text-sm uppercase tracking-widest">YAMATO Club Member</span>
                </div>
                <p className="text-white text-lg font-black">
                  {profile?.first_name ? `Καλωσόρισες, ${profile.first_name}!` : 'Καλωσόρισες!'}
                </p>
                {clubMembership.member_number && (
                  <p className="text-white/40 text-xs font-mono tracking-widest">{clubMembership.member_number}</p>
                )}
                <Link to="/my-yamato" className="btn-primary inline-block px-8 py-3 text-xs font-bold tracking-widest uppercase">
                  {t.auth?.myYamato || 'My YAMATO'}
                </Link>
              </div>
            ) : (
              // Not a member — join CTA
              <div className="space-y-5">
                <div className="text-center mb-4">
                  <p className="section-subtitle">{p.form.label}</p>
                  <h2 className="text-2xl font-black text-white">{p.form.title}</h2>
                  <p className="text-white/40 text-sm mt-2">{p.form.sub}</p>
                </div>
                <Link to="/join-club" className="btn-primary inline-block px-8 py-3 text-sm font-bold tracking-widest uppercase">
                  {t.cta?.joinClub || 'Join YAMATO Club'}
                </Link>
                {user && (
                  <p className="text-white/30 text-xs">
                    {t.auth?.signIn ? '' : 'Signed in as'} {user.email}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
