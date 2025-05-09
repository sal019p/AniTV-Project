"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// Update the import to use the icons from the new file
import { Loader2 } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"

interface Anime {
  id: string
  title: string
  description: string
  cover_image: string
  banner_image: string
  episodes_count: number
  status: string
  rating: number
  genres: string[]
  release_year: number
  is_featured: boolean
  created_at: string
}

interface Episode {
  id: string
  anime_id: string
  title: string
  description: string
  episode_number: number
  video_url: string
  thumbnail: string
  created_at: string
}

export default function AnimePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [anime, setAnime] = useState<Anime | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        // Fetch anime details
        const { data: animeData, error: animeError } = await supabase
          .from("anime")
          .select("*")
          .eq("id", params.id)
          .single()

        if (animeError) throw animeError

        setAnime(animeData)

        // Fetch episodes
        const { data: episodesData, error: episodesError } = await supabase
          .from("anime_episodes")
          .select("*")
          .eq("anime_id", params.id)
          .order("episode_number", { ascending: true })

        if (episodesError) throw episodesError

        setEpisodes(episodesData || [])
      } catch (err) {
        console.error(err)
        toast({
          title: "Error",
          description: "Failed to load anime details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnime()
  }, [params.id, supabase, toast])

  const handleEpisodeClick = (episodeId: string) => {
    router.push(`/anime/${params.id}/episode/${episodeId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!anime) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Anime not found</h1>
        <Button onClick={() => router.push("/")} className="mt-4">
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-6">
        <Image src={anime.banner_image || anime.cover_image} alt={anime.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{anime.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {anime.genres.map((genre) => (
              <span key={genre} className="px-2 py-1 bg-primary/20 text-primary rounded-md text-sm">
                {genre}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-white">
            <span>{anime.release_year}</span>
            <span>•</span>
            <span>{anime.status}</span>
            <span>•</span>
            <span>{anime.episodes_count} episodes</span>
            {anime.rating > 0 && (
              <>
                <span>•</span>
                <span>Rating: {anime.rating.toFixed(1)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
          <p className="text-muted-foreground">{anime.description}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Episodes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {episodes.length > 0 ? (
              episodes.map((episode) => (
                <Card
                  key={episode.id}
                  className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleEpisodeClick(episode.id)}
                >
                  <div className="relative h-[120px]">
                    <Image
                      src={episode.thumbnail || "/placeholder.svg"}
                      alt={episode.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-2">
                      <span className="text-sm font-medium">Episode {episode.episode_number}</span>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium line-clamp-1">{episode.title}</h3>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No episodes available yet.</p>
            )}
          </div>
        </div>

        <div>
          <div className="sticky top-20">
            <h2 className="text-2xl font-bold mb-4">Information</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span>{anime.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Episodes:</span>
                <span>{anime.episodes_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Year:</span>
                <span>{anime.release_year}</span>
              </div>
              {anime.rating > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating:</span>
                  <span>{anime.rating.toFixed(1)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span>{anime.is_featured ? "Featured" : "Normal"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
