"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check, Package, Heart } from "lucide-react"
import { useState } from "react"
import type { Product } from "@/types/shop"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
  shopeeStyle?: boolean
}

export function ProductCard({ product, viewMode = "grid", shopeeStyle = false }: ProductCardProps) {
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
      <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white">
        {/* Image */}
        <Link href={`/product/${product.id}`} className="w-28 h-28 flex-shrink-0">
          <div className="w-full h-full bg-gray-100 rounded-md overflow-hidden relative">
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
        <div className="flex-1 flex flex-col min-w-0">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mt-2">
            {isOutOfStock ? (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded font-medium">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">Only {product.quantity} left</span>
            ) : null}
          </div>

          <div className="mt-auto pt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-gray-900">
                ₱{product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-gray-400 line-through">
                  ₱{product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock || added}
              size="sm"
              className={added ? "bg-gray-900" : isOutOfStock ? "" : "bg-gray-900 hover:bg-gray-800"}
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
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Grid View - Black Theme Style
  if (shopeeStyle) {
    // Black Theme Card
    const discountPercent = product.comparePrice 
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0

    return (
      <div className="group bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        {/* Image */}
        <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
          {product.featuredImage || product.images?.[0] ? (
            <Image
              src={product.featuredImage || product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
          )}
          
          {/* Black Theme Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercent > 0 && (
              <span className="px-1.5 py-0.5 bg-gray-900 text-white text-[10px] font-bold rounded-sm">
                -{discountPercent}%
              </span>
            )}
            {isOutOfStock && (
              <span className="px-1.5 py-0.5 bg-gray-500 text-white text-[10px] font-bold rounded-sm">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Like Button */}
          <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
            <Heart className="w-4 h-4 text-gray-500 hover:text-red-500" />
          </button>
        </Link>

        {/* Content - Black Theme */}
        <div className="p-2">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-xs text-gray-800 line-clamp-2 leading-relaxed hover:text-gray-600 transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Price - Black Theme */}
          <div className="mt-1.5">
            <span className="text-[10px] text-gray-900 font-medium">₱</span>
            <span className="text-lg font-bold text-gray-900">
              {product.price.toLocaleString()}
            </span>
          </div>

          {/* Original Price */}
          {product.comparePrice && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 line-through">
                ₱{product.comparePrice.toLocaleString()}
              </span>
            </div>
          )}

          {/* Free Shipping Tag */}
          <div className="flex items-center justify-between mt-2">
            {product.price > 500 && (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-medium rounded-sm">
                Free Shipping
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Clean Minimal Style (Default)
  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-400 transition-colors">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
        {product.featuredImage || product.images?.[0] ? (
          <Image
            src={product.featuredImage || product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}
        
        {/* Minimal Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.comparePrice && (
            <span className="px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded">
              Sale
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded border border-gray-200">
              Out of Stock
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200">
              Low Stock
            </span>
          )}
        </div>

        {/* Quick Add Button - appears on hover */}
        {!isOutOfStock && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleAddToCart()
            }}
            className="absolute bottom-3 right-3 p-2.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-900 hover:text-white"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-1 text-sm">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-base font-semibold text-gray-900">
            ₱{product.price.toFixed(2)}
          </span>
          {product.comparePrice && (
            <span className="text-xs text-gray-400 line-through">
              ₱{product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || added}
          className={`w-full mt-3 rounded-md text-sm ${
            added 
              ? "bg-gray-900" 
              : isOutOfStock 
                ? "" 
                : "bg-gray-900 hover:bg-gray-800"
          }`}
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
  )
}
