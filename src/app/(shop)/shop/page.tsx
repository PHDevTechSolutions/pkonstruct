"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { ProductCard } from "@/components/shop/product-card"
import { ShopHeader } from "@/components/shop/shop-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Grid3X3, List, ShoppingBag } from "lucide-react"
import type { Product, Category } from "@/types/shop"

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<string>("newest")

  // Subscribe to products
  useEffect(() => {
    setLoading(true)
    const q = query(
      collection(db, "products"),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]
      setProducts(items)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Subscribe to categories
  useEffect(() => {
    const q = query(
      collection(db, "categories"),
      orderBy("sortOrder", "asc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[]
      setCategories(items)
    })

    return () => unsubscribe()
  }, [])

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.itemCode.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = 
        selectedCategory === "all" || 
        product.categoryIds?.includes(selectedCategory)
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <ShopHeader 
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === "all"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedCategory === category.id
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
          
          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-gray-900 text-white" : "bg-white text-gray-600"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-gray-900 text-white" : "bg-white text-gray-600"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
            {searchQuery && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
