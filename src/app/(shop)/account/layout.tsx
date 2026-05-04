"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { ShopHeader } from "@/components/shop/shop-header"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2, User, ShoppingBag, Heart, Package, Settings } from "lucide-react"
import Link from "next/link"

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl"
        >
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navItems = [
    { href: "/account/profile", label: "Profile", icon: User },
    { href: "/account/orders", label: "Orders", icon: Package },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>
      
      <ShopHeader />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-4 py-2 mb-4">
              <Settings className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-semibold">My Account</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Manage your profile, orders, and wishlist</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.aside 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-1"
            >
              <nav className="space-y-2 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-4">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-sm transition-all group"
                    >
                      <div className="w-8 h-8 bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600 rounded-lg flex items-center justify-center transition-all">
                        <Icon className="w-4 h-4 text-gray-600 group-hover:text-white" />
                      </div>
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </motion.aside>

            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-3"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
