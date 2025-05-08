import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface FooterProps {
  className?: string
  logoUrl?: string
  bannerUrl?: string
}

export function SiteFooter({ className, logoUrl, bannerUrl }: FooterProps) {
  // Default logo and banner if not provided
  const defaultLogo = "/placeholder.svg?height=60&width=120"
  const defaultBanner = "/placeholder.svg?height=200&width=1200"

  // Use provided URLs or defaults
  const logo = logoUrl || defaultLogo
  const banner = bannerUrl || defaultBanner

  return (
    <footer className={cn("bg-card/95 py-4 border-t", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center">
          <p className="text-sm flex items-center">
            Crafted with <Heart className="h-4 w-4 text-primary mx-1 fill-primary animate-pulse" /> by
            <span className="font-semibold ml-1">MD SALMAN ❤️‍🩹</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
