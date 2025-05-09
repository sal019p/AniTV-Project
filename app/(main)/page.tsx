import { getCommunityUploads, isSupabaseConfigured } from "@/lib/supabase"
import Link from "next/link"

export default async function HomePage() {
  const { data: animeData } = await getCommunityUploads()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to AniTV</h1>

      {!isSupabaseConfigured() && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-200 rounded-lg text-yellow-800">
          <p className="font-medium">Demo Mode Active</p>
          <p className="text-sm">Supabase is not configured. The app is running in demo mode with mock data.</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Community Uploads</h2>

      {animeData.length === 0 ? (
        <p className="text-gray-500">No anime found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {animeData.map((anime) => (
            <div key={anime.id} className="border rounded-lg overflow-hidden shadow-sm">
              <img
                src={anime.cover_image || "/placeholder.svg"}
                alt={anime.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{anime.title}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{anime.description}</p>
                <div className="mt-4">
                  <Link href={`/anime/${anime.id}`} className="text-blue-600 hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
