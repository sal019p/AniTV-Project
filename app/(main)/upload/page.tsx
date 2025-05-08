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
import { AlertCircle, Info, Loader2, Search, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { addAnime, type Anime } from "@/lib/data"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

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
  const [success, setSuccess] = useState(false)

  const [bannerImageUrl, setBannerImageUrl] = useState("")
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [isValidatingImages, setIsValidatingImages] = useState(false)
  const [imageValidationStatus, setImageValidationStatus] = useState({
    banner: false,
    cover: false,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Reset form when success is true
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const validateImageUrl = async (url: string, type: "banner" | "cover") => {
    if (!url) {
      setImageValidationStatus((prev) => ({
        ...prev,
        [type]: false,
      }))
      return false
    }

    setIsValidatingImages(true)

    return new Promise<boolean>((resolve) => {
      const img = new Image()
      img.onload = () => {
        setImageValidationStatus((prev) => ({
          ...prev,
          [type]: true,
        }))
        setIsValidatingImages(false)
        resolve(true)
      }
      img.onerror = () => {
        setImageValidationStatus((prev) => ({
          ...prev,
          [type]: false,
        }))
        setIsValidatingImages(false)
        setError(`Invalid ${type} image URL. Please provide a valid image URL.`)
        resolve(false)
      }
      img.src = url
    })
  }

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
      validateImageUrl(anime.bannerImage, "banner")
    }
    if (anime.coverImage) {
      setCoverImageUrl(anime.coverImage)
      validateImageUrl(anime.coverImage, "cover")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    // Validate form
    if (!title || !description) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Validate image URLs
    const isBannerValid = await validateImageUrl(bannerImageUrl, "banner")
    const isCoverValid = await validateImageUrl(coverImageUrl, "cover")

    if (!isCoverValid) {
      setError("Cover image is required and must be a valid image URL")
      setIsSubmitting(false)
      return
    }

    try {
      // Create anime object with all form data
      const animeData: Partial<Anime> = {
        title,
        description,
        episodes,
        status: status as any,
        rating: rating[0],
        releaseYear,
        genres,
        videoUrl,
        bannerImage: bannerImageUrl,
        coverImage: coverImageUrl,
        uploadedBy: user?.id,
      }

      console.log("Submitting anime data:", animeData)

      // Add the anime to our data store
      const newAnime = await addAnime(animeData, user?.id || "")

      // Show success message
      setSuccess(true)
      toast({
        title: "Anime uploaded successfully!",
        description: `${title} has been added to your uploads.`,
        action: (
          <ToastAction altText="View" onClick={() => router.push(`/anime/${newAnime.id}`)}>
            View
          </ToastAction>
        ),
      })

      // Reset form
      setTitle("")
      setDescription("")
      setEpisodes(1)
      setStatus("Airing")
      setRating([7.5])
      setReleaseYear(new Date().getFullYear())
      setGenres([])
      setVideoUrl("")
      setBannerImageUrl("")
      setCoverImageUrl("")
      setImageValidationStatus({ banner: false, cover: false })
      setSelectedAnime(null)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/profile?tab=uploads")
      }, 2000)
    } catch (error) {
      console.error("Upload failed:", error)
      setError("Failed to upload anime. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
            {success && (
              <Alert className="mb-6 bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Anime uploaded successfully! Redirecting to your profile...</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
                <Label>
                  Cover Image <span className="text-destructive">*</span>
                </Label>
                <div className="grid gap-4">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Input id="coverImage" type="file" className="hidden" />
                    <Label htmlFor="coverImage" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative w-[100px] h-[150px]">
                          <Image
                            src={coverImageUrl || "/placeholder.svg?height=150&width=100"}
                            alt="Cover placeholder"
                            fill
                            className="rounded-md object-cover"
                          />
                          {imageValidationStatus.cover && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Click to upload cover image/logo (2:3 ratio recommended)
                        </span>
                      </div>
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverImageUrl">
                      Or enter cover image/logo URL <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="coverImageUrl"
                      type="url"
                      placeholder="https://example.com/cover.jpg"
                      value={coverImageUrl}
                      onChange={(e) => {
                        setCoverImageUrl(e.target.value)
                        if (e.target.value) {
                          validateImageUrl(e.target.value, "cover")
                        } else {
                          setImageValidationStatus((prev) => ({ ...prev, cover: false }))
                        }
                      }}
                      required
                    />
                    {coverImageUrl && (
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCoverImageUrl("")
                            setImageValidationStatus((prev) => ({ ...prev, cover: false }))
                          }}
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
                <Label>Banner Image</Label>
                <div className="grid gap-4">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Input id="bannerImage" type="file" className="hidden" />
                    <Label htmlFor="bannerImage" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative w-[200px] h-[100px]">
                          <Image
                            src={bannerImageUrl || "/placeholder.svg?height=100&width=200"}
                            alt="Banner placeholder"
                            fill
                            className="object-cover rounded"
                          />
                          {imageValidationStatus.banner && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          )}
                        </div>
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
                      onChange={(e) => {
                        setBannerImageUrl(e.target.value)
                        if (e.target.value) {
                          validateImageUrl(e.target.value, "banner")
                        } else {
                          setImageValidationStatus((prev) => ({ ...prev, banner: false }))
                        }
                      }}
                    />
                    {bannerImageUrl && (
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setBannerImageUrl("")
                            setImageValidationStatus((prev) => ({ ...prev, banner: false }))
                          }}
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
                            setImageValidationStatus((prev) => ({ ...prev, banner: false }))
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
                              setImageValidationStatus((prev) => ({ ...prev, cover: false }))
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

              <CardFooter className="flex justify-between px-0 pt-6">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isValidatingImages || !coverImageUrl || !imageValidationStatus.cover}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : isValidatingImages ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating Images...
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
