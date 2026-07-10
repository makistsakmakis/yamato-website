export default function GameCard({ game, onClick }) {
  const ytId = game.video_url ? game.video_url.split('v=')[1]?.split('&')[0] : null
  return (
    <div onClick={() => onClick && onClick(game)}
      className="card-dark group cursor-pointer hover:border-yamato-red/30 transition-all duration-200 hover:-translate-y-1">
      {/* Uniform black backdrop behind every game image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        <img src={game.image_url || '/placeholder.jpg'} alt={game.title}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = 'https://placehold.co/400x300/000000/E30613?text=YAMATO' }} />
        {game.featured && (
          <div className="absolute top-2 left-2 bg-yamato-red text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5">Featured</div>
        )}
        {ytId && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
            <div className="w-12 h-12 rounded-full bg-yamato-red flex items-center justify-center">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-yamato-red text-[10px] font-bold tracking-[0.2em] uppercase mb-1">{game.category}</p>
        <h3 className="text-white font-bold text-sm leading-tight mb-2 line-clamp-1">{game.title}</h3>
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{game.description}</p>
      </div>
    </div>
  )
}
