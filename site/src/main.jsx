import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global scroll-triggered fade-in via IntersectionObserver
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
        entry.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease'
        io.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
)

const mutObs = new MutationObserver(() => {
  document.querySelectorAll('.fade-in:not([data-observed])').forEach(el => {
    el.dataset.observed = '1'
    el.style.opacity = '0'
    el.style.transform = 'translateY(24px)'
    io.observe(el)
  })
})

document.addEventListener('DOMContentLoaded', () => {
  mutObs.observe(document.body, { childList: true, subtree: true })
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
