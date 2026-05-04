"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { ProductCard } from "@/components/shop/product-card"
import { ShopHeader } from "@/components/shop/shop-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowLeft, X, Package, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/types/shop"

// Inner component that uses useSearchParams
function SearchContent() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>
      
      {/* Header */}
      <ShopHeader />

      {/* Search Results */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Results Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-600 animate-pulse" />
              </div>
              <p className="text-gray-500 text-lg">Searching...</p>
            </div>
          ) : queryParam ? (
            <>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-4 py-2 mb-4">
                <Search className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 text-sm font-semibold">Search Results</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Results for &quot;<span className="text-blue-600">{queryParam}</span>&quot;
              </h1>
              <p className="text-gray-500 mt-2">
                <span className="font-bold text-blue-600">{products.length}</span> {products.length === 1 ? 'product' : 'products'} found
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 text-sm font-semibold">Search</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Find Products</h1>
            </>
          )}
        </motion.div>

        {/* Results Grid */}
        {!loading && products.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {!loading && queryParam && products.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn&apos;t find any products matching &quot;<span className="font-semibold text-gray-700">{queryParam}</span>&quot;
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => {
                setSearchQuery("")
                setProducts([])
              }} className="rounded-xl border-2 border-gray-200 hover:border-blue-300">
                <X className="w-4 h-4 mr-2" />
                Clear Search
              </Button>
              <Link href="/shop">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 rounded-xl">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Browse All Products
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Empty State (no search yet) */}
        {!queryParam && !loading && products.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">What are you looking for?</h2>
            <p className="text-gray-500 mb-6">Type in the search bar to find products</p>
            <Link href="/shop">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 rounded-xl">
                <ArrowRight className="w-4 h-4 mr-2" />
                Browse All Products
              </Button>
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  )
}

// Main page component with Suspense wrapper
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
