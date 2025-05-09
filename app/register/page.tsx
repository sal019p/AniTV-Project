"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import NextLink from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { isSupabaseConfigured } from "@/lib/supabase"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(true)

  // Check if Supabase is configured
  useEffect(() => {
    setIsConfigured(isSupabaseConfigured())
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConfigured) {
      setError("Supabase is not configured. Please set up your environment variables.")
      return
    }

    if (!email || !username || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Only import and create the client if Supabase is configured
      const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs")
      const supabase = createClientComponentClient()

      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // Create a profile for the user
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          username,
          email,
          created_at: new Date().toISOString(),
        })

        if (profileError) throw profileError

        toast({
          title: "Registration successful",
          description: "Your account has been created successfully",
        })

        router.push("/login")
      }
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        title: "Registration failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // For demo mode, allow registration with any credentials
  const handleDemoRegister = () => {
    if (isConfigured) return

    toast({
      title: "Demo mode active",
      description: "Registration is not available in demo mode. Please use the demo login.",
    })

    setTimeout(() => {
      router.push("/login")
    }, 1500)
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account to access AniTV</CardDescription>
        </CardHeader>
        <CardContent>
          {!isConfigured && (
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Supabase is not configured. Please set up your environment variables. You can use demo mode instead.
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {isConfigured ? (
            <Button type="submit" onClick={handleRegister} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          ) : (
            <Button type="button" onClick={handleDemoRegister} className="w-full">
              Continue to Demo Mode
            </Button>
          )}

          <div className="text-center text-sm">
            Already have an account?{" "}
            <NextLink href="/login" className="text-primary hover:underline">
              Login
            </NextLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
