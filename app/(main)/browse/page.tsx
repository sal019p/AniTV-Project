"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { allAnime, getCommunityUploads } from "@/lib/data"
import { AnimeCard } from "@/components/anime-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const initialFilter = searchParams.get("filter") || "all"

  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState(initialFilter)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [genreFilter, setGenreFilter] = useState<string | null>(null)
  const [yearFilter, setYearFilter] = useState<string | null>(null)
  const [filteredAnime, setFilteredAnime] = useState(allAnime)
  const [isLoading, setIsLoading] = useState(true)

  // Get all community uploads
  const communityUploads = getCommunityUploads()

  // Get all available genres
  const allGenres = Array.from(new Set([...allAnime, ...communityUploads].flatMap((anime) => anime.genres))).sort()

  // Get all available years
  const allYears = Array.from(new Set([...allAnime, ...communityUploads].map((anime) => anime.releaseYear))).sort(
    (a, b) => b - a,
  ) // Sort descending

  useEffect(() => {
    setIsLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      let results = [...allAnime]

      // Apply tab filter
      if (activeFilter === "community") {
        results = [...communityUploads]
      } else if (activeFilter === "airing") {
        results = [...allAnime, ...communityUploads].filter((anime) => anime.status === "Airing")
      } else if (activeFilter === "completed") {
        results = [...allAnime, ...communityUploads].filter((anime) => anime.status === "Completed")
      } else if (activeFilter === "upcoming") {
        results = [...allAnime, ...communityUploads].filter((anime) => anime.status === "Upcoming")
      } else {
        // "all" filter - include everything
        results = [...allAnime, ...communityUploads]
      }

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        results = results.filter(
          (anime) => anime.title.toLowerCase().includes(query) || anime.description.toLowerCase().includes(query),
        )
      }

      // Apply status filter
      if (statusFilter) {
        results = results.filter((anime) => anime.status === statusFilter)
      }

      // Apply genre filter
      if (genreFilter) {
        results = results.filter((anime) => anime.genres.includes(genreFilter))
      }

      // Apply year filter
      if (yearFilter) {
        results = results.filter((anime) => anime.releaseYear === Number.parseInt(yearFilter))
      }

      // Remove duplicates (in case an anime is in both allAnime and communityUploads)
      const uniqueResults = Array.from(new Map(results.map((anime) => [anime.id, anime])).values())

      setFilteredAnime(uniqueResults)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [activeFilter, searchQuery, statusFilter, genreFilter, yearFilter, communityUploads])

  const clearFilters = () => {
    setStatusFilter(null)
    setGenreFilter(null)
    setYearFilter(null)
    setSearchQuery("")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Browse Anime</h1>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search anime..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue={activeFilter} onValueChange={setActiveFilter} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList className="h-auto p-1">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="airing">Airing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Airing">Airing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>

            <Select value={genreFilter || ""} onValueChange={(value) => setGenreFilter(value || null)}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {allGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={yearFilter || ""} onValueChange={(value) => setYearFilter(value || null)}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {allYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(statusFilter || genreFilter || yearFilter || searchQuery) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6">
          {(statusFilter || genreFilter || yearFilter || searchQuery) && (
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="text-sm text-muted-foreground mr-2 flex items-center">
                <Filter className="h-4 w-4 mr-1" /> Filters:
              </div>

              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => setSearchQuery("")}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {statusFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {statusFilter}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => setStatusFilter(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {genreFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Genre: {genreFilter}
                  <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => setGenreFilter(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {yearFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Year: {yearFilter}
                  <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => setYearFilter(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>

        <TabsContent value={activeFilter} className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-md aspect-[3/4]"></div>
                  <div className="mt-2 h-4 bg-muted rounded w-3/4"></div>
                  <div className="mt-1 h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredAnime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredAnime.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No anime found matching your criteria.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
