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
import { User, LogOut, Package, Heart, ChevronDown, ShoppingBag } from "lucide-react"

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
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/shop" className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-cyan-600 transition-colors">
            <ShoppingBag className="w-6 h-6 text-cyan-600" />
            <span>PKonstruct Shop</span>
          </Link>

          {/* Search - optional */}
          {showSearch && onSearchChange && (
            <div className="flex-1 max-w-xl relative hidden md:block">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
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
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-cyan-600" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">
                      {userDisplayName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{userDisplayName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  
                  <DropdownMenuItem onClick={() => window.location.href = '/account/orders'}>
                    <Package className="w-4 h-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => window.location.href = '/account/wishlist'}>
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => window.location.href = '/account/profile'}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  
                  <div className="border-t my-1" />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
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
