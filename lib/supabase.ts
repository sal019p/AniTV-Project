import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to get a user's profile
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

// Helper function to get anime by ID
export async function getAnimeById(id: string) {
  const { data, error } = await supabase
    .from("anime")
    .select(`
      *,
      episodes:anime_episodes(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching anime:", error)
    return null
  }

  return data
}

// Helper function to get all anime
export async function getAllAnime() {
  const { data, error } = await supabase.from("anime").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all anime:", error)
    return []
  }

  return data || []
}

// Helper function to get featured anime
export async function getFeaturedAnime() {
  const { data, error } = await supabase.from("anime").select("*").eq("is_featured", true).limit(5)

  if (error) {
    console.error("Error fetching featured anime:", error)
    return []
  }

  return data || []
}

// Helper function to get community uploads
export async function getCommunityUploads() {
  const { data, error } = await supabase
    .from("anime")
    .select("*")
    .eq("is_community", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching community uploads:", error)
    return []
  }

  return data || []
}

// Helper function to get user uploads
export async function getUserUploads(userId: string) {
  const { data, error } = await supabase
    .from("anime")
    .select("*")
    .eq("uploaded_by", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user uploads:", error)
    return []
  }

  return data || []
}

// Helper function to get user favorites
export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select(`
      anime_id,
      anime:anime_id(*)
    `)
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching user favorites:", error)
    return []
  }

  // Extract the anime objects from the joined data
  return data?.map((item) => item.anime) || []
}

// Helper function to add anime to favorites
export async function addToFavorites(userId: string, animeId: string) {
  const { error } = await supabase.from("favorites").insert({ user_id: userId, anime_id: animeId })

  if (error) {
    if (error.code === "23505") {
      // Unique violation
      console.log("Anime already in favorites")
      return { success: true, message: "Anime already in favorites" }
    }
    console.error("Error adding to favorites:", error)
    return { success: false, message: error.message }
  }

  return { success: true, message: "Added to favorites" }
}

// Helper function to remove anime from favorites
export async function removeFromFavorites(userId: string, animeId: string) {
  const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("anime_id", animeId)

  if (error) {
    console.error("Error removing from favorites:", error)
    return { success: false, message: error.message }
  }

  return { success: true, message: "Removed from favorites" }
}

// Helper function to check if anime is in favorites
export async function isInFavorites(userId: string, animeId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .eq("anime_id", animeId)
    .single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for no rows returned
    console.error("Error checking favorites:", error)
    return false
  }

  return !!data
}

// Helper function to upload a video to Supabase storage
export async function uploadVideo(file: File, path: string, onProgress?: (progress: number) => void) {
  const { data, error } = await supabase.storage.from("videos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    onUploadProgress: (progress) => {
      const percent = (progress.loaded / progress.total) * 100
      onProgress?.(percent)
    },
  })

  if (error) {
    console.error("Error uploading video:", error)
    return { success: false, error }
  }

  // Get the public URL for the uploaded file
  const {
    data: { publicUrl },
  } = supabase.storage.from("videos").getPublicUrl(path)

  return { success: true, path, publicUrl }
}

// Helper function to add an episode to an anime
export async function addEpisode(animeId: string, episodeData: any) {
  const { data, error } = await supabase
    .from("anime_episodes")
    .insert({
      anime_id: animeId,
      ...episodeData,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding episode:", error)
    return { success: false, error }
  }

  return { success: true, episode: data }
}

// Helper function to add a new anime
export async function addAnime(animeData: any) {
  const { data, error } = await supabase.from("anime").insert(animeData).select().single()

  if (error) {
    console.error("Error adding anime:", error)
    return { success: false, error }
  }

  return { success: true, anime: data }
}
