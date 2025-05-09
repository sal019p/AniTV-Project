export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      anime: {
        Row: {
          id: string
          title: string
          description: string
          cover_image: string
          banner_image: string | null
          episodes_count: number
          status: "Airing" | "Completed" | "Upcoming"
          rating: number
          genres: string[]
          release_year: number
          uploaded_by: string | null
          is_featured: boolean
          is_community: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          cover_image: string
          banner_image?: string | null
          episodes_count?: number
          status?: "Airing" | "Completed" | "Upcoming"
          rating?: number
          genres?: string[]
          release_year: number
          uploaded_by?: string | null
          is_featured?: boolean
          is_community?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          cover_image?: string
          banner_image?: string | null
          episodes_count?: number
          status?: "Airing" | "Completed" | "Upcoming"
          rating?: number
          genres?: string[]
          release_year?: number
          uploaded_by?: string | null
          is_featured?: boolean
          is_community?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      anime_episodes: {
        Row: {
          id: string
          anime_id: string
          title: string
          description: string | null
          episode_number: number
          video_url: string
          thumbnail: string | null
          duration: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          anime_id: string
          title: string
          description?: string | null
          episode_number: number
          video_url: string
          thumbnail?: string | null
          duration?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          anime_id?: string
          title?: string
          description?: string | null
          episode_number?: number
          video_url?: string
          thumbnail?: string | null
          duration?: number | null
          created_at?: string
          updated_at?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          anime_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          anime_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          anime_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          username: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          username?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      watchlist: {
        Row: {
          id: string
          user_id: string
          anime_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          anime_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          anime_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
