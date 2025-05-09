// Simple mock data for when Supabase is not configured
export const mockAnimeData = [
  {
    id: "1",
    title: "Demon Slayer",
    description: "A boy fights demons after his family is slaughtered and his sister is infected.",
    cover_image: "/placeholder.svg?height=400&width=600",
    episodes_count: 26,
  },
  {
    id: "2",
    title: "Attack on Titan",
    description: "Humanity fights for survival against man-eating giants.",
    cover_image: "/placeholder.svg?height=400&width=600",
    episodes_count: 75,
  },
  {
    id: "3",
    title: "My Hero Academia",
    description: "A boy born without superpowers fights to become the greatest hero.",
    cover_image: "/placeholder.svg?height=400&width=600",
    episodes_count: 113,
  },
]

export const mockEpisodeData = [
  {
    id: "1",
    anime_id: "1",
    title: "Cruelty",
    episode_number: 1,
    description: "Tanjiro's peaceful life is shattered when his family is slaughtered by demons.",
    video_url: "#",
  },
  {
    id: "2",
    anime_id: "1",
    title: "Trainer Sakonji Urokodaki",
    episode_number: 2,
    description: "Tanjiro begins his training to become a demon slayer.",
    video_url: "#",
  },
]

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return (
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.trim() !== "" &&
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim() !== ""
  )
}

// Helper functions for data fetching with fallbacks to mock data
export const getCommunityUploads = async () => {
  console.log("Getting community uploads")

  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, using mock data")
    return { data: mockAnimeData }
  }

  try {
    console.log("Fetching data from Supabase")
    return { data: mockAnimeData } // For now, always return mock data
  } catch (error) {
    console.error("Error in getCommunityUploads:", error)
    return { data: mockAnimeData }
  }
}

export const getAnimeById = async (id: string) => {
  console.log(`Getting anime with id ${id}`)

  if (!isSupabaseConfigured()) {
    console.log(`Supabase not configured, using mock data for id ${id}`)
    return {
      data: mockAnimeData.find((anime) => anime.id === id) || null,
    }
  }

  try {
    console.log(`Fetching anime with id ${id} from Supabase`)
    return {
      data: mockAnimeData.find((anime) => anime.id === id) || null,
    } // For now, always return mock data
  } catch (error) {
    console.error(`Error in getAnimeById for id ${id}:`, error)
    return {
      data: mockAnimeData.find((anime) => anime.id === id) || null,
    }
  }
}

export const getEpisodesByAnimeId = async (animeId: string) => {
  console.log(`Getting episodes for anime with id ${animeId}`)

  if (!isSupabaseConfigured()) {
    console.log(`Supabase not configured, using mock data for anime id ${animeId}`)
    return {
      data: mockEpisodeData.filter((episode) => episode.anime_id === animeId),
    }
  }

  try {
    console.log(`Fetching episodes for anime with id ${animeId} from Supabase`)
    return {
      data: mockEpisodeData.filter((episode) => episode.anime_id === animeId),
    } // For now, always return mock data
  } catch (error) {
    console.error(`Error in getEpisodesByAnimeId for anime id ${animeId}:`, error)
    return {
      data: mockEpisodeData.filter((episode) => episode.anime_id === animeId),
    }
  }
}
