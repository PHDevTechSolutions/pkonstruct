"use client"

import { useWishlist } from "@/hooks/use-wishlist"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Heart, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/hooks/use-cart"
import { useState } from "react"

export default function WishlistPage() {
  const { items, removeFromWishlist, loading } = useWishlist()
  const { addItem } = useCart()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const handleAddToCart = async (item: any) => {
    setAddingToCart(item.productId)
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image || "",
      maxStock: 100,
    })
    setTimeout(() => setAddingToCart(null), 500)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-4">Save items you love for later</p>
            <Link href="/shop">
              <Button className="bg-cyan-600 hover:bg-cyan-700">Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.productId} className="overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
              <CardContent className="p-4">
                <Link href={`/product/${item.productId}`}>
                  <h3 className="font-medium text-gray-900 hover:text-cyan-600 transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-lg font-bold text-cyan-600 mt-2">
                  {formatCurrency(item.price)}
                </p>
                <Button
                  onClick={() => handleAddToCart(item)}
                  disabled={addingToCart === item.productId}
                  className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700"
                  size="sm"
                >
                  {addingToCart === item.productId ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="w-4 h-4 mr-2" />
                  )}
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
