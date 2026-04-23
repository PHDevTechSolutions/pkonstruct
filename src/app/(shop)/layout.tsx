"use client"

import type { ReactNode } from "react"
import { CartProvider } from "@/hooks/use-cart"
import { ShopErrorBoundary } from "@/components/error-boundary"
import { usePageViewTracking } from "@/hooks/use-analytics"

export default function ShopLayout({ children }: { children: ReactNode }) {
  // Track page views for all shop pages
  usePageViewTracking()

  return (
    <ShopErrorBoundary>
      <CartProvider>
        {children}
      </CartProvider>
    </ShopErrorBoundary>
  )
}
