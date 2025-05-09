import { getAnimeById, getEpisodesByAnimeId, isSupabaseConfigured } from "@/lib/supabase"
import Link from "next/link"

export default async function AnimePage({ params }: { params: { id: string } }) {
  const { data: anime } = await getAnimeById(params.id)
  const { data: episodes } = await getEpisodesByAnimeId(params.id)

  if (!anime) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Anime Not Found</h1>
        <p>The anime you are looking for does not exist.</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!isSupabaseConfigured() && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-200 rounded-lg text-yellow-800">
          <p className="font-medium">Demo Mode Active</p>
          <p className="text-sm">Supabase is not configured. Using mock data.</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img
            src={anime.cover_image || "/placeholder.svg"}
            alt={anime.title}
            className="w-full rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{anime.title}</h1>
          <p className="text-gray-700 mb-6">{anime.description}</p>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Episodes</p>
                <p className="font-medium">{anime.episodes_count || "Unknown"}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-medium">{anime.status || "Unknown"}</p>
              </div>
            </div>
          </div>

          {episodes && episodes.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Episodes</h2>
              <div className="space-y-2">
                {episodes.map((episode) => (
                  <div key={episode.id} className="p-3 border rounded-lg">
                    <p className="font-medium">
                      Episode {episode.episode_number}: {episode.title}
                    </p>
                    <p className="text-sm text-gray-600">{episode.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
