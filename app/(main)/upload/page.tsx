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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Info, Loader2, Search } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

export default function UploadPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedAnime, setSelectedAnime] = useState<any>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [episodes, setEpisodes] = useState(1)
  const [status, setStatus] = useState("Airing")
  const [rating, setRating] = useState([7.5])
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear())
  const [genres, setGenres] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [bannerImageUrl, setBannerImageUrl] = useState("")
  const [coverImageUrl, setCoverImageUrl] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchResults([])
    setError("")

    // Simulate API call to search for anime
    setTimeout(() => {
      setIsSearching(false)

      // Mock search results
      if (searchQuery.toLowerCase().includes("demon") || searchQuery.toLowerCase().includes("slayer")) {
        setSearchResults([
          {
            id: "search-1",
            title: "Demon Slayer: Kimetsu no Yaiba",
            description:
              "Tanjiro Kamado, a kind-hearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself.",
            coverImage: "/placeholder.svg?height=200&width=150",
            episodes: 26,
            status: "Airing",
            rating: 8.9,
            genres: ["Action", "Fantasy", "Historical"],
            releaseYear: 2019,
            bannerImage: "/placeholder.svg?height=100&width=200",
          },
        ])
      } else if (searchQuery.toLowerCase().includes("attack") || searchQuery.toLowerCase().includes("titan")) {
        setSearchResults([
          {
            id: "search-2",
            title: "Attack on Titan",
            description:
              "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls.",
            coverImage: "/placeholder.svg?height=200&width=150",
            episodes: 75,
            status: "Completed",
            rating: 9.1,
            genres: ["Action", "Drama", "Fantasy"],
            releaseYear: 2013,
            bannerImage: "/placeholder.svg?height=100&width=200",
          },
        ])
      } else {
        setError("No results found. Try a different search term or manually enter the anime details.")
      }
    }, 1500)
  }

  const selectAnime = (anime: any) => {
    setSelectedAnime(anime)
    setTitle(anime.title)
    setDescription(anime.description)
    setEpisodes(anime.episodes)
    setStatus(anime.status)
    setRating([anime.rating])
    setReleaseYear(anime.releaseYear)
    setGenres(anime.genres)

    // Set image URLs if available
    if (anime.bannerImage) {
      setBannerImageUrl(anime.bannerImage)
    }
    if (anime.coverImage) {
      setCoverImageUrl(anime.coverImage)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validate form
    if (!title || !description) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Create anime object with all form data
    const animeData = {
      title,
      description,
      episodes,
      status,
      rating: rating[0],
      releaseYear,
      genres,
      videoUrl,
      bannerImageUrl,
      coverImageUrl,
      // Additional fields would be added here in a real implementation
    }

    console.log("Submitting anime data:", animeData)

    // Simulate API call to upload anime
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/profile?tab=uploads")
    }, 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload Anime</CardTitle>
          <CardDescription>Search for an anime to auto-fill details or manually enter information</CardDescription>
        </CardHeader>

        <Tabs defaultValue="search">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="search">Search & Auto-fill</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="search" className="px-6 pb-6">
            <div className="flex gap-2 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search for anime title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-4 mb-6">
                <h3 className="font-medium">Search Results:</h3>
                {searchResults.map((anime) => (
                  <div
                    key={anime.id}
                    className="flex gap-4 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50"
                    onClick={() => selectAnime(anime)}
                  >
                    <div className="relative h-24 w-16 flex-shrink-0">
                      <Image
                        src={anime.coverImage || "/placeholder.svg"}
                        alt={anime.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{anime.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{anime.description}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded">{anime.releaseYear}</span>
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded">{anime.episodes} eps</span>
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded">{anime.rating.toFixed(1)}★</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedAnime && (
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Details auto-filled from "{selectedAnime.title}". You can edit them in the form below.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">
                    Anime Title <span className="text-destructive">*</span>
                  </Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="episodes">Number of Episodes</Label>
                    <Input
                      id="episodes"
                      type="number"
                      min={1}
                      value={episodes}
                      onChange={(e) => setEpisodes(Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Airing">Airing</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <Label htmlFor="rating">Rating (1-10)</Label>
                      <span className="text-sm text-muted-foreground">{rating[0].toFixed(1)}</span>
                    </div>
                    <Slider id="rating" min={1} max={10} step={0.1} value={rating} onValueChange={setRating} />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="releaseYear">Release Year</Label>
                    <Input
                      id="releaseYear"
                      type="number"
                      min={1900}
                      max={new Date().getFullYear() + 1}
                      value={releaseYear}
                      onChange={(e) => setReleaseYear(Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="genres">Genres</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      "Action",
                      "Adventure",
                      "Comedy",
                      "Drama",
                      "Fantasy",
                      "Horror",
                      "Mystery",
                      "Romance",
                      "Sci-Fi",
                      "Slice of Life",
                      "Supernatural",
                      "Thriller",
                    ].map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Switch
                          id={`genre-${genre}`}
                          checked={genres.includes(genre)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setGenres([...genres, genre])
                            } else {
                              setGenres(genres.filter((g) => g !== genre))
                            }
                          }}
                        />
                        <Label htmlFor={`genre-${genre}`}>{genre}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="videoUrl">Video URL (YouTube, CatBox, PeerTube)</Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Banner Image</Label>
                  <div className="grid gap-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Input id="bannerImage" type="file" className="hidden" />
                      <Label htmlFor="bannerImage" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <Image
                            src={bannerImageUrl || "/placeholder.svg?height=100&width=200"}
                            alt="Banner placeholder"
                            width={200}
                            height={100}
                            className="rounded-md"
                          />
                          <span className="text-sm text-muted-foreground">
                            Click to upload banner image (16:9 ratio recommended)
                          </span>
                        </div>
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bannerImageUrl">Or enter banner image URL</Label>
                      <Input
                        id="bannerImageUrl"
                        type="url"
                        placeholder="https://example.com/banner.jpg"
                        value={bannerImageUrl}
                        onChange={(e) => setBannerImageUrl(e.target.value)}
                      />
                      {bannerImageUrl && (
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBannerImageUrl("")}
                            className="text-xs text-muted-foreground"
                          >
                            Clear URL
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label>Cover Image (Logo)</Label>
                  <div className="grid gap-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Input id="coverImage" type="file" className="hidden" />
                      <Label htmlFor="coverImage" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <Image
                            src={coverImageUrl || "/placeholder.svg?height=150&width=100"}
                            alt="Cover placeholder"
                            width={100}
                            height={150}
                            className="rounded-md"
                          />
                          <span className="text-sm text-muted-foreground">
                            Click to upload cover image/logo (2:3 ratio recommended)
                          </span>
                        </div>
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coverImageUrl">Or enter cover image/logo URL</Label>
                      <Input
                        id="coverImageUrl"
                        type="url"
                        placeholder="https://example.com/cover.jpg"
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                      />
                      {coverImageUrl && (
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCoverImageUrl("")}
                            className="text-xs text-muted-foreground"
                          >
                            Clear URL
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 mt-6">
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Preview</h3>

                    <div className="bg-card rounded-lg overflow-hidden">
                      {/* Banner Preview */}
                      <div className="relative h-[150px] w-full">
                        {bannerImageUrl ? (
                          <Image
                            src={bannerImageUrl || "/placeholder.svg"}
                            alt="Banner Preview"
                            fill
                            className="object-cover"
                            onError={() => {
                              setError("Banner image URL is invalid or inaccessible")
                              setBannerImageUrl("")
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/50">
                            <p className="text-muted-foreground text-sm">Banner preview will appear here</p>
                          </div>
                        )}
                      </div>

                      {/* Content Preview */}
                      <div className="p-4 flex gap-4">
                        {/* Cover/Logo Preview */}
                        <div className="relative w-[80px] h-[120px] flex-shrink-0">
                          {coverImageUrl ? (
                            <Image
                              src={coverImageUrl || "/placeholder.svg"}
                              alt="Cover Preview"
                              fill
                              className="object-cover rounded-md"
                              onError={() => {
                                setError("Cover image URL is invalid or inaccessible")
                                setCoverImageUrl("")
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-md">
                              <p className="text-muted-foreground text-xs text-center">Cover preview</p>
                            </div>
                          )}
                        </div>

                        {/* Anime Details Preview */}
                        <div>
                          <h4 className="font-semibold">{title || "Anime Title"}</h4>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded">{releaseYear || "Year"}</span>
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded">{episodes || 0} eps</span>
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded">{rating[0].toFixed(1)}★</span>
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded">{status}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {description || "Anime description will appear here"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>

              <CardFooter className="flex justify-between px-0 pt-6">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Anime"
                  )}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
