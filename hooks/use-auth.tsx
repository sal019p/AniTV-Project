"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { isSupabaseConfigured } from "@/lib/supabase"

type User = {
  id: string
  email?: string
  username?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(false)

  useEffect(() => {
    // Check if Supabase is configured
    const configured = isSupabaseConfigured()
    setIsSupabaseAvailable(configured)

    async function loadUser() {
      setLoading(true)
      try {
        if (!configured) {
          // If Supabase is not configured, use a mock user for demo purposes
          setUser(null)
          setLoading(false)
          return
        }

        // Only import and use Supabase if it's configured
        const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs")
        const supabase = createClientComponentClient()

        // Get the current session
        const { data } = await supabase.auth.getSession()

        if (data.session?.user) {
          // Get user profile
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.session.user.id).single()

          setUser({
            id: data.session.user.id,
            email: data.session.user.email,
            username: profile?.username || data.session.user.email?.split("@")[0],
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error loading user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    // Set up auth state change listener if Supabase is configured
    if (configured) {
      const setupAuthListener = async () => {
        const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs")
        const supabase = createClientComponentClient()

        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            // Get user profile
            const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

            setUser({
              id: session.user.id,
              email: session.user.email,
              username: profile?.username || session.user.email?.split("@")[0],
            })
          } else {
            setUser(null)
          }
          setLoading(false)
        })

        return data.subscription
      }

      const subscription = setupAuthListener()
      return () => {
        // Clean up the subscription when the component unmounts
        subscription.then((sub) => sub.unsubscribe())
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseAvailable) {
      // Mock sign in for demo purposes
      console.log("Mock sign in:", email)
      return { success: false, error: "Supabase is not configured" }
    }

    try {
      const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs")
      const supabase = createClientComponentClient()

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      console.error("Error signing in:", error)
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email: string, password: string, username: string) => {
    if (!isSupabaseAvailable) {
      // Mock sign up for demo purposes
      console.log("Mock sign up:", email, username)
      return { success: false, error: "Supabase is not configured" }
    }

    try {
      const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs")
      const supabase = createClientComponentClient()

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Create a profile for the user
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          username,
          email,
          created_at: new Date().toISOString(),
        })

        if (profileError) throw profileError
      }

      return { success: true }
    } catch (error: any) {
      console.error("Error signing up:", error)
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    if (!isSupabaseAvailable) {
      // Mock sign out for demo purposes
      console.log("Mock sign out")
      return
    }

    try {
      const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs")
      const supabase = createClientComponentClient()

      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
