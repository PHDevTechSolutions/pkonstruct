"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Sparkles } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"
  const isRegisterPage = pathname === "/admin/register"
  const isAuthPage = isLoginPage || isRegisterPage

  useEffect(() => {
    // Only redirect if not on auth pages and not authenticated
    if (!loading && !user && !isAuthPage) {
      router.push("/admin/login")
    }
  }, [user, loading, router, isAuthPage])

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-amber-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  // For auth pages (login/register), render children without admin wrapper
  if (isAuthPage) {
    return children
  }

  // For other admin pages, require authentication
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Mobile Sidebar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#111111] border-b border-[#222222]">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#222222]">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-[#111111] border-r-[#222222]">
            <AdminSidebar mobile />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            PKonstruct AI
          </span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          {/* Top Bar */}
          <header className="h-16 bg-[#111111]/80 backdrop-blur-xl border-b border-[#222222] flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-mono">pkonstruct@admin:~$</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] rounded-full border border-[#333333]">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-400 font-mono">System Online</span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8 overflow-auto bg-[#0a0a0a]">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
