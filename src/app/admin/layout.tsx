"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebar mobile />
          </SheetContent>
        </Sheet>
        <span className="font-bold text-lg">PKonstruct Admin</span>
        <div className="w-10" />
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          
          <main className="flex-1 p-4 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
