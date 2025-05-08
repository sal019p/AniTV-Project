"use client"

import { useState } from "react"
import { animeSchedule } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function SchedulePage() {
  // Get current day of the week
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const currentDay = days[new Date().getDay()]

  const [activeDay, setActiveDay] = useState(currentDay.toLowerCase())

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Anime Schedule</h1>
          <p className="text-muted-foreground">Find out when your favorite shows air</p>
        </div>

        <div className="flex items-center gap-2 bg-card p-2 rounded-lg">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Today: {currentDay}</span>
        </div>
      </div>

      <Tabs defaultValue={activeDay.toLowerCase()} onValueChange={setActiveDay} className="w-full">
        <div className="relative">
          <div className="absolute left-0 right-0 h-px bg-border -bottom-px z-10"></div>
          <TabsList className="w-full h-auto flex overflow-x-auto justify-start sm:justify-center p-0 bg-transparent">
            {days.map((day) => (
              <TabsTrigger
                key={day}
                value={day.toLowerCase()}
                className={`flex-1 sm:flex-none px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none transition-all`}
              >
                {day}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {animeSchedule.map((schedule) => (
          <TabsContent key={schedule.day.toLowerCase()} value={schedule.day.toLowerCase()} className="pt-6">
            <div className="grid gap-6">
              {schedule.anime.length > 0 ? (
                schedule.anime.map((anime) => (
                  <Card key={anime.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-48 h-48 sm:h-auto">
                          <Image
                            src={anime.coverImage || "/placeholder.svg"}
                            alt={anime.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <h3 className="text-xl font-bold">{anime.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-primary">{anime.status}</Badge>
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{anime.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-4 line-clamp-2">{anime.description}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {anime.genres.map((genre) => (
                              <Badge key={genre} variant="secondary">
                                {genre}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>22:00 JST</span>
                            </div>
                            <div>Episode {anime.episodes > 0 ? anime.episodes : "TBA"}</div>
                          </div>

                          <div className="flex gap-3">
                            <Button asChild>
                              <Link href={`/anime/${anime.id}`}>Watch Now</Link>
                            </Button>
                            <Button variant="outline">Add to Watchlist</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No anime scheduled for this day.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
