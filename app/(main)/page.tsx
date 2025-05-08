import { featuredAnime, allAnime, getUserUploads } from "@/lib/data"
import { AnimeCard } from "@/components/anime-card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  // Get the first featured anime for the hero section
  const heroAnime = featuredAnime[0]

  // Get the rest of the anime for the grid
  const recentAnime = allAnime.slice(0, 8)

  // Get community uploads (this would normally be fetched from an API)
  const communityUploads = getUserUploads("1").concat(getUserUploads("2"))

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full">
        <Image
          src={heroAnime.bannerImage || heroAnime.coverImage}
          alt={heroAnime.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">{heroAnime.title}</h1>
            <p className="text-lg text-gray-300 mb-6 line-clamp-3">{heroAnime.description}</p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href={`/anime/${heroAnime.id}`}>
                  <Play className="mr-2 h-5 w-5" /> Watch Now
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href={`/anime/${heroAnime.id}`}>More Info</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Uploads Section - NEW */}
      {communityUploads.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Community Uploads</h2>
              <Button variant="ghost" asChild>
                <Link href="/browse?filter=community" className="flex items-center">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {communityUploads.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Anime Section */}
      <section className="py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Anime</h2>
            <Button variant="ghost" asChild>
              <Link href="/browse" className="flex items-center">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {featuredAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Anime Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Releases</h2>
            <Button variant="ghost" asChild>
              <Link href="/browse" className="flex items-center">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {recentAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
