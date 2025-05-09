import type React from "react"
import { MainNav } from "@/components/main-nav"
import { BottomNav } from "@/components/bottom-nav"
import { AuthProvider } from "@/hooks/use-auth"
import { SiteFooter } from "@/components/site-footer"
import { Toaster } from "@/components/ui/toaster"

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
        <SiteFooter />
        <BottomNav />
        <Toaster />
      </div>
    </AuthProvider>
  )
}
