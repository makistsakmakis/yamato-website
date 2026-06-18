import { Link } from 'react-router-dom'
export default function CategoryCard({ category, gameCount }) {
  return (
    <Link to={`/ya-gaming?cat=${encodeURIComponent(category.name)}`}
      className="card-dark group relative overflow-hidden block hover:border-yamato-red/30 transition-all duration-200 hover:-translate-y-1">
      <div className="aspect-square overflow-hidden">
        <img src={category.image_url} alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-70 group-hover:opacity-90"
          onError={e => { e.target.src = 'https://placehold.co/400x400/1a1a1a/E30613?text=YAMATO' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-sm leading-tight">{category.name}</h3>
        {gameCount && <p className="text-white/40 text-xs mt-0.5">{gameCount} games</p>}
      </div>
    </Link>
  )
}
