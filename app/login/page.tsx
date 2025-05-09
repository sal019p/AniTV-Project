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
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(true)

  // Check if Supabase is configured
  useEffect(() => {
    setIsConfigured(isSupabaseConfigured())
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConfigured) {
      setError("Supabase is not configured. Please set up your environment variables.")
      return
    }

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { success, error } = await signIn(email, password)

      if (!success) {
        throw new Error(error || "Failed to sign in")
      }

      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
      })

      router.push("/")
      router.refresh()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        title: "Login failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // For demo mode, allow login with any credentials
  const handleDemoLogin = () => {
    if (isConfigured) return

    toast({
      title: "Demo mode active",
      description: "Logging in with demo account",
    })

    setTimeout(() => {
      router.push("/")
    }, 1000)
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
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
          <form onSubmit={handleLogin} className="space-y-4">
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
            <Button type="submit" onClick={handleLogin} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          ) : (
            <Button type="button" onClick={handleDemoLogin} className="w-full">
              Continue in Demo Mode
            </Button>
          )}

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <NextLink href="/register" className="text-primary hover:underline">
              Register
            </NextLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
