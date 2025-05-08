"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { mockUsers } from "@/lib/data"

// Define user type
type User = {
  id: string
  name: string
  email: string
  image?: string
  bio?: string
  favorites: string[] // Array of anime IDs
  uploads: string[] // Array of anime IDs
}

// Define auth context type
type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
  updateUser: (userData: Partial<User>) => void
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("anitv-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would validate credentials with your backend
      if (email && password) {
        // Find the user in our mock data
        const foundUser = mockUsers.find((u) => u.email === email) || mockUsers[0]
        setUser(foundUser)
        localStorage.setItem("anitv-user", JSON.stringify(foundUser))
        router.push("/")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would register the user with your backend
      if (name && email && password) {
        const newUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          image: "/placeholder.svg?height=100&width=100",
          bio: "",
          favorites: [],
          uploads: [],
        }
        setUser(newUser)
        localStorage.setItem("anitv-user", JSON.stringify(newUser))
        router.push("/")
      } else {
        throw new Error("Invalid registration data")
      }
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("anitv-user", JSON.stringify(updatedUser))
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("anitv-user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
