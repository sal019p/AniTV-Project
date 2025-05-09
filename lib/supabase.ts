import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables. Please make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
  )
}

// Create a singleton instance of the Supabase client with proper error handling
export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder-url.supabase.co", // Fallback URL to prevent construction errors
  supabaseAnonKey || "placeholder-key", // Fallback key to prevent construction errors
  {
    auth: {
      persistSession: true,
    },
  },
)

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured() {
  return !!supabaseUrl && !!supabaseAnonKey
}

// Helper function to get a user's profile
export async function getUserById(userId: string) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not properly configured")
    return null
  }

  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserById:", error)
    return null
  }
}

// Helper function to get anime by ID
export async function getAnimeById(id: string) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not properly configured")
    return null
  }

  try {
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
  } catch (error) {
    console.error("Error in getAnimeById:", error)
    return null
  }
}

// Helper function to get all anime
export async function getAllAnime() {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not properly configured")
    return []
  }

  try {
    const { data, error } = await supabase.from("anime").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching all anime:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllAnime:", error)
    return []
  }
}

// Helper function to get featured anime
export async function getFeaturedAnime() {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not properly configured")
    return []
  }

  try {
    const { data, error } = await supabase.from("anime").select("*").eq("is_featured", true).limit(5)

    if (error) {
      console.error("Error fetching featured anime:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getFeaturedAnime:", error)
    return []
  }
}

// Helper function to get community uploads
export async function getCommunityUploads() {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not properly configured")
    return []
  }

  try {
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
  } catch (error) {
    console.error("Error in getCommunityUploads:", error)
    return []
  }
}

// Helper function to get user uploads
export async function getUserUploads(userId: string) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not properly configured")
    return []
  }

  try {
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
  } catch (error) {
    console.error("Error in getUserUploads:", error)
    return []
  }
}

// Helper function to get user favorites
export async function getUserFavorites(userId: string) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not properly configured")
    return []
  }

  try {
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
  } catch (error) {
    console.error("Error in getUserFavorites:", error)
    return []
  }
}

// Helper function to add anime to favorites
export async function addToFavorites(userId: string, animeId: string) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not properly configured")
    return { success: false, message: "Database not configured" }
  }

  try {
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
  } catch (error: any) {
    console.error("Error in addToFavorites:", error)
    return { success: false, message: error.message || "Unknown error" }
  }
}

// Helper function to remove anime from favorites
export async function removeFromFavorites(userId: string, animeId: string) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not properly configured")
    return { success: false, message: "Database not configured" }
  }

  try {
    const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("anime_id", animeId)

    if (error) {
      console.error("Error removing from favorites:", error)
      return { success: false, message: error.message }
    }

    return { success: true, message: "Removed from favorites" }
  } catch (error: any) {
    console.error("Error in removeFromFavorites:", error)
    return { success: false, message: error.message || "Unknown error" }
  }
}

// Helper function to check if anime is in favorites
export async function isInFavorites(userId: string, animeId: string) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not properly configured")
    return false
  }

  try {
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
  } catch (error) {
    console.error("Error in isInFavorites:", error)
    return false
  }
}

// Helper function to upload a video to Supabase storage
export async function uploadVideo(file: File, path: string, onProgress?: (progress: number) => void) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not properly configured")
    return { success: false, error: { message: "Database not configured" } }
  }

  try {
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
  } catch (error: any) {
    console.error("Error in uploadVideo:", error)
    return { success: false, error: { message: error.message || "Unknown error" } }
  }
}

// Helper function to add an episode to an anime
export async function addEpisode(animeId: string, episodeData: any) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not properly configured")
    return { success: false, error: { message: "Database not configured" } }
  }

  try {
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
  } catch (error: any) {
    console.error("Error in addEpisode:", error)
    return { success: false, error: { message: error.message || "Unknown error" } }
  }
}

// Helper function to add a new anime
export async function addAnime(animeData: any) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not properly configured")
    return { success: false, error: { message: "Database not configured" } }
  }

  try {
    const { data, error } = await supabase.from("anime").insert(animeData).select().single()

    if (error) {
      console.error("Error adding anime:", error)
      return { success: false, error }
    }

    return { success: true, anime: data }
  } catch (error: any) {
    console.error("Error in addAnime:", error)
    return { success: false, error: { message: error.message || "Unknown error" } }
  }
}
