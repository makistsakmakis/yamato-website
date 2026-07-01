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
        {/* THE CARD — playcard photo + description */}
        <div className="mb-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div className="absolute -inset-6 bg-yamato-red/15 blur-3xl rounded-full pointer-events-none" />
            <img src="/experience/photo6.jpg" alt="YAMATO Card" className="relative w-full max-w-xs mx-auto rounded-sm shadow-2xl" />
          </div>
          <div>
            <p className="section-subtitle mb-4">{p.playcard.label}</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-5">{p.playcard.title}</h2>
            <p className="text-white/50 text-sm leading-relaxed mb-4">{p.playcard.p1}</p>
            <p className="text-white/50 text-sm leading-relaxed mb-8">{p.playcard.p2}</p>
            <a href="#passes" className="btn-primary text-sm px-8 py-3.5">{p.playcard.cta}</a>
          </div>
        </div>

        <div className="mb-20" id="passes">
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
