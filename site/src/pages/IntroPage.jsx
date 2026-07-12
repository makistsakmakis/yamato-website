import { useEffect, useRef } from 'react'

const INTRO_CSS = `
  #yamato-intro {
    position: fixed;
    inset: 0;
    z-index: 9999;
    overflow: hidden;
    background: #83071f;
    font-family: 'Arial', sans-serif;
  }
  #yamato-intro #stage {
    position: relative;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    background: #83071f;
    overflow: hidden;
    cursor: default;
  }
  #yamato-intro #flatRed {
    position: absolute; inset: 0;
    background: #83071f;
    z-index: 5;
    animation: yi-flatHold 2.0s ease-out forwards, yi-flatFade 0.5s ease-in forwards 2.4s;
  }
  @keyframes yi-flatHold {
    0%   { filter: brightness(1); }
    85%  { filter: brightness(1); }
    100% { filter: brightness(1.25); }
  }
  @keyframes yi-flatFade {
    0%   { opacity: 1; }
    100% { opacity: 0; visibility: hidden; }
  }
  #yamato-intro #cracks {
    position: absolute; inset: 0;
    z-index: 7; /* above ANY (6) so the crack runs over it — PRESS/BUTTON stay above (40) */
    animation: yi-cracksOut 0.3s ease-in forwards 2.4s;
  }
  @keyframes yi-cracksOut { to { opacity: 0; } }
  /* Crack builds in 3 beats: krak – krak – krak (50% slower) */
  #yamato-intro #cracks .g1,
  #yamato-intro #cracks .g2,
  #yamato-intro #cracks .g3 { opacity: 0; }
  #yamato-intro #cracks .g1 { animation: yi-crackSnap 0.1s ease-out forwards 0.5s; }
  #yamato-intro #cracks .g2 { animation: yi-crackSnap 0.1s ease-out forwards 1.25s; }
  #yamato-intro #cracks .g3 { animation: yi-crackSnap 0.1s ease-out forwards 2.0s; }
  @keyframes yi-crackSnap {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }
  #yamato-intro #cracks path {
    fill: none;
    stroke: #2c0608;
    stroke-width: 2.2;
    stroke-linecap: round;
    filter: drop-shadow(0 0 2px rgba(0,0,0,0.6));
  }
  #yamato-intro #cracks .glow {
    stroke: #ff6a6a;
    stroke-width: 1;
    opacity: 0.8;
  }
  #yamato-intro #flash {
    position: absolute; inset: 0;
    background: #fff;
    z-index: 30;
    opacity: 0;
    pointer-events: none;
    animation: yi-flashPulse 0.35s ease-out forwards 2.35s;
  }
  @keyframes yi-flashPulse {
    0%   { opacity: 0; }
    15%  { opacity: 0.85; }
    100% { opacity: 0; }
  }
  #yamato-intro .yi-shard {
    position: absolute;
    left: 50%; top: 45%;
    width: var(--w); height: var(--h);
    background: linear-gradient(135deg, var(--c1), var(--c2));
    clip-path: var(--clip);
    opacity: 0;
    transform: translate(-50%,-50%) translate(0,0) rotate(0deg) scale(0.3);
    z-index: 20;
    will-change: transform, opacity;
    box-shadow: 0 0 8px rgba(0,0,0,0.4) inset;
  }
  #yamato-intro .yi-shard.go {
    animation: yi-shardFly var(--dur) cubic-bezier(.16,.84,.44,1) forwards var(--delay);
  }
  @keyframes yi-shardFly {
    0%   { opacity: 0; transform: translate(-50%,-50%) translate(0,0) rotate(0deg) scale(0.4); }
    8%   { opacity: 1; transform: translate(-50%,-50%) translate(calc(var(--tx)*0.08), calc(var(--ty)*0.08)) rotate(calc(var(--rot)*0.1)) scale(1.05); }
    100% { opacity: 0; transform: translate(-50%,-50%) translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.6); }
  }
  #yamato-intro #finalWrap {
    position: absolute; inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    animation: yi-finalIn 0.6s cubic-bezier(.2,.8,.2,1.1) forwards 2.25s;
  }
  @keyframes yi-finalIn {
    0%   { opacity: 0; transform: scale(0.85); filter: brightness(2.2) blur(2px); }
    60%  { opacity: 1; transform: scale(1.03); filter: brightness(1.15) blur(0); }
    100% { opacity: 1; transform: scale(1); filter: brightness(1) blur(0); }
  }
  #yamato-intro #finalImg {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }
  #yamato-intro #hotspotWrap {
    position: absolute;
    z-index: 40;
    left: 50%; top: 45.5%;
    width: min(38vw, 65vh);
    height: min(38vw, 65vh);
    transform: translate(-50%,-50%);
    opacity: 0;
    pointer-events: none;
    animation: yi-hotspotIn 0.4s ease-out forwards 2.8s;
  }
  #yamato-intro #hotspotWrap.active { pointer-events: auto; }
  @keyframes yi-hotspotIn { to { opacity: 1; } }
  #yamato-intro #hotspot {
    position: absolute; inset: 0;
    border-radius: 50%;
    cursor: pointer;
  }
  #yamato-intro .glowRing {
    position: absolute;
    left: 50%; top: 50%;
    width: 190%; height: 190%;
    border-radius: 50%;
    transform: translate(-50%,-50%) scale(1);
    background: radial-gradient(circle,
      rgba(255,90,70,0.50) 0%,
      rgba(255,70,55,0.34) 24%,
      rgba(220,50,45,0.16) 42%,
      rgba(160,30,30,0.06) 60%,
      rgba(120,15,20,0) 78%);
    pointer-events: none;
    animation: yi-glowPulse 1.9s ease-in-out infinite;
  }
  @keyframes yi-glowPulse {
    0%   { transform: translate(-50%,-50%) scale(0.92); opacity: 0.7; }
    50%  { transform: translate(-50%,-50%) scale(1.04); opacity: 1; }
    100% { transform: translate(-50%,-50%) scale(0.92); opacity: 0.7; }
  }
  #yamato-intro #hotspot:hover { filter: brightness(1.08); }
  /* PRESS ANY BUTTON — vertical stack (mobile-friendly), big square condensed type.
     PRESS on top, ANY over the button, BUTTON below.
     ANY lives in its own layer (z 6) so the cracks (z 7) run over it,
     while PRESS/BUTTON sit above everything (z 40). */
  #yamato-intro #pressLabel,
  #yamato-intro #anyWord {
    color: #ffffff;
    font-family: 'Bahnschrift SemiCondensed','Bahnschrift','Play','Arial Narrow',Arial,sans-serif;
    font-stretch: condensed;
    font-weight: 500;
    font-size: clamp(3rem, 9vw, 7.5rem);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    line-height: 1;
    text-align: center;
    text-shadow:
      -1px 2px 0 #000,
      -2px 4px 0 #000,
      -3px 6px 0 #000,
      -4px 8px 0 #000,
      -5px 10px 16px rgba(0,0,0,0.65);
    opacity: 0;
    pointer-events: none;
  }
  #yamato-intro #pressLabel {
    position: absolute;
    inset: 0;
    z-index: 40;
    animation: yi-labelIn 0.4s ease-out forwards 0.1s;
  }
  @keyframes yi-labelIn { to { opacity: 1; } }
  #yamato-intro #pressLabel .word {
    position: absolute;
    left: 0; right: 0;
  }
  #yamato-intro #pressTop { top: 6%; }
  #yamato-intro #pressBottom { bottom: 6%; }
  #yamato-intro #anyWord {
    position: absolute;
    left: 0; right: 0;
    top: 45.5%;
    transform: translateY(-50%);
    z-index: 6; /* under the cracks (7): the krak runs across ANY too */
    animation: yi-labelIn 0.4s ease-out forwards 0.1s, yi-anyOut 0.3s ease-out forwards 2.3s;
  }
  @keyframes yi-anyOut { to { opacity: 0; } }
  #yamato-intro #pressLabel.hide,
  #yamato-intro #anyWord.hide {
    transition: opacity 0.25s ease-out;
    opacity: 0 !important;
  }
  #yamato-intro #blackout {
    position: absolute; inset: 0;
    z-index: 60;
    background: #000;
    opacity: 0;
    pointer-events: none;
  }
  #yamato-intro #blackout.go {
    transition: opacity 1.1s ease-in;
    opacity: 1;
  }
  @media (prefers-reduced-motion: reduce) {
    #yamato-intro #flatRed  { animation: none !important; opacity: 0; visibility: hidden; }
    #yamato-intro #cracks   { animation: none !important; opacity: 0; }
    #yamato-intro #flash    { animation: none !important; }
    #yamato-intro .yi-shard { animation: none !important; }
    #yamato-intro #finalWrap   { animation: none !important; opacity: 1; transform: none; filter: none; }
    #yamato-intro #hotspotWrap { animation: none !important; opacity: 1; pointer-events: auto; }
    #yamato-intro .glowRing    { animation: none !important; }
    #yamato-intro #pressLabel  { animation: none !important; opacity: 1; }
    #yamato-intro #anyWord     { animation: none !important; opacity: 0; }
  }
`

