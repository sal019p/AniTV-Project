"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Upload, Link as LinkIcon  CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Upload, LinkIcon, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { getAnimeById, uploadVideo, addEpisode, supabase } from "@/lib/supabase"

export default function AddEpisodePage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const animeId = params.id

  const [anime, setAnime] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [episodeNumber, setEpisodeNumber] = useState(1)
  const [videoUrl, setVideoUrl] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"file" | "link">("link")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    async function fetchAnime() {
      try {
        const animeData = await getAnimeById(animeId)
        
        if (!animeData) {
          setError("Anime not found")
          return
        }
        
        // Check if user is the uploader
        if (animeData.uploaded_by !== user?.id) {
          setError("You don't have permission to add episodes to this anime")
          return
        }
        
        setAnime(animeData)
        
        // Get the next episode number
        const { data: episodes } = await supabase
          .from('anime_episodes')
          .select('episode_number')
          .eq('anime_id', animeId)
          .order('episode_number', { ascending: false })
          .limit(1)
        
        if (episodes && episodes.length > 0) {
          setEpisodeNumber(episodes[0].episode_number + 1)
        }
      } catch (error) {
        console.error("Error fetching anime:", error)
        setError("Failed to load anime details")
      }
    }

    if (user) {
      fetchAnime()
    }
  }, [animeId, user, loading, router])

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check if file is a video
      if (!file.type.startsWith('video/')) {
        setError("Please upload a valid video file")
        return
      }
      
      // Check file size (limit to 500MB)
      if (file.size > 500 * 1024 * 1024) {
        setError("Video file is too large. Maximum size is 500MB")
        return
      }
      
      setVideoFile(file)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)
    setUploadProgress(0)

    // Validate form
    if (!title) {
      setError("Please provide an episode title")
      setIsSubmitting(false)
      return
    }

    // Validate video
    if (uploadMethod === "file" && !videoFile) {
      setError("Please upload a video file")
      setIsSubmitting(false)
      return
    }

    if (uploadMethod === "link" && !videoUrl) {
      setError("Please provide a video URL")
      setIsSubmitting(false)
      return
    }

    try {
      let finalVideoUrl = videoUrl

      // If uploading a file, upload it to Supabase storage
      if (uploadMethod === "file" && videoFile) {
        const fileName = `${Date.now()}-${videoFile.name.replace(/\s+/g, '-')}`;
        const filePath = `${user?.id}/${animeId}/${fileName}`;
        
        const { success, publicUrl, error } = await uploadVideo(
          videoFile, 
          filePath,
          (progress) => {
            setUploadProgress(progress)
          }
        )

        if (!success) {
          throw new Error(error?.message || "Failed to upload video")
        }

        finalVideoUrl = publicUrl
      }

      // Create episode data
      const episodeData = {
        anime_id: animeId,
        title,
        description: description || null,
        episode_number: episodeNumber,
        video_url: finalVideoUrl,
        thumbnail: thumbnailUrl || null,
        created_at: new Date().toISOString(),
      }

      // Add the episode
      const { success: episodeSuccess, error: episodeError } = await addEpisode(animeId, episodeData)

      if (!episodeSuccess) {
        throw new Error(episodeError?.message || "Failed to add episode")
      }

      // Update the episode count in the anime table
      await supabase
        .from('anime')
        .update({ episodes_count: anime.episodes_count + 1 })
        .eq('id', animeId)

      // Show success message
      setSuccess(true)
      toast({
        title: "Episode added successfully!",
        description: `${title} has been added to ${anime.title}.`,
      })

      // Reset form
      setTitle("")
      setDescription("")
      setVideoUrl("")
      setVideoFile(null)
      setThumbnailUrl("")
      setUploadProgress(0)

      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/anime/${animeId}`)
      }, 2000)
    } catch (error: any) {
      console.error("Upload failed:", error)
      setError(error.message || "Failed to add episode. Please try again.")
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

  if (!anime) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Anime Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || "The anime you're looking for doesn't exist or has been removed."}</p>
          <Button asChild>
            <Link href="/browse">Browse Anime</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add Episode to {anime.title}</CardTitle>
          <CardDescription>Upload a new episode or provide a link to an existing video</CardDescription>
        </CardHeader>

        <CardContent>
          {success && (
            <Alert className="mb-6 bg-green-500/10 text-green-500 border-green-500/20">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Episode added successfully! Redirecting to anime page...</AlertDescription>
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
                Episode Title <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder={`Episode ${episodeNumber}`}
                required 
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Episode Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this episode"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="episodeNumber">Episode Number</Label>
              <Input
                id="episodeNumber"
                type="number"
                min={1}
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(Number.parseInt(e.target.value))}
              />
            </div>

            <div className="grid gap-3">
              <Label>Video Upload Method</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="upload-link"
                    checked={uploadMethod === "link"}
                    onCheckedChange={() => setUploadMethod("link")}
                  />
                  <Label htmlFor="upload-link">Link</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="upload-file"
                    checked={uploadMethod === "file"}
                    onCheckedChange={() => setUploadMethod("file")}
                  />
                  <Label htmlFor="upload-file">File Upload</Label>
                </div>
              </div>
            </div>

            {uploadMethod === "link" ? (
              <div className="grid gap-3">
                <Label htmlFor="videoUrl">
                  Video URL <span className="text-destructive">*</span>
                </Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="videoUrl"
                      type="url"
                      className="pl-8"
                      placeholder="https://example.com/video.mp4"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      required={uploadMethod === "link"}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Provide a direct link to the video file (MP4, WebM, etc.) or a YouTube/Vimeo URL
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                <Label htmlFor="videoFile">
                  Video File <span className="text-destructive">*</span>
                </Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Input
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoFileChange}
                    required={uploadMethod === "file"}
                  />
                  <Label htmlFor="videoFile" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <span className="font-medium">
                        {videoFile ? videoFile.name : "Click to upload video file"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        MP4, WebM, or other video formats (max 500MB)
                      </span>
                    </div>
                  </Label>
                </div>
                {videoFile && (
                  <div className="text-sm text-muted-foreground">
                    Selected file: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                )}
                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-3">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input
                id="thumbnailUrl"
                type="url"
                placeholder="https://example.com/thumbnail.jpg"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Optional: Provide a URL for the episode thumbnail image
              </p>
            </div>

            <CardFooter className="flex justify-between px-0 pt-6">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting || 
                  (uploadMethod === "link" && !videoUrl) ||
                  (uploadMethod === "file" && !videoFile) ||
                  uploadProgress > 0 && uploadProgress < 100
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Episode...
                  </>
                ) : (
                  "Add Episode"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
