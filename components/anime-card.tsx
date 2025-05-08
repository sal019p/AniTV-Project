import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Anime } from "@/lib/data"

interface AnimeCardProps {
  anime: Anime
  className?: string
}

export function AnimeCard({ anime, className }: AnimeCardProps) {
  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Airing":
        return "bg-green-500"
      case "Completed":
        return "bg-blue-500"
      case "Upcoming":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Link href={`/anime/${anime.id}`}>
      <Card className={cn("overflow-hidden border-0 anime-card-hover anime-card", className)}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={anime.coverImage || "/placeholder.svg"}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <Badge className={cn("text-white", getStatusColor(anime.status))}>{anime.status}</Badge>
          </div>
          {anime.rating && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white text-sm px-2 py-1 rounded-md">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{anime.rating.toFixed(1)}</span>
            </div>
          )}
          {anime.uploadedBy && (
            <div className="absolute top-2 left-2">
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                Community
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold line-clamp-1">{anime.title}</h3>
          <p className="text-xs text-muted-foreground">{anime.releaseYear}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
