import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import CartDrawer from './components/shop/CartDrawer'
import IntroPage from './pages/IntroPage'
import Home from './pages/Home'
import YAGaming from './pages/YAGaming'
import YASocial from './pages/YASocial'
import HowToPlay from './pages/HowToPlay'
import Stores from './pages/Stores'
import Events from './pages/Events'
import YamatoClub from './pages/YamatoClub'
import Contact from './pages/Contact'
import Prizes from './pages/Prizes'
import ShopPage from './pages/shop/ShopPage'
import ProductPage from './pages/shop/ProductPage'
import CheckoutPage from './pages/shop/CheckoutPage'
import OrderSuccess from './pages/shop/OrderSuccess'
import JoinClub from './pages/JoinClub'
import SignIn from './pages/SignIn'
import MyYamato from './pages/MyYamato'
import PrivacyPolicy from './pages/PrivacyPolicy'

export default function App() {
  const [showIntro, setShowIntro] = useState(true)

  if (showIntro) {
    return <IntroPage onEnter={() => setShowIntro(false)} />
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
                <Route path="ya-social" element={<YASocial />} />
                <Route path="ya-collectibles" element={<Navigate to="/shop" replace />} />
                <Route path="tcg-lounge" element={<Navigate to="/shop" replace />} />
                <Route path="bundles-passes" element={<Navigate to="/how-to-play" replace />} />
                <Route path="how-to-play" element={<HowToPlay />} />
                <Route path="stores" element={<Stores />} />
                <Route path="events" element={<Events />} />
                <Route path="yamato-club" element={<YamatoClub />} />
                <Route path="contact" element={<Contact />} />
                <Route path="prizes" element={<Prizes />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="shop/:id" element={<ProductPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="checkout/success" element={<OrderSuccess />} />
                <Route path="join-club" element={<JoinClub />} />
                <Route path="sign-in" element={<SignIn />} />
                <Route path="my-yamato" element={<MyYamato />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
              </Route>
            </Routes>
            <CartDrawer />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
