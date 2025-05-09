"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
// Update the import to use the icons from the new file
import { Loader2 } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"

interface Episode {
  id: string
  anime_id: string
  title: string
  description: string
  episode_number: number
  video_url: string
  thumbnail: string
  created_at: string
  anime: {
    title: string
  }
}

export default function EpisodePage({
  params,
}: {
  params: { id: string; episodeId: string }
}) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [episode, setEpisode] = useState<Episode | null>(null)
  const [loading, setLoading] = useState(true)
  const [episodes, setEpisodes] = useState<Episode[]>([])

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        // Fetch current episode with anime title
        const { data: episodeData, error: episodeError } = await supabase
          .from("anime_episodes")
          .select(`
            *,
            anime:anime_id (
              title
            )
          `)
          .eq("id", params.episodeId)
          .single()

        if (episodeError) throw episodeError

        setEpisode(episodeData)

        // Fetch all episodes from the same anime
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
          description: "Failed to load episode",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEpisode()
  }, [params.id, params.episodeId, supabase, toast])

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

  if (!episode) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Episode not found</h1>
        <Button onClick={() => router.push(`/anime/${params.id}`)} className="mt-4">
          Back to Anime
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push(`/anime/${params.id}`)} className="mb-4">
          Back to {episode.anime.title}
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">{episode.title}</h1>
        <p className="text-muted-foreground mt-2">Episode {episode.episode_number}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {episode.video_url.includes("youtube.com") || episode.video_url.includes("youtu.be") ? (
              <iframe
                src={episode.video_url.replace("watch?v=", "embed/")}
                title={episode.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            ) : (
              <video
                src={episode.video_url}
                poster={episode.thumbnail}
                controls
                className="absolute inset-0 w-full h-full"
              ></video>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Synopsis</h2>
            <p className="text-muted-foreground">{episode.description}</p>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-4">Episodes</CardTitle>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className={`p-2 rounded-md cursor-pointer transition-colors ${
                      ep.id === episode.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => ep.id !== episode.id && handleEpisodeClick(ep.id)}
                  >
                    <div className="font-medium">Episode {ep.episode_number}</div>
                    <div
                      className={`text-sm ${ep.id === episode.id ? "text-primary-foreground" : "text-muted-foreground"}`}
                    >
                      {ep.title}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
