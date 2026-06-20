export const events = [
  { id:"1", title:"YAMATO Grand Opening", date:"2026-07-01T18:00:00", location:"YAMATO Athens", description:"Greece's first premium indoor amusement destination opens its doors. Live DJs, free play, and exclusive drops for the first 500 through the door.", featured:true },
  { id:"2", title:"TCG Tournament — Pokémon", date:"2026-07-15T14:00:00", location:"YAMATO Athens", description:"Compete in our first official Pokémon TCG tournament. Prizes, glory, and bragging rights.", featured:true },
  { id:"3", title:"Retro Night: 80s Arcade Classics", date:"2026-07-22T20:00:00", location:"YAMATO Thessaloniki", description:"One night dedicated to the golden age. Classic cabinets, neon lights, synthwave soundtrack.", featured:false },
  { id:"4", title:"VR Championship Series", date:"2026-08-05T16:00:00", location:"YAMATO Athens", description:"The ultimate VR competition. Top scores win big.", featured:true },
  { id:"5", title:"Family Fun Sunday", date:"2026-08-10T11:00:00", location:"YAMATO N. Erythraia", description:"Special family rates, kids' tournaments, face painting, and surprise character appearances.", featured:false },
];
export const getFeaturedEvents = () => events.filter(e => e.featured);
