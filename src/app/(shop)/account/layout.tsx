"use client"

import type { ReactNode } from "react"
import { ShopHeader } from "@/components/shop/shop-header"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/account/profile")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="md:col-span-1">
              <nav className="space-y-1">
                <a
                  href="/account/profile"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-white hover:shadow-sm transition-all"
                >
                  Profile
                </a>
                <a
                  href="/account/orders"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-white hover:shadow-sm transition-all"
                >
                  Orders
                </a>
                <a
                  href="/account/wishlist"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-white hover:shadow-sm transition-all"
                >
                  Wishlist
                </a>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="md:col-span-3">{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
