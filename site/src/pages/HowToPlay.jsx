import { faqs } from '../data/faqs'
import FAQAccordion from '../components/FAQAccordion'
import SectionHero from '../components/SectionHero'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { IconCard } from '../components/Icons'

export default function HowToPlay() {
  const { t } = useLang()
  const p = t.pages.howto
  return (
    <div>
      <SectionHero subtitle={p.hero.sub} title={p.hero.title} description={p.hero.desc} />
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="mb-20">
          <p className="section-subtitle mb-4">{p.steps.label}</p>
          <h2 className="text-3xl font-black text-white mb-10">{p.steps.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {p.stepItems.map(s => (
              <div key={s.n} className="card-dark p-6">
                <div className="text-yamato-red font-black text-4xl mb-4 opacity-40">{s.n}</div>
                <h3 className="text-white font-bold text-base mb-3">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-yamato-gray border border-white/5 rounded-sm p-8 flex flex-col md:flex-row gap-8 items-center mb-20">
          <div className="text-yamato-red shrink-0"><IconCard className="w-14 h-14" /></div>
          <div className="flex-1">
            <p className="section-subtitle">{p.playcard.label}</p>
            <h3 className="text-white font-bold text-xl mb-3">{p.playcard.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-1">{p.playcard.p1}</p>
            <p className="text-white/50 text-sm">{p.playcard.p2}</p>
          </div>
          <Link to="/bundles-passes" className="btn-primary shrink-0 text-sm">{p.playcard.cta}</Link>
        </div>
        <div className="max-w-3xl mx-auto">
          <p className="section-subtitle mb-4">{p.faq.label}</p>
          <h2 className="text-3xl font-black text-white mb-8">{p.faq.title}</h2>
          <FAQAccordion faqs={faqs} />
        </div>
      </section>
    </div>
  )
}
