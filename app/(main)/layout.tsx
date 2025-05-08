import type React from "react"
import { MainNav } from "@/components/main-nav"
import { BottomNav } from "@/components/bottom-nav"
import { AuthProvider } from "@/hooks/use-auth"
import { SiteFooter } from "@/components/site-footer"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 pt-16 pb-16 md:pb-0">{children}</main>
        <SiteFooter logoUrl="/placeholder.svg?height=60&width=120" bannerUrl="/placeholder.svg?height=200&width=500" />
        <BottomNav />
      </div>
    </AuthProvider>
  )
}
