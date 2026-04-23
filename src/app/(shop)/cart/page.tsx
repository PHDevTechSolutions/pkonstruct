"use client"

import { useCart } from "@/hooks/use-cart"
import { ShopHeader } from "@/components/shop/shop-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  Package
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shippingFee, total, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <ShopHeader />

        {/* Empty Cart */}
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet</p>
          <Link href="/shop">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800">
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <ShopHeader />

      {/* Cart Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div 
                key={`${item.productId}-${item.variant}`} 
                className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                {/* Image */}
                <div className="w-24 h-24 bg-white rounded-md overflow-hidden relative flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  {item.variant && (
                    <p className="text-sm text-gray-500">{item.variant}</p>
                  )}
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    ${item.price.toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant)}
                        className="px-3 py-2 hover:bg-gray-100 rounded-l-lg"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <Input
                        type="number"
                        min="1"
                        max={item.maxStock}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(
                          item.productId, 
                          Math.max(1, Math.min(item.maxStock, parseInt(e.target.value) || 1)),
                          item.variant
                        )}
                        className="w-16 text-center border-0 focus-visible:ring-0"
                      />
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant)}
                        className="px-3 py-2 hover:bg-gray-100 rounded-r-lg"
                        disabled={item.quantity >= item.maxStock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.variant)}
                      className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                {shippingFee === 0 && subtotal > 0 && (
                  <p className="text-sm text-green-600">You got free shipping!</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-lg py-6">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <p className="text-xs text-gray-500 text-center mt-4">
                Shipping & taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
