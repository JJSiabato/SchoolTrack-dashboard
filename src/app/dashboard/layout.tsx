"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { useSchoolStore } from "@/store/useSchoolStore"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { AppHeader } from "@/components/layout/AppHeader"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const initializeData = useSchoolStore((state) => state.initializeData)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      initializeData()
    }
  }, [isAuthenticated, router, initializeData])

  if (!isAuthenticated) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-auto bg-muted/30 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
