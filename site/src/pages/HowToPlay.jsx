import { faqs } from '../data/faqs'
import { bundles } from '../data/bundles'
import FAQAccordion from '../components/FAQAccordion'
import BundleCard from '../components/BundleCard'
import SectionHero from '../components/SectionHero'
import { useLang } from '../context/LanguageContext'

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

        <div className="mb-20">
          <p className="section-subtitle mb-4">Bundles &amp; Passes</p>
          <h2 className="text-3xl font-black text-white mb-3">Play Your Way.</h2>
          <p className="text-white/50 text-sm mb-10">YAMATO Playcard, Summer Pass, Whole Gang Pass, and Gift Cards. Available at all locations.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bundles.map(b => <BundleCard key={b.id} bundle={b} />)}
          </div>
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
