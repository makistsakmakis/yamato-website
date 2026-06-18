import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile, getClubMembership } from '../lib/supabase'

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  clubMembership: null,
  loading: true,
  authLoading: false,
  signInWithEmail: async () => {},
  verifyOtp: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [session, setSession]         = useState(null)
  const [profile, setProfile]         = useState(null)
  const [clubMembership, setClub]     = useState(null)
  const [loading, setLoading]         = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  const loadUserData = useCallback(async (uid) => {
    if (!uid) { setProfile(null); setClub(null); return }
    try {
      const [p, c] = await Promise.all([getProfile(uid), getClubMembership(uid)])
      setProfile(p)
      setClub(c)
    } catch {
      // non-fatal: tables may not exist yet in development
    }
  }, [])

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // "Remember me" enforcement: if user did NOT check remember me,
      // sign them out when the browser is reopened (sessionStorage clears on close)
      if (session) {
        const rememberMe = localStorage.getItem('yamato_remember_me')
        const sessionActive = sessionStorage.getItem('yamato_session_active')
        if (rememberMe === '0' && !sessionActive) {
          // Browser was closed — session should not persist
          supabase.auth.signOut()
          setLoading(false)
          return
        }
        sessionStorage.setItem('yamato_session_active', '1')
      }
      setSession(session)
      setUser(session?.user ?? null)
      loadUserData(session?.user?.id).finally(() => setLoading(false))
    })

    // Listen for auth changes (includes magic link redirects)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) sessionStorage.setItem('yamato_session_active', '1')
      setSession(session)
      setUser(session?.user ?? null)
      loadUserData(session?.user?.id)
    })

    return () => subscription.unsubscribe()
  }, [loadUserData])

  const signInWithEmailFn = useCallback(async (email, redirectTo) => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    setAuthLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectTo || `${window.location.origin}/join-club`,
        },
      })
      return { error }
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const verifyOtpFn = useCallback(async (email, token) => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    setAuthLoading(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
      return { data, error }
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const signOutFn = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setProfile(null)
    setClub(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) await loadUserData(user.id)
  }, [user, loadUserData])

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      clubMembership,
      loading,
      authLoading,
      signInWithEmail: signInWithEmailFn,
      verifyOtp: verifyOtpFn,
      signOut: signOutFn,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
