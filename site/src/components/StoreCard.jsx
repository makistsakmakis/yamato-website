export default function StoreCard({ store }) {
  return (
    <div className={`card-dark overflow-hidden ${!store.active ? 'opacity-60' : ''}`}>

      {/* Video / placeholder */}
      {store.video_url ? (
        <div className="relative aspect-video bg-black overflow-hidden">
          <video
            src={store.video_url}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          {store.active && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/70 text-[9px] font-bold tracking-widest uppercase">Open Now</span>
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-video bg-yamato-gray flex items-center justify-center">
          <svg className="w-10 h-10 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
          </svg>
        </div>
      )}

      {/* Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="section-subtitle">Location</p>
            <h3 className="text-white font-bold text-lg">{store.name}</h3>
            {!store.active && <span className="tag bg-white/10 text-white/50 mt-1">Coming Soon</span>}
          </div>
          {store.active && !store.video_url && (
            <div className="w-2 h-2 rounded-full bg-green-400 mt-1 animate-pulse" />
          )}
        </div>

        <div className="space-y-2 text-sm text-white/50">
          <div className="flex gap-3">
            <svg className="w-4 h-4 text-yamato-red shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{store.address}, {store.city}</span>
          </div>

          {store.hours && (
            <div className="flex gap-3">
              <svg className="w-4 h-4 text-yamato-red shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{store.hours}</span>
            </div>
          )}

          {store.phone && (
            <div className="flex gap-3">
              <svg className="w-4 h-4 text-yamato-red shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href={`tel:${store.phone}`} className="hover:text-white transition-colors">{store.phone}</a>
            </div>
          )}
        </div>

        {store.map_url && (
          <a
            href={store.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 btn-secondary text-xs py-2.5 w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7" />
            </svg>
            Get Directions
          </a>
        )}
      </div>
    </div>
  )
}
