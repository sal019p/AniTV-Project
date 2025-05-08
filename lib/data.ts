import { logger } from "@/lib/logger"

// Types for anime data
export type AnimeStatus = "Airing" | "Completed" | "Upcoming"

export interface Anime {
  id: string
  title: string
  description: string
  coverImage: string
  bannerImage?: string
  episodes: number
  status: AnimeStatus
  rating: number
  genres: string[]
  releaseYear: number
  videoUrl?: string
  uploadedBy?: string
  createdAt?: number
}

// Mock data for featured anime
export const featuredAnime: Anime[] = [
  {
    id: "1",
    title: "Demon Slayer: Kimetsu no Yaiba",
    description:
      "Tanjiro Kamado, a kind-hearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself. Though devastated by this grim reality, Tanjiro resolves to become a demon slayer to turn his sister back into a human and avenge his family.",
    coverImage: "/placeholder.svg?height=400&width=300",
    bannerImage: "/placeholder.svg?height=600&width=1200",
    episodes: 26,
    status: "Airing",
    rating: 8.9,
    genres: ["Action", "Fantasy", "Historical"],
    releaseYear: 2019,
    videoUrl: "https://www.youtube.com/watch?v=VQGCKyvzIM4",
  },
  {
    id: "2",
    title: "Attack on Titan",
    description:
      "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure.",
    coverImage: "/placeholder.svg?height=400&width=300",
    bannerImage: "/placeholder.svg?height=600&width=1200",
    episodes: 75,
    status: "Completed",
    rating: 9.1,
    genres: ["Action", "Drama", "Fantasy"],
    releaseYear: 2013,
    videoUrl: "https://www.youtube.com/watch?v=MGRm4IzK1SQ",
  },
  {
    id: "3",
    title: "My Hero Academia",
    description:
      "In a world where people with superpowers (called 'Quirks') are the norm, middle school student Izuku Midoriya has no powers. However, he still dreams of becoming a superhero himself. It seems an impossible dream, until a chance encounter with the greatest hero of them all gives him a chance to change his destiny.",
    coverImage: "/placeholder.svg?height=400&width=300",
    bannerImage: "/placeholder.svg?height=600&width=1200",
    episodes: 113,
    status: "Airing",
    rating: 8.4,
    genres: ["Action", "Comedy", "Superhero"],
    releaseYear: 2016,
    videoUrl: "https://www.youtube.com/watch?v=EPVkcwyLQQ8",
  },
]

