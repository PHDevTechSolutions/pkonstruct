"use client"

import { useRelatedProducts } from "@/hooks/use-related-products"
import { ProductCard } from "./product-card"

interface RelatedProductsProps {
  productId: string
  categoryIds: string[]
  title?: string
}

export function RelatedProducts({ 
  productId, 
  categoryIds, 
  title = "You May Also Like" 
}: RelatedProductsProps) {
  const { products, loading } = useRelatedProducts(productId, categoryIds)

  if (loading || products.length === 0) {
    return null
  }

  return (
    <section className="py-12 border-t">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
