"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, Loader2, UserIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"

export default function EditProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [previewImage, setPreviewImage] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }

    if (user) {
      setName(user.name || "")
      setBio(user.bio || "")
      setImageUrl(user.image || "")
      setPreviewImage(user.image || "")
    }
  }, [user, loading, router])

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
    // Only update preview if the URL is not empty
    if (e.target.value) {
      setPreviewImage(e.target.value)
    } else {
      setPreviewImage("/placeholder.svg?height=100&width=100")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validate form
    if (!name.trim()) {
      setError("Name is required")
      setIsSubmitting(false)
      return
    }

    // In a real app, you would send this data to your backend
    setTimeout(() => {
      // Update the user object in the auth context
      // This is a mock implementation
      if (user) {
        user.name = name
        user.bio = bio
        user.image = imageUrl

        // Save to localStorage for persistence
        localStorage.setItem("anitv-user", JSON.stringify(user))
      }

      setIsSubmitting(false)
      router.push("/profile")
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/profile" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20">
                {previewImage ? (
                  <Image
                    src={previewImage || "/placeholder.svg"}
                    alt="Profile Preview"
                    fill
                    className="object-cover"
                    onError={() => {
                      setError("Image URL is invalid or inaccessible")
                      setPreviewImage("/placeholder.svg?height=100&width=100")
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <UserIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Display Name <span className="text-destructive">*</span>
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Profile Picture URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/profile.jpg"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>

            <CardFooter className="flex justify-between px-0 pt-6">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
