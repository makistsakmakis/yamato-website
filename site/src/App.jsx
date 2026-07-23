import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import IntroPage from './pages/IntroPage'
import Home from './pages/Home'
import YAGaming from './pages/YAGaming'
import HowToPlay from './pages/HowToPlay'
import Stores from './pages/Stores'
import YamatoClub from './pages/YamatoClub'
import Contact from './pages/Contact'
import Prizes from './pages/Prizes'
// Hidden for later (do not delete): YASocial, Events, ShopPage, ProductPage, CheckoutPage, OrderSuccess, CartDrawer
import JoinClub from './pages/JoinClub'
import SignIn from './pages/SignIn'
import MyYamato from './pages/MyYamato'
import PrivacyPolicy from './pages/PrivacyPolicy'

export default function App() {
  // Intro video plays once per visit (not again on refresh/navigation in the same session)
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !sessionStorage.getItem('yamato-intro-seen')
    } catch {
      return true
    }
  })

  const handleIntroEnter = () => {
    try {
      sessionStorage.setItem('yamato-intro-seen', '1')
    } catch {
      // sessionStorage unavailable (private mode edge cases) — just continue
    }
    setShowIntro(false)
  }

  if (showIntro) {
    return <IntroPage onEnter={handleIntroEnter} />
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="the-experience" element={<Navigate to="/" replace />} />
                <Route path="ya-gaming" element={<YAGaming />} />
                {/* Hidden for later: YA Social, YA Events, E-Shop (pages kept, routes redirect home) */}
                <Route path="ya-social" element={<Navigate to="/" replace />} />
                <Route path="events" element={<Navigate to="/" replace />} />
                <Route path="shop" element={<Navigate to="/" replace />} />
                <Route path="shop/:id" element={<Navigate to="/" replace />} />
                <Route path="checkout" element={<Navigate to="/" replace />} />
                <Route path="checkout/success" element={<Navigate to="/" replace />} />
                <Route path="ya-collectibles" element={<Navigate to="/" replace />} />
                <Route path="tcg-lounge" element={<Navigate to="/" replace />} />
                <Route path="bundles-passes" element={<Navigate to="/how-to-play" replace />} />
                <Route path="how-to-play" element={<HowToPlay />} />
                <Route path="stores" element={<Stores />} />
                <Route path="yamato-club" element={<YamatoClub />} />
                <Route path="contact" element={<Contact />} />
                <Route path="prizes" element={<Prizes />} />
                <Route path="join-club" element={<JoinClub />} />
                <Route path="sign-in" element={<SignIn />} />
                <Route path="my-yamato" element={<MyYamato />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
              </Route>
            </Routes>
            {/* CartDrawer hidden for later (e-shop disabled) */}
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
