import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface AnimeCardProps {
  anime: any
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

export function AnimeCard({ anime, aspectRatio = "portrait", width, height }: AnimeCardProps) {
  // Handle different property names between mock data and real data
  const title = anime.title
  const coverImage = anime.cover_image || anime.coverImage || "/placeholder.svg?height=400&width=300"
  const id = anime.id

  return (
    <Link href={`/anime/${id}`} className="group">
      <Card className="overflow-hidden border-0 bg-transparent shadow-none transition-all hover:shadow-md">
        <div className="relative overflow-hidden rounded-md">
          <div
            className={`relative ${
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
            } overflow-hidden rounded-md`}
          >
            <Image
              src={coverImage || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-all group-hover:scale-105"
              sizes={width ? `${width}px` : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"}
            />
            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/20" />
          </div>
        </div>
        <CardContent className="px-1 pt-3 pb-1">
          <h3 className="line-clamp-1 text-base font-medium">{title}</h3>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {anime.episodes?.length || anime.episodeCount || 0} Episodes
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
