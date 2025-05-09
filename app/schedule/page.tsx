"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent } from "@/components/ui/card"
// Update the import to use the icons from the new file
import { Loader2 } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"

interface Anime {
  id: string
  title: string
  cover_image: string
  status: string
  release_year: number
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function SchedulePage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [schedule, setSchedule] = useState<Record<string, Anime[]>>({})
  const [loading, setLoading] = useState(true)
  const [activeDay, setActiveDay] = useState<string>(
    DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1],
  )

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        // In a real app, you would have a proper schedule table
        // For this demo, we'll randomly assign anime to days of the week
        const { data: animeData, error } = await supabase
          .from("anime")
          .select("id, title, cover_image, status, release_year")
          .eq("status", "Airing")
          .order("title")

        if (error) throw error

        // Create a mock schedule by distributing anime across days
        const mockSchedule: Record<string, Anime[]> = {}

        DAYS_OF_WEEK.forEach((day) => {
          mockSchedule[day] = []
        })

        if (animeData) {
          animeData.forEach((anime, index) => {
            // Distribute anime across days (this is just for demo purposes)
            const day = DAYS_OF_WEEK[index % DAYS_OF_WEEK.length]
            mockSchedule[day].push(anime)
          })
        }

        setSchedule(mockSchedule)
      } catch (err) {
        console.error(err)
        toast({
          title: "Error",
          description: "Failed to load schedule",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [supabase, toast])

  const handleAnimeClick = (animeId: string) => {
    router.push(`/anime/${animeId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Anime Schedule</h1>

      <div className="flex overflow-x-auto pb-2 mb-6">
        <div className="flex space-x-2">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day}
              className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                activeDay === day ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
              onClick={() => setActiveDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {schedule[activeDay]?.length > 0 ? (
          schedule[activeDay].map((anime) => (
            <Card
              key={anime.id}
              className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleAnimeClick(anime.id)}
            >
              <div className="relative aspect-[3/4]">
                <Image src={anime.cover_image || "/placeholder.svg"} alt={anime.title} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium line-clamp-1">{anime.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {anime.release_year} • {anime.status}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No anime scheduled for {activeDay}.</p>
          </div>
        )}
      </div>
    </div>
  )
}
