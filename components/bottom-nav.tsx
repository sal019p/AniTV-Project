"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Home, Compass, Upload, User, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function BottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Handle scroll to hide/show the navigation bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      name: "Browse",
      href: "/browse",
      icon: Compass,
      active: pathname === "/browse",
    },
    {
      name: "Schedule",
      href: "/schedule",
      icon: Calendar,
      active: pathname === "/schedule",
    },
    {
      name: "Upload",
      href: "/upload",
      icon: Upload,
      active: pathname === "/upload",
      requiresAuth: true,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
      requiresAuth: true,
    },
  ]

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="bg-gradient-to-t from-background to-background/95 backdrop-blur-sm border-t border-primary/10 pt-2 pb-6">
        <nav className="max-w-md mx-auto px-4">
          <ul className="flex items-center justify-around">
            {navItems.map((item) => {
              // Skip auth-required items if user is not logged in
              if (item.requiresAuth && !user) return null

              return (
                <li key={item.name} className="relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center w-16 py-2 text-muted-foreground transition-colors",
                      item.active && "text-primary",
                    )}
                  >
                    <div className="relative">
                      {item.active && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-primary/10 rounded-full -m-1 w-10 h-10"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <item.icon className="h-5 w-5 relative z-10" />
                    </div>
                    <span className="text-xs mt-1 font-medium">{item.name}</span>
                    {item.active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Safe area for iOS devices */}
      <div className="h-[env(safe-area-inset-bottom)] bg-background" />
    </div>
  )
}
