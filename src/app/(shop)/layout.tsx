"use client"

import type { ReactNode } from "react"
import { CartProvider } from "@/hooks/use-cart"
import { ShopErrorBoundary } from "@/components/error-boundary"
// import { usePageViewTracking } from "@/hooks/use-analytics"

export default function ShopLayout({ children }: { children: ReactNode }) {
  // Page view tracking disabled to save Firebase quota
  // usePageViewTracking()

  return (
    <ShopErrorBoundary>
      <CartProvider>
        <div className="pt-16">
          {children}
        </div>
      </CartProvider>
    </ShopErrorBoundary>
  )
}