// Mock data for all anime
export const allAnime: Anime[] = [
  ...featuredAnime,
  {
    id: "4",
    title: "One Piece",
    description:
      "Gol D. Roger was known as the 'Pirate King,' the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world.",
    coverImage: "/placeholder.svg?height=400&width=300",
    episodes: 1000,
    status: "Airing",
    rating: 8.7,
    genres: ["Action", "Adventure", "Comedy"],
    releaseYear: 1999,
  },
  {
    id: "5",
    title: "Jujutsu Kaisen",
    description:
      "Yuji Itadori is a boy with tremendous physical strength, though he lives a completely ordinary high school life. One day, to save a classmate who has been attacked by curses, he eats the finger of Ryomen Sukuna, taking the curse into his own soul.",
    coverImage: "/placeholder.svg?height=400&width=300",
    episodes: 24,
    status: "Airing",
    rating: 8.8,
    genres: ["Action", "Supernatural", "Horror"],
    releaseYear: 2020,
    uploadedBy: "1", // User 1 uploaded this
  },
  {
    id: "6",
    title: "Fullmetal Alchemist: Brotherhood",
    description:
      "After a horrific alchemy experiment goes wrong in the Elric household, brothers Edward and Alphonse are left in a catastrophic new reality. Ignoring the alchemical principle banning human transmutation, the boys attempted to bring their recently deceased mother back to life.",
    coverImage: "/placeholder.svg?height=400&width=300",
    episodes: 64,
    status: "Completed",
    rating: 9.2,
    genres: ["Action", "Adventure", "Drama"],
    releaseYear: 2009,
  },
  {
    id: "7",
    title: "Death Note",
    description:
      "Light Yagami is a genius high school student who is about to learn about life through a book of death. When a bored shinigami, a God of Death, named Ryuk drops a black notepad called a Death Note, Light receives power over life and death with the stroke of a pen.",
    coverImage: "/placeholder.svg?height=400&width=300",
    episodes: 37,
    status: "Completed",
    rating: 9.0,
    genres: ["Mystery", "Psychological", "Supernatural"],
    releaseYear: 2006,
  },
  {
    id: "8",
    title: "Spy x Family",
    description:
      "A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own, and all three must strive to keep together.",
    coverImage: "/placeholder.svg?height=400&width=300",
    episodes: 25,
    status: "Airing",
    rating: 8.6,
    genres: ["Action", "Comedy", "Slice of Life"],
    releaseYear: 2022,
    uploadedBy: "1", // User 1 uploaded this
  },
  {
    id: "9",
    title: "Chainsaw Man",
    description:
      "Denji has a simple dream—to live a happy and peaceful life, spending time with a girl he likes. This is a far cry from reality, however, as Denji is forced by the yakuza into killing devils in order to pay off his crushing debts.",
    coverImage: "/placeholder.svg?height=400&width=300",
    episodes: 12,
    status: "Completed",
    rating: 8.7,
    genres: ["Action", "Horror", "Supernatural"],
    releaseYear: 2022,
  },
  {
    id: "10",
    title: "Violet Evergarden",
    description:
      "The Great War finally came to an end after four long years of conflict; fractured in two, the continent of Telesis slowly began to flourish once again. Caught up in the bloodshed was Violet Evergarden, a young girl raised for the sole purpose of decimating enemy lines.",
    coverImage: "/placeholder.svg?height=400&width=300",
    episodes: 13,
    status: "Completed",
    rating: 8.9,
    genres: ["Drama", "Fantasy", "Slice of Life"],
    releaseYear: 2018,
  },
  {
    id: "11",
    title: "Your Name",
    description:
      "Mitsuha Miyamizu, a high school girl, yearns to live the life of a boy in the bustling city of Tokyo—a dream that stands in stark contrast to her present life in the countryside. Meanwhile in the city, Taki Tachibana lives a busy life as a high school student while juggling his part-time job and hopes for a future in architecture.",
    coverImage: "/placeholder.svg?height=400&width=300",
    episodes: 1,
    status: "Completed",
    rating: 9.0,
    genres: ["Romance", "Supernatural", "Drama"],
    releaseYear: 2016,
  },
  {
    id: "12",
    title: "Tokyo Ghoul",
    description:
      "Tokyo has become a cruel and merciless city—a place where vicious creatures called 'ghouls' exist alongside humans. The citizens of this once great metropolis live in constant fear of these bloodthirsty savages and their thirst for human flesh.",
    coverImage: "/placeholder.svg?height=400&width=300",
    episodes: 12,
    status: "Completed",
    rating: 8.0,
    genres: ["Action", "Horror", "Psychological"],
    releaseYear: 2014,
  },
  {
    id: "13",
    title: "Naruto Shippuden",
    description:
      "Naruto Uzumaki returns after two and a half years of training with Jiraiya to face the Akatsuki, a mysterious organization of elite rogue ninja who are hunting down the powerful tailed beasts.",
    coverImage: "/placeholder.svg?height=400&width=300",
    episodes: 500,
    status: "Completed",
    rating: 8.6,
    genres: ["Action", "Adventure", "Fantasy"],
    releaseYear: 2007,
    uploadedBy: "2", // User 2 uploaded this
  },
  {
    id: "14",
    title: "One Punch Man",
    description:
      "Saitama has become too powerful, and he can defeat his enemies with a single punch. Now, the greatest challenge for him is to find a worthy opponent who can give him the excitement he once felt.",
    coverImage: "/placeholder.svg?height=400&width=300",
    episodes: 24,
    status: "Airing",
    rating: 8.8,
    genres: ["Action", "Comedy", "Superhero"],
    releaseYear: 2015,
    uploadedBy: "2", // User 2 uploaded this
  },
]

// In-memory storage for user uploads
const userUploads: Anime[] = []

// Mock user data
export interface User {
  id: string
  name: string
  email: string
  image?: string
  bio?: string
  favorites: string[] // Array of anime IDs
  uploads: string[] // Array of anime IDs
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Anime Fan",
    email: "user@example.com",
    image: "/placeholder.svg?height=100&width=100",
    bio: "Just a casual anime enthusiast who loves to share great content!",
    favorites: ["1", "3", "6", "9"],
    uploads: ["5", "8"],
  },
  {
    id: "2",
    name: "Otaku Master",
    email: "otaku@example.com",
    image: "/placeholder.svg?height=100&width=100",
    bio: "Dedicated anime curator with a passion for finding hidden gems.",
    favorites: ["2", "4", "7"],
    uploads: ["13", "14"],
  },
]

