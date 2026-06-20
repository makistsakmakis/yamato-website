import ContactForm from '../components/forms/ContactForm'
import { stores } from '../data/stores'
import SectionHero from '../components/SectionHero'
import { useLang } from '../context/LanguageContext'

export default function Contact() {
  const { t } = useLang()
  const p = t.pages.contact
  return (
    <div>
      <SectionHero subtitle={p.hero.sub} title={p.hero.title} description={p.hero.desc} />
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <p className="section-subtitle mb-4">{p.form.label}</p>
            <h2 className="text-2xl font-black text-white mb-8">{p.form.title}</h2>
            <ContactForm />
          </div>
          <div>
            <p className="section-subtitle mb-4">{p.locations.label}</p>
            <h2 className="text-2xl font-black text-white mb-8">{p.locations.title}</h2>
            <div className="space-y-5">
              {stores.filter(s => s.active).map(s => (
                <div key={s.id} className="card-dark p-6">
                  <h3 className="text-white font-bold mb-3">{s.name}</h3>
                  <div className="space-y-2 text-sm text-white/50">
                    <p>{s.address}, {s.city}</p>
                    {s.hours && <p>{s.hours}</p>}
                    {s.phone && <p>{s.phone}</p>}
                  </div>
                  {s.map_url && (
                    <a href={s.map_url} target="_blank" rel="noopener noreferrer"
                      className="btn-secondary mt-4 w-full text-center text-xs py-2">
                      {p.openInMaps}
                    </a>
                  )}
                </div>
              ))}
            </div>
            <div className="card-dark p-6 mt-5">
              <h3 className="text-white font-bold mb-3">{p.socialTitle}</h3>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-yamato-red transition-colors text-sm">Instagram</a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-yamato-red transition-colors text-sm">TikTok</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-yamato-red transition-colors text-sm">YouTube</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
