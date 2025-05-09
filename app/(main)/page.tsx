"use client"

import { useEffect, useState } from "react"
import { getFeaturedAnime, getAllAnime, getCommunityUploads, isSupabaseConfigured } from "@/lib/supabase"
import { AnimeCard } from "@/components/anime-card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Play, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { featuredAnime as mockFeaturedAnime, allAnime as mockAllAnime } from "@/lib/data"

export default function HomePage() {
  const [featuredAnime, setFeaturedAnime] = useState<any[]>([])
  const [recentAnime, setRecentAnime] = useState<any[]>([])
  const [communityUploads, setCommunityUploads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(true)

  useEffect(() => {
    // Check if Supabase is configured
    setIsConfigured(isSupabaseConfigured())

    async function fetchData() {
      try {
        // If Supabase is not configured, use mock data
        if (!isSupabaseConfigured()) {
          console.warn("Supabase is not configured. Using mock data instead.")
          setFeaturedAnime(mockFeaturedAnime)
          setRecentAnime(mockAllAnime.slice(0, 8))
          setCommunityUploads(mockAllAnime.filter((anime) => anime.uploadedBy).slice(0, 5))
          setError("Database connection not configured. Using demo data instead.")
          setLoading(false)
          return
        }

        // Fetch data from Supabase
        const [featured, all, community] = await Promise.all([getFeaturedAnime(), getAllAnime(), getCommunityUploads()])

        setFeaturedAnime(featured)
        setRecentAnime(all.slice(0, 8))
        setCommunityUploads(community.slice(0, 5))
      } catch (error) {
        console.error("Error fetching anime data:", error)
        // Fallback to mock data
        setFeaturedAnime(mockFeaturedAnime)
        setRecentAnime(mockAllAnime.slice(0, 8))
        setCommunityUploads(mockAllAnime.filter((anime) => anime.uploadedBy).slice(0, 5))
        setError("Failed to fetch data from the database. Using demo data instead.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get the first featured anime for the hero section
  const heroAnime = featuredAnime[0] || null

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <section className="relative h-[70vh] w-full bg-card/20">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
            <div className="max-w-2xl">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-5/6 mb-6" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections Skeleton */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="aspect-[3/4] w-full rounded-md mb-2" />
                  <Skeleton className="h-5 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {!isConfigured && (
        <Alert variant="warning" className="max-w-7xl mx-auto mt-4 mb-0 mx-4 sm:mx-6 lg:mx-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Supabase is not configured. Please set up your environment variables. Using demo data instead.
          </AlertDescription>
        </Alert>
      )}

      {error && error !== "Database connection not configured. Using demo data instead." && (
        <Alert variant="destructive" className="max-w-7xl mx-auto mt-4 mb-0 mx-4 sm:mx-6 lg:mx-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Hero Section */}
      {heroAnime ? (
        <section className="relative h-[70vh] w-full">
          <Image
            src={
              heroAnime.banner_image ||
              heroAnime.cover_image ||
              heroAnime.bannerImage ||
              heroAnime.coverImage ||
              "/placeholder.svg?height=600&width=1200" ||
              "/placeholder.svg"
            }
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
      ) : (
        <section className="relative h-[70vh] w-full bg-card/20">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-2xl text-center mx-auto">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Welcome to AniTV</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Your ultimate destination for anime streaming and discovery
              </p>
              <Button asChild size="lg">
                <Link href="/browse">Browse Anime</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Community Uploads Section */}
      {communityUploads.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Community Uploads</h2>
                <p className="text-muted-foreground">Latest anime shared by our community</p>
              </div>
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
      {featuredAnime.length > 0 && (
        <section className="py-12 bg-card/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Featured Anime</h2>
                <p className="text-muted-foreground">Curated selection of top anime</p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/browse?filter=featured" className="flex items-center">
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
      )}

      {/* Recent Anime Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Recent Releases</h2>
              <p className="text-muted-foreground">Stay up to date with the latest episodes</p>
            </div>
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