// Helper function to get anime by ID
export function getAnimeById(id: string): Anime | undefined {
  logger.dataFlow(`Fetching anime with ID: ${id}`)

  // First check in allAnime
  const animeFromAll = allAnime.find((anime) => anime.id === id)
  if (animeFromAll) {
    logger.dataFlow(`Found anime in allAnime: ${animeFromAll.title}`)
    return animeFromAll
  }

  // Then check in userUploads
  const animeFromUploads = userUploads.find((anime) => anime.id === id)
  if (animeFromUploads) {
    logger.dataFlow(`Found anime in userUploads: ${animeFromUploads.title}`)
    return animeFromUploads
  }

  logger.warn(`Anime with ID ${id} not found`)
  return undefined
}

// Helper function to get user by ID
export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id)
}

// Helper function to get user's favorite anime
export function getUserFavorites(userId: string): Anime[] {
  logger.dataFlow(`Fetching favorites for user: ${userId}`)

  const user = getUserById(userId)
  if (!user) {
    logger.warn(`User with ID ${userId} not found`)
    return []
  }

  // Get favorites from both allAnime and userUploads
  const favorites = [...allAnime, ...userUploads].filter((anime) => user.favorites.includes(anime.id))
  logger.dataFlow(`Found ${favorites.length} favorites for user ${userId}`)

  return favorites
}

// Helper function to get user's uploaded anime
export function getUserUploads(userId: string): Anime[] {
  logger.dataFlow(`Fetching uploads for user: ${userId}`)

  // First check the uploads array in the user object
  const user = getUserById(userId)
  if (!user) {
    logger.warn(`User with ID ${userId} not found`)
    return []
  }

  // Get uploads from both allAnime and userUploads
  const uploads = [
    ...allAnime.filter((anime) => user.uploads.includes(anime.id) || anime.uploadedBy === userId),
    ...userUploads.filter((anime) => anime.uploadedBy === userId),
  ]

  logger.dataFlow(`Found ${uploads.length} uploads for user ${userId}`)
  return uploads
}

// Helper function to get all community uploads
export function getCommunityUploads(): Anime[] {
  logger.dataFlow(`Fetching all community uploads`)

  const communityAnime = [...allAnime.filter((anime) => anime.uploadedBy !== undefined), ...userUploads]

  logger.dataFlow(`Found ${communityAnime.length} community uploads`)
  return communityAnime
}

// Function to add a new anime
export async function addAnime(animeData: Partial<Anime>, userId: string): Promise<Anime> {
  logger.dataFlow(`Adding new anime: ${animeData.title} by user ${userId}`)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate a unique ID
  const id = `anime-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  // Create the new anime object
  const newAnime: Anime = {
    id,
    title: animeData.title || "Untitled Anime",
    description: animeData.description || "No description provided",
    coverImage: animeData.coverImage || "/placeholder.svg?height=400&width=300",
    bannerImage: animeData.bannerImage,
    episodes: animeData.episodes || 1,
    status: animeData.status || "Airing",
    rating: animeData.rating || 7.0,
    genres: animeData.genres || [],
    releaseYear: animeData.releaseYear || new Date().getFullYear(),
    videoUrl: animeData.videoUrl,
    uploadedBy: userId,
    createdAt: Date.now(),
  }

  // Add to userUploads array
  userUploads.push(newAnime)

  // Update the user's uploads array
  const user = mockUsers.find((u) => u.id === userId)
  if (user) {
    user.uploads.push(id)
    logger.dataFlow(`Updated user ${userId} uploads array, now has ${user.uploads.length} uploads`)
  }

  // Log the upload for debugging
  logger.info(`New anime uploaded: ${newAnime.title} by user ${userId}`)
  logger.info(`Total user uploads: ${userUploads.length}`)

  return newAnime
}

// Mock data for anime schedule
export interface ScheduleDay {
  day: string
  anime: Anime[]
}

export const animeSchedule: ScheduleDay[] = [
  {
    day: "Monday",
    anime: [allAnime[4], allAnime[7]],
  },
  {
    day: "Tuesday",
    anime: [allAnime[0], allAnime[9]],
  },
  {
    day: "Wednesday",
    anime: [allAnime[2], allAnime[13]],
  },
  {
    day: "Thursday",
    anime: [allAnime[5], allAnime[8]],
  },
  {
    day: "Friday",
    anime: [allAnime[1], allAnime[3]],
  },
  {
    day: "Saturday",
    anime: [allAnime[6], allAnime[12]],
  },
  {
    day: "Sunday",
    anime: [allAnime[10], allAnime[11]],
  },
]
