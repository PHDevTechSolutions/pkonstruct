"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CartButton() {
  const { items, totalItems, subtotal, updateQuantity, removeItem } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-white text-xs rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg bg-white">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-[calc(100vh-200px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
              <p>Your cart is empty</p>
              <p className="text-sm mt-1">Add some products!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-auto space-y-4 pr-2">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variant}`} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    {/* Image */}
                    <div className="w-20 h-20 bg-white rounded-md overflow-hidden relative flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                      {item.variant && (
                        <p className="text-sm text-gray-500">{item.variant}</p>
                      )}
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        ${item.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant)}
                          className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant)}
                          className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                          disabled={item.quantity >= item.maxStock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => removeItem(item.productId, item.variant)}
                          className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <p className="text-sm text-gray-500">
                  Shipping and taxes calculated at checkout
                </p>

                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gray-900 hover:bg-gray-800">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
