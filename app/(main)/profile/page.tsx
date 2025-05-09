"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { getUserFavorites, getUserUploads, type Anime } from "@/lib/data"
import { AnimeCard } from "@/components/anime-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Upload } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Anime[]>([])
  const [uploads, setUploads] = useState<Anime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("favorites")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }

    if (user) {
      // Get tab from URL if present
      const urlParams = new URLSearchParams(window.location.search)
      const tabParam = urlParams.get("tab")
      if (tabParam && (tabParam === "favorites" || tabParam === "uploads")) {
        setActiveTab(tabParam)
      }

      // Simulate API calls
      const timer = setTimeout(() => {
        setFavorites(getUserFavorites(user.id))
        setUploads(getUserUploads(user.id))
        setIsLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [user, loading, router])

  if (loading || isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <Avatar className="h-32 w-32">
          <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <p className="text-muted-foreground mb-4">{user.email}</p>

          {user.bio && <p className="text-sm text-muted-foreground mb-6 max-w-2xl">{user.bio}</p>}

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile/edit">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/upload">
                <Upload className="mr-2 h-4 w-4" /> Upload Anime
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs for Favorites and Uploads */}
      <Tabs
        defaultValue={activeTab}
        onValueChange={(value) => {
          setActiveTab(value)
          router.push(`/profile?tab=${value}`, { scroll: false })
        }}
      >
        <TabsList className="mb-8">
          <TabsTrigger value="favorites">My Favorites</TabsTrigger>
          <TabsTrigger value="uploads">My Uploads</TabsTrigger>
        </TabsList>

        <TabsContent value="favorites">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {favorites.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't added any favorites yet.</p>
              <Button asChild>
                <Link href="/">Browse Anime</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="uploads">
          {uploads.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {uploads.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't uploaded any anime yet.</p>
              <Button asChild>
                <Link href="/upload">Upload Anime</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
