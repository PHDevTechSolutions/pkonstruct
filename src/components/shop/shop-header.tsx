"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CartButton } from "./cart-button"
import { User, LogOut, Package, Heart, ChevronDown, ShoppingBag, Search } from "lucide-react"

interface ShopHeaderProps {
  showSearch?: boolean
  searchQuery?: string
  onSearchChange?: (value: string) => void
}

export function ShopHeader({ 
  showSearch = false, 
  searchQuery = "", 
  onSearchChange 
}: ShopHeaderProps) {
  const { user, logout } = useAuth()
  const { profile } = useUserProfile()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const userDisplayName = profile?.firstName || user?.displayName || user?.email?.split('@')[0] || "User"

  return (
    <header className="sticky top-0 z-40 bg-gray-900">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/shop" className="flex items-center gap-2 text-xl font-bold text-white hover:text-gray-300 transition-colors">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-gray-900" />
            </div>
            <span className="hidden sm:block">PKonstruct</span>
          </Link>

          {/* Search - optional */}
          {showSearch && onSearchChange && (
            <div className="flex-1 max-w-2xl relative hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, brands, and more..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-4 pr-12 py-2.5 rounded-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 border border-gray-700"
                />
                <button className="absolute right-1 top-1 bottom-1 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-sm transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <CartButton />

            {/* User Actions */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">
                      {userDisplayName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white border-gray-200 shadow-xl">
                  {/* User Info Header */}
                  <div className="px-4 py-3 bg-gray-900 text-white rounded-t-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{userDisplayName}</p>
                        <p className="text-xs text-gray-300 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <DropdownMenuItem 
                      onClick={() => window.location.href = '/account/orders'}
                      className="px-4 py-2.5 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                    >
                      <Package className="w-4 h-4 mr-3 text-gray-600" />
                      <span className="text-sm text-gray-700">My Orders</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => window.location.href = '/account/wishlist'}
                      className="px-4 py-2.5 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                    >
                      <Heart className="w-4 h-4 mr-3 text-gray-600" />
                      <span className="text-sm text-gray-700">Wishlist</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => window.location.href = '/account/profile'}
                      className="px-4 py-2.5 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                    >
                      <User className="w-4 h-4 mr-3 text-gray-600" />
                      <span className="text-sm text-gray-700">Profile</span>
                    </DropdownMenuItem>
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-100" />
                  
                  {/* Sign Out */}
                  <div className="py-1">
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="px-4 py-2.5 cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
