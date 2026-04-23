"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { ProductCard } from "@/components/shop/product-card"
import { ShopHeader } from "@/components/shop/shop-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/types/shop"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get("q") || ""
  
  const [searchQuery, setSearchQuery] = useState(queryParam)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Search products
  const searchProducts = async (term: string) => {
    if (!term.trim()) {
      setProducts([])
      return
    }

    setLoading(true)
    try {
      const q = query(
        collection(db, "products"),
        where("status", "==", "active")
      )
      
      const snapshot = await getDocs(q)
      const allProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]

      // Filter by search term
      const searchTerm = term.toLowerCase()
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.itemCode.toLowerCase().includes(searchTerm) ||
        p.description?.toLowerCase().includes(searchTerm)
      )

      setProducts(filtered)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Initial search from URL
  useEffect(() => {
    if (queryParam) {
      searchProducts(queryParam)
    }
  }, [queryParam])

  // Debounced search for suggestions
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(() => {
      // Generate suggestions from product names
      const terms = searchQuery.toLowerCase().split(" ")
      const matches = products
        .map(p => p.name)
        .filter(name => terms.some(t => name.toLowerCase().includes(t)))
        .slice(0, 5)
      setSuggestions(matches)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, products])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchProducts(searchQuery)
    setShowSuggestions(false)
    
    // Update URL
    const url = new URL(window.location.href)
    url.searchParams.set("q", searchQuery)
    window.history.pushState({}, "", url)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <ShopHeader />

      {/* Search Results */}
      <main className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="mb-6">
          {loading ? (
            <p className="text-gray-500">Searching...</p>
          ) : queryParam ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900">
                Search results for &quot;{queryParam}&quot;
              </h1>
              <p className="text-gray-500 mt-1">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            </>
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">Search Products</h1>
          )}
        </div>

        {/* Results Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && queryParam && products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-500 mb-6">
              We couldn&apos;t find any products matching &quot;{queryParam}&quot;
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => {
                setSearchQuery("")
                setProducts([])
              }}>
                Clear Search
              </Button>
              <Link href="/shop">
                <Button>Browse All Products</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Empty State (no search yet) */}
        {!queryParam && !loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">What are you looking for?</h2>
            <p className="text-gray-500">Type in the search bar to find products</p>
          </div>
        )}
      </main>
    </div>
  )
}
