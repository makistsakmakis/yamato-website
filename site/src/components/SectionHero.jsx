export default function SectionHero({ subtitle, title, description, children }) {
  return (
    <section className="relative bg-yamato-dark hero-grid pt-20 pb-16 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <p className="section-subtitle">{subtitle}</p>
        <h1 className="section-title text-white mb-4 max-w-2xl">{title}</h1>
        {description && <p className="text-white/50 text-base max-w-xl leading-relaxed">{description}</p>}
        {children}
      </div>
    </section>
  )
}
