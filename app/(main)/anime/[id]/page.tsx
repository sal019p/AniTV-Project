"use client"

import { useEffect, useState } from "react"
import { getAnimeById, getUserById } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Play, Plus, Star, Share2, Flag, User } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export default function AnimePage({ params }: { params: { id: string } }) {
  const [anime, setAnime] = useState(getAnimeById(params.id))
  const [uploader, setUploader] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("episodes")
  const [isPlaying, setIsPlaying] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)

      // If anime has an uploader, fetch their info
      if (anime?.uploadedBy) {
        const uploaderInfo = getUserById(anime.uploadedBy)
        setUploader(uploaderInfo)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [anime])

  if (!anime) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Anime Not Found</h2>
          <p className="text-muted-foreground mb-6">The anime you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/browse">Browse Anime</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handlePlayVideo = () => {
    setIsPlaying(true)
    setActiveTab("watch")
  }

  const handleAddToFavorites = () => {
    if (!user) {
      router.push("/login")
      return
    }

    toast({
      title: "Added to Favorites",
      description: `${anime.title} has been added to your favorites.`,
    })
  }

  const handleAddToWatchlist = () => {
    if (!user) {
      router.push("/login")
      return
    }

    toast({
      title: "Added to Watchlist",
      description: `${anime.title} has been added to your watchlist.`,
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: anime.title,
          text: `Check out ${anime.title} on AniTV!`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
        })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Anime link copied to clipboard!",
      })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Banner Image */}
      <div className="relative h-[50vh] w-full">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <>
            <Image
              src={anime.bannerImage || anime.coverImage}
              alt={anime.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </>
        )}
      </div>

      {/* Anime Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover Image */}
          <div className="flex-shrink-0">
            {isLoading ? (
              <Skeleton className="w-48 h-72 rounded-lg" />
            ) : (
              <div className="relative w-48 h-72 rounded-lg overflow-hidden shadow-lg">
                <Image src={anime.coverImage || "/placeholder.svg"} alt={anime.title} fill className="object-cover" />
                {anime.uploadedBy && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                      Community
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1">
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-4" />
                <Skeleton className="h-10 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-glow">{anime.title}</h1>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className="bg-primary">{anime.releaseYear}</Badge>
                  <Badge variant="outline">{anime.episodes} Episodes</Badge>
                  <Badge
                    className={
                      anime.status === "Airing"
                        ? "bg-green-500"
                        : anime.status === "Completed"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                    }
                  >
                    {anime.status}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{anime.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {anime.genres.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>

                <p className="text-muted-foreground mb-6">{anime.description}</p>

                <div className="flex flex-wrap gap-4">
                  <Button size="lg" onClick={handlePlayVideo} className="group">
                    <Play className="mr-2 h-5 w-5 group-hover:animate-pulse" /> Watch Now
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleAddToFavorites}>
                    <Heart className="mr-2 h-5 w-5" /> Add to Favorites
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleAddToWatchlist}>
                    <Plus className="mr-2 h-5 w-5" /> Add to Watchlist
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {uploader && (
                  <div className="mt-6 flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Uploaded by:</p>
                    <Link href={`/profile/${uploader.id}`} className="flex items-center gap-2 hover:text-primary">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden">
                        {uploader.image ? (
                          <Image
                            src={uploader.image || "/placeholder.svg"}
                            alt={uploader.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium">{uploader.name}</span>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 mb-8">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="watch">Watch</TabsTrigger>
              <TabsTrigger value="episodes">Episodes</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="watch" className="pt-2">
              {isPlaying ? (
                <div className="aspect-video w-full bg-card rounded-lg overflow-hidden">
                  {anime.videoUrl ? (
                    <iframe
                      src={anime.videoUrl.replace("watch?v=", "embed/")}
                      title={`${anime.title} trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-card">
                      <p className="text-muted-foreground">No video available</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video w-full bg-card rounded-lg flex items-center justify-center">
                  <Button size="lg" onClick={handlePlayVideo} className="pulse-animation">
                    <Play className="mr-2 h-5 w-5" /> Play Video
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="episodes" className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: Math.min(anime.episodes, 12) }, (_, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="h-auto py-4 justify-start hover:bg-primary/5 hover:border-primary/30"
                    onClick={() => {
                      if (!user) {
                        router.push("/login")
                      } else {
                        setIsPlaying(true)
                        setActiveTab("watch")
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 text-primary rounded-md w-10 h-10 flex items-center justify-center">
                        {i + 1}
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Episode {i + 1}</p>
                        <p className="text-xs text-muted-foreground">24 min</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              {anime.episodes > 12 && (
                <div className="mt-4 text-center">
                  <Button variant="ghost">Load More Episodes</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="pt-2">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
                  <p className="text-muted-foreground">{anime.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Information</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span>TV</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Episodes:</span>
                        <span>{anime.episodes}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span>{anime.status}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Aired:</span>
                        <span>{anime.releaseYear}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Rating:</span>
                        <span className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {anime.rating.toFixed(1)}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.map((genre) => (
                        <Badge key={genre} variant="secondary">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {anime.uploadedBy && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Community Upload</h3>
                    <p className="text-muted-foreground mb-2">
                      This anime was uploaded by a community member. If you find any issues, please report them.
                    </p>
                    {uploader && (
                      <div className="flex items-center gap-2 mb-4">
                        <Link href={`/profile/${uploader.id}`} className="flex items-center gap-2 hover:text-primary">
                          <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            {uploader.image ? (
                              <Image
                                src={uploader.image || "/placeholder.svg"}
                                alt={uploader.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium">{uploader.name}</span>
                        </Link>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Issue Reported",
                          description: "Thank you for reporting this issue. Our team will review it shortly.",
                        })
                      }}
                    >
                      <Flag className="h-4 w-4 mr-2" /> Report Issue
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
