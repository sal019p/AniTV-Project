import Link from "next/link"

type AnimeCardProps = {
  anime: any
}

export function AnimeCard({ anime }: AnimeCardProps) {
  // Handle different property names between mock data and real data
  const title = anime.title || anime.name || "Untitled Anime"
  const description = anime.description || anime.synopsis || "No description available"
  const imageUrl = anime.cover_image || anime.image || "/placeholder.svg?height=400&width=600"
  const id = anime.id || "unknown"

  return (
    <Link href={`/anime/${id}`} className="block h-full">
      <div className="border rounded-lg overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-4 flex-grow">
          <h3 className="font-bold text-lg line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{description}</p>
        </div>
        <div className="p-4 pt-0">
          <div className="flex items-center text-xs text-gray-500">
            <span>Episodes: {anime.episodes_count || anime.episodes || "Unknown"}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