// Base64 background image (the YAMATO key visual)
const BG_IMAGE = '/yamato-intro-bg.jpg'

export default function IntroPage({ onEnter }) {
  const shardLayerRef = useRef(null)
  const hotspotWrapRef = useRef(null)
  const tapLabelRef = useRef(null)
  const blackoutRef = useRef(null)
  const leavingRef = useRef(false)

  useEffect(() => {
    // Inject scoped CSS
    const styleEl = document.createElement('style')
    styleEl.id = 'yamato-intro-styles'
    styleEl.textContent = INTRO_CSS
    document.head.appendChild(styleEl)

    // Build shards
    const shardLayer = shardLayerRef.current
    const N = 26
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!reduceMotion && shardLayer) {
      const shapes = [
        'polygon(50% 0%, 100% 38%, 78% 100%, 12% 88%)',
        'polygon(0% 0%, 100% 20%, 80% 100%, 10% 70%)',
        'polygon(20% 0%, 100% 0%, 80% 100%, 0% 80%)',
        'polygon(50% 0%, 100% 100%, 0% 100%)',
        'polygon(0% 30%, 60% 0%, 100% 60%, 40% 100%)',
      ]
      for (let i = 0; i < N; i++) {
        const s = document.createElement('div')
        s.className = 'yi-shard'
        const angle = (Math.PI * 2 * i) / N + (Math.random() * 0.4 - 0.2)
        const dist = 380 + Math.random() * 520
        const tx = Math.cos(angle) * dist
        const ty = Math.sin(angle) * dist * 0.85 - (60 + Math.random() * 120)
        const rot = Math.random() * 720 - 360
        const w = 14 + Math.random() * 46
        const h = 14 + Math.random() * 46
        const dur = 0.75 + Math.random() * 0.6
        const delay = 2.1 + Math.random() * 0.14
        const clip = shapes[Math.floor(Math.random() * shapes.length)]
        const dark = Math.random() > 0.4
        const c1 = dark ? '#4a0a0f' : '#d9384a'
        const c2 = dark ? '#1f0405' : '#7a0c14'

        s.style.setProperty('--tx', tx.toFixed(0) + 'px')
        s.style.setProperty('--ty', ty.toFixed(0) + 'px')
        s.style.setProperty('--rot', rot.toFixed(0) + 'deg')
        s.style.setProperty('--w', w.toFixed(0) + 'px')
        s.style.setProperty('--h', h.toFixed(0) + 'px')
        s.style.setProperty('--dur', dur.toFixed(2) + 's')
        s.style.setProperty('--delay', delay.toFixed(2) + 's')
        s.style.setProperty('--clip', clip)
        s.style.setProperty('--c1', c1)
        s.style.setProperty('--c2', c2)
        s.classList.add('go')
        shardLayer.appendChild(s)
      }
    }

    // Activate hotspot after animation completes
    const activateDelay = reduceMotion ? 0 : 2900
    const timer = setTimeout(() => {
      if (hotspotWrapRef.current) hotspotWrapRef.current.classList.add('active')
    }, activateDelay)

    return () => {
      clearTimeout(timer)
      document.getElementById('yamato-intro-styles')?.remove()
    }
  }, [])

  const goToSite = () => {
    if (leavingRef.current) return
    leavingRef.current = true
    if (hotspotWrapRef.current) hotspotWrapRef.current.classList.remove('active')
    if (tapLabelRef.current) tapLabelRef.current.classList.add('hide')
    document.getElementById('anyWord')?.classList.add('hide')
    if (blackoutRef.current) blackoutRef.current.classList.add('go')
    setTimeout(() => onEnter(), 1150)
  }

  return (
    <div id="yamato-intro">
      <div id="stage">
        <div id="finalWrap">
          <img id="finalImg" src={BG_IMAGE} alt="YAMATO" />
        </div>

        <div id="shardLayer" ref={shardLayerRef} />

        {/* ANY sits outside #pressLabel so the cracks (z 7) can run over it (z 6) */}
        <span id="anyWord">Any</span>

        <svg id="cracks" viewBox="0 0 1435 805" preserveAspectRatio="xMidYMid slice">
          {/* krak 1 */}
          <g className="g1">
            <path className="glow" d="M717,360 L640,210 L590,90" />
            <path d="M717,360 L640,210 L590,90" />
            <path className="glow" d="M717,360 L820,150 L880,40" />
            <path d="M717,360 L820,150 L880,40" />
          </g>
          {/* krak 2 */}
          <g className="g2">
            <path className="glow" d="M717,360 L520,300 L380,250 L260,260" />
            <path d="M717,360 L520,300 L380,250 L260,260" />
            <path className="glow" d="M717,360 L900,330 L1080,300 L1220,330" />
            <path d="M717,360 L900,330 L1080,300 L1220,330" />
            <path className="glow" d="M640,210 L560,130" />
            <path d="M640,210 L560,130" />
            <path className="glow" d="M820,150 L920,200" />
            <path d="M820,150 L920,200" />
          </g>
          {/* krak 3 */}
          <g className="g3">
            <path className="glow" d="M717,360 L640,520 L560,650 L500,760" />
            <path d="M717,360 L640,520 L560,650 L500,760" />
            <path className="glow" d="M717,360 L820,540 L900,680 L960,780" />
            <path d="M717,360 L820,540 L900,680 L960,780" />
            <path className="glow" d="M717,360 L460,430 L300,470" />
            <path d="M717,360 L460,430 L300,470" />
            <path className="glow" d="M717,360 L980,420 L1150,480" />
            <path d="M717,360 L980,420 L1150,480" />
            <path className="glow" d="M520,300 L420,180" />
            <path d="M520,300 L420,180" />
            <path className="glow" d="M900,330 L1000,250" />
            <path d="M900,330 L1000,250" />
            <path className="glow" d="M640,520 L700,640" />
            <path d="M640,520 L700,640" />
            <path className="glow" d="M820,540 L760,660" />
            <path d="M820,540 L760,660" />
          </g>
        </svg>

        <div id="flash" />
        <div id="flatRed" />

        <div id="hotspotWrap" ref={hotspotWrapRef}>
          <div className="glowRing" />
          <div
            id="hotspot"
            role="button"
            tabIndex={0}
            aria-label="Press to enter"
            onClick={goToSite}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                goToSite()
              }
            }}
          />
        </div>

        <div id="pressLabel" ref={tapLabelRef}>
          <span id="pressTop" className="word">Press</span>
          <span id="pressBottom" className="word">Button</span>
        </div>
        <div id="blackout" ref={blackoutRef} />
      </div>
    </div>
  )
}
