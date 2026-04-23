"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check, Package } from "lucide-react"
import { useState } from "react"
import type { Product } from "@/types/shop"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.featuredImage || product.images?.[0] || "",
      maxStock: product.quantity,
    })
    
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const isOutOfStock = product.quantity === 0 || product.status === "out_of_stock"
  const isLowStock = product.quantity <= product.lowStockThreshold && product.quantity > 0

  if (viewMode === "list") {
    return (
      <div className="flex gap-6 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
        {/* Image */}
        <Link href={`/product/${product.id}`} className="w-32 h-32 flex-shrink-0">
          <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden relative">
            {product.featuredImage || product.images?.[0] ? (
              <Image
                src={product.featuredImage || product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <Package className="w-8 h-8 text-gray-400 absolute inset-0 m-auto" />
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium text-gray-900 hover:text-cyan-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mt-2">
            {isOutOfStock ? (
              <span className="text-sm text-red-500 font-medium">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-sm text-yellow-600">Only {product.quantity} left</span>
            ) : null}
          </div>

          <div className="mt-auto pt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock || added}
              size="sm"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Added
                </>
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Grid View
  return (
    <div className="group border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gray-100">
        {product.featuredImage || product.images?.[0] ? (
          <Image
            src={product.featuredImage || product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.comparePrice && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
              Sale
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded">
              Out of Stock
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
              Low Stock
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 group-hover:text-cyan-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || added}
          className="w-full mt-3"
          size="sm"
        >
          {added ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Added to Cart
            </>
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
