"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Upload, User, LogOut, Search, Menu, X, Calendar } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export function MainNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { user, logout } = useAuth()

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: <Home className="h-4 w-4 mr-2" />,
      active: pathname === "/",
    },
    {
      href: "/browse",
      label: "Browse",
      icon: <Search className="h-4 w-4 mr-2" />,
      active: pathname === "/browse",
    },
    {
      href: "/schedule",
      label: "Schedule",
      icon: <Calendar className="h-4 w-4 mr-2" />,
      active: pathname === "/schedule",
    },
    {
      href: "/upload",
      label: "Upload",
      icon: <Upload className="h-4 w-4 mr-2" />,
      active: pathname === "/upload",
      requiresAuth: true,
    },
    {
      href: "/profile",
      label: "My Profile",
      icon: <User className="h-4 w-4 mr-2" />,
      active: pathname === "/profile",
      requiresAuth: true,
    },
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleSearch = () => {
    setSearchOpen(!searchOpen)
  }

  return (
    <nav className="bg-card/95 backdrop-blur-sm fixed w-full z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-xl">AniTV</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {searchOpen ? (
              <div className="relative">
                <Input type="text" placeholder="Search anime..." className="w-64 pr-8" autoFocus />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0" onClick={toggleSearch}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={toggleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            )}

            {routes.map((route) => {
              if (route.requiresAuth && !user) return null

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    route.active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Button variant="ghost" className="flex items-center">
                    {route.icon}
                    {route.label}
                  </Button>
                </Link>
              )
            })}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="default">Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleSearch}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {searchOpen && (
              <div className="p-2">
                <Input type="text" placeholder="Search anime..." className="w-full" autoFocus />
              </div>
            )}

            {routes.map((route) => {
              if (route.requiresAuth && !user) return null

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    route.active
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-primary",
                  )}
                  onClick={toggleMobileMenu}
                >
                  <div className="flex items-center">
                    {route.icon}
                    {route.label}
                  </div>
                </Link>
              )
            })}

            {user ? (
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-base font-medium text-muted-foreground hover:bg-secondary hover:text-primary"
                onClick={() => {
                  logout()
                  toggleMobileMenu()
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-secondary hover:text-primary"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
