"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { 
  collection, 
  query, 
  where,
  limit,
  getDocs,
  documentId,
} from "firebase/firestore"
import type { Product } from "@/types/shop"

export function useRelatedProducts(
  productId: string, 
  categoryIds: string[], 
  maxResults = 4
) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!productId || categoryIds.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    const fetchRelated = async () => {
      setLoading(true)
      try {
        // Get products from same categories, excluding current product
        const q = query(
          collection(db, "products"),
          where("status", "==", "active"),
          where("categoryIds", "array-contains-any", categoryIds),
          limit(maxResults + 1) // +1 to account for possibly including current product
        )

        const snapshot = await getDocs(q)
        const related = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Product))
          .filter(p => p.id !== productId) // Exclude current product
          .slice(0, maxResults)

        setProducts(related)
      } catch (err) {
        console.error("Error fetching related products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [productId, categoryIds, maxResults])

  return { products, loading }
}

// Hook for frequently bought together (would need order history)
export function useFrequentlyBoughtTogether(productId: string, maxResults = 3) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This would ideally analyze order history
    // For now, return random products from same category
    setLoading(false)
  }, [productId])

  return { products, loading }
}
