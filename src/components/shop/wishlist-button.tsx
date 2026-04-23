"use client"

import { Heart } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useWishlist } from "@/hooks/use-wishlist"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function WishlistButton({ 
  productId, 
  variant = "ghost", 
  size = "icon",
  className 
}: WishlistButtonProps) {
  const { user } = useAuth()
  const { isInWishlist, toggleWishlist, loading } = useWishlist(user?.uid)
  
  const inWishlist = isInWishlist(productId)

  return (
    <Button
      variant={variant}
      size={size}
      disabled={loading}
      onClick={() => toggleWishlist(productId)}
      className={cn(
        "transition-all duration-200",
        inWishlist && "text-red-500 hover:text-red-600",
        className
      )}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={cn(
          "w-5 h-5 transition-all",
          inWishlist && "fill-current"
        )} 
      />
    </Button>
  )
}

// Smaller version for product cards
export function WishlistIcon({ productId, className }: { productId: string; className?: string }) {
  const { user } = useAuth()
  const { isInWishlist, toggleWishlist } = useWishlist(user?.uid)
  
  const inWishlist = isInWishlist(productId)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(productId)
      }}
      className={cn(
        "p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all",
        inWishlist ? "text-red-500" : "text-gray-400 hover:text-red-400",
        className
      )}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={cn(
          "w-4 h-4",
          inWishlist && "fill-current"
        )} 
      />
    </button>
  )
}
