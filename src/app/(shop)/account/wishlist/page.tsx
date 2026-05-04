"use client"

import { useWishlist } from "@/hooks/use-wishlist"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Heart, ShoppingCart, Trash2, Sparkles, ArrowRight } from "lucide-react"
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
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl"
        >
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/25">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="shadow-lg shadow-gray-200/50 border border-gray-100">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-12 h-12 text-pink-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-6">Save items you love for later</p>
              <Link href="/shop">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 rounded-xl">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:border-pink-200 transition-all group">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {(item as any).image ? (
                    <Image
                      src={(item as any).image}
                      alt={(item as any).name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                      <Heart className="w-12 h-12 text-pink-400" />
                    </div>
                  )}
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="absolute top-3 right-3 p-2.5 bg-white rounded-xl shadow-lg hover:bg-red-50 hover:shadow-xl transition-all group/delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-500 group-hover/delete:scale-110 transition-transform" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <Link href={`/product/${item.productId}`}>
                    <h3 className="font-bold text-gray-900 hover:text-pink-600 transition-colors line-clamp-2">
                      {(item as any).name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-pink-600 mt-2">
                    {formatCurrency((item as any).price)}
                  </p>
                  <Button
                    onClick={() => handleAddToCart(item)}
                    disabled={addingToCart === item.productId}
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 rounded-xl font-semibold"
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
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
