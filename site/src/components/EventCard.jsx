import { formatDate } from '../lib/supabase';

export default function EventCard({ event }) {
  const date = new Date(event.date)
  const day = new Intl.DateTimeFormat(navigator.language, { day: 'numeric' }).format(date)
  const month = new Intl.DateTimeFormat(navigator.language, { month: 'short' }).format(date).toUpperCase()
  const time = new Intl.DateTimeFormat(navigator.language, { hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
  return (
    <div className="card-dark p-5 flex gap-5 hover:border-yamato-red/20 transition-colors">
      <div className="w-14 h-14 bg-yamato-red/10 border border-yamato-red/30 rounded-sm flex flex-col items-center justify-center shrink-0">
        <span className="text-yamato-red font-black text-xl leading-none">{day}</span>
        <span className="text-yamato-red text-[10px] font-bold tracking-wider">{month}</span>
      </div>
      <div className="flex-1 min-w-0">
        {event.featured && <span className="tag bg-yamato-red/15 text-yamato-red mb-2">Featured</span>}
        <h3 className="text-white font-bold text-sm leading-tight mb-1">{event.title}</h3>
        <p className="text-white/40 text-xs mb-2">{event.location} · {time}</p>
        <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{event.description}</p>
      </div>
    </div>
  )
}
