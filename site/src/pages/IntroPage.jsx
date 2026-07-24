import { useEffect, useRef, useState } from 'react'

// Desktop (16:9) and mobile (9:16 portrait) versions of the intro
const VIDEO_DESKTOP = '/videos/intro%20video%20website_V5_compressed.mp4'
const VIDEO_MOBILE = '/videos/intro%20video%20website_V5_MOB.mp4'

// Portrait screens (phones) get the vertical version; landscape (PC/tablet) the wide one
const pickVideoSrc = () =>
  window.matchMedia('(orientation: portrait)').matches ? VIDEO_MOBILE : VIDEO_DESKTOP

const INTRO_CSS = `
  #yamato-intro {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #000;
    overflow: hidden;
  }
  #yamato-intro video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    height: 100dvh;
    object-fit: cover;
    display: block;
    background: #000;
  }
  #yamato-intro.yi-fade {
    transition: opacity 0.5s ease-out;
    opacity: 0;
  }
`

export default function IntroPage({ onEnter }) {
  const videoRef = useRef(null)
  const wrapRef = useRef(null)
  const doneRef = useRef(false)
  const [failed, setFailed] = useState(false)
  const [videoSrc] = useState(pickVideoSrc)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    if (wrapRef.current) wrapRef.current.classList.add('yi-fade')
    setTimeout(() => onEnter(), 500)
  }

  useEffect(() => {
    const styleEl = document.createElement('style')
    styleEl.id = 'yamato-intro-styles'
    styleEl.textContent = INTRO_CSS
    document.head.appendChild(styleEl)

    // Users who prefer reduced motion skip the intro entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onEnter()
      return () => styleEl.remove()
    }

    const video = videoRef.current
    if (video) {
      // Muted + playsInline is required for mobile autoplay (iOS/Android)
      video.muted = true
      const p = video.play()
      if (p && typeof p.catch === 'function') {
        // If autoplay is still blocked, don't trap the visitor on a black screen
        p.catch(() => setFailed(true))
      }
    }

    // Safety net: never keep the visitor longer than video duration + margin
    const safety = setTimeout(finish, 14000)

    return () => {
      clearTimeout(safety)
      document.getElementById('yamato-intro-styles')?.remove()
    }
  }, [])

  // Autoplay blocked or video failed to load -> go straight to the site
  useEffect(() => {
    if (failed) finish()
  }, [failed])

  return (
    <div id="yamato-intro" ref={wrapRef}>
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
