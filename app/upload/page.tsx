"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// Update the import to use the icons from the new file
import { AlertCircle, Loader2, Upload } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"

export default function UploadPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload content",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!title || !description || !coverImage || !video) {
      setError("Please fill in all fields and upload both cover image and video")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Upload cover image to storage
      const coverImagePath = `covers/${Date.now()}-${coverImage.name}`
      const { error: coverUploadError } = await supabase.storage.from("videos").upload(coverImagePath, coverImage)

      if (coverUploadError) throw new Error(`Cover upload failed: ${coverUploadError.message}`)

      // Get public URL for cover image
      const { data: coverImageUrl } = supabase.storage.from("videos").getPublicUrl(coverImagePath)

      // Upload video to storage
      const videoPath = `videos/${Date.now()}-${video.name}`
      const { error: videoUploadError } = await supabase.storage.from("videos").upload(videoPath, video)

      if (videoUploadError) throw new Error(`Video upload failed: ${videoUploadError.message}`)

      // Get public URL for video
      const { data: videoUrl } = supabase.storage.from("videos").getPublicUrl(videoPath)

      // Create anime entry
      const { error: animeError } = await supabase
        .from("anime")
        .insert({
          title,
          description,
          cover_image: coverImageUrl.publicUrl,
          banner_image: coverImageUrl.publicUrl, // Using same image for banner
          episodes_count: 1,
          status: "Completed",
          rating: 0,
          genres: ["Community"],
          release_year: new Date().getFullYear(),
          is_featured: false,
          is_community: true,
          created_at: new Date().toISOString(),
        })
        .select()

      if (animeError) throw new Error(`Anime creation failed: ${animeError.message}`)

      // Get the created anime ID
      const { data: animeData } = await supabase
        .from("anime")
        .select("id")
        .eq("title", title)
        .order("created_at", { ascending: false })
        .limit(1)

      if (!animeData || animeData.length === 0) throw new Error("Failed to retrieve anime ID")

      // Create episode entry
      const { error: episodeError } = await supabase.from("anime_episodes").insert({
        anime_id: animeData[0].id,
        title: `${title} - Episode 1`,
        description,
        episode_number: 1,
        video_url: videoUrl.publicUrl,
        thumbnail: coverImageUrl.publicUrl,
        created_at: new Date().toISOString(),
      })

      if (episodeError) throw new Error(`Episode creation failed: ${episodeError.message}`)

      toast({
        title: "Upload successful",
        description: "Your anime has been uploaded successfully",
      })

      router.push("/")
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Anime</CardTitle>
          <CardDescription>Share your anime creation with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter anime title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter anime description"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image</Label>
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" onClick={() => document.getElementById("coverImage")?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Cover Image
                </Button>
                <span className="text-sm text-gray-500">{coverImage ? coverImage.name : "No file selected"}</span>
              </div>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setCoverImage(e.target.files[0])}
                className="hidden"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">Video</Label>
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" onClick={() => document.getElementById("video")?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Video
                </Button>
                <span className="text-sm text-gray-500">{video ? video.name : "No file selected"}</span>
              </div>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files && setVideo(e.target.files[0])}
                className="hidden"
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
        <CardFooter>
          <Button type="submit" onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Anime"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
