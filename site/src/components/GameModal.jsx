import { useEffect } from 'react'
export default function GameModal({ game, onClose }) {
  useEffect(() => {
    const handler = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose])

  const ytId = game.video_url ? game.video_url.split('v=')[1]?.split('&')[0] : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-yamato-gray border border-white/10 rounded-sm max-w-2xl w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        {ytId ? (
          <div className="aspect-video">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
              title={game.title} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen />
          </div>
        ) : (
          <img src={game.image_url} alt={game.title} className="w-full aspect-video object-cover"
            onError={e => { e.target.src = 'https://placehold.co/800x450/1a1a1a/E30613?text=YAMATO' }} />
        )}
        <div className="p-6">
          <p className="section-subtitle">{game.category}</p>
          <h2 className="text-2xl font-black text-white mb-3">{game.title}</h2>
          <p className="text-white/60 text-sm leading-relaxed">{game.description}</p>
          <button onClick={onClose} className="mt-5 btn-ghost text-xs py-2 px-4">Close</button>
        </div>
      </div>
    </div>
  )
}
