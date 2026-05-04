"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { ProductCard } from "@/components/shop/product-card"
import { ShopHeader } from "@/components/shop/shop-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Grid3X3, 
  List, 
  ShoppingBag, 
  ChevronDown, 
  TrendingUp,
  Zap,
  Truck,
  Percent,
  Tag,
  Star,
  Flame,
  Clock,
  Package
} from "lucide-react"
import Image from "next/image"
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

  // Shopee-style category icons
  const categoryIcons: Record<string, typeof Package> = {
    all: Package,
    tools: Tag,
    materials: Truck,
    equipment: Zap,
    safety: Star,
    electrical: Flame,
    plumbing: TrendingUp,
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sleek Black Header */}
      <header className="bg-gray-900 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 text-white"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-gray-900" />
              </div>
              <span className="text-xl font-bold hidden sm:block">PKonstruct</span>
            </motion.div>

            {/* Big Search Bar - Dark Style */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, brands, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2.5 rounded-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 border border-gray-700"
                />
                <button className="absolute right-1 top-1 bottom-1 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-sm transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Icon */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-white"
            >
              <ShoppingBag className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content - Shopee Style */}
      <main className="container mx-auto px-4 py-4">
        {/* Category Icons - Black Theme */}
        {categories.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-white rounded-lg p-4 shadow-sm"
          >
            <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory("all")}
                className="flex flex-col items-center gap-2 min-w-[70px]"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  selectedCategory === "all" 
                    ? "bg-gray-900 text-white shadow-lg shadow-gray-900/30" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                  <Package className="w-6 h-6" />
                </div>
                <span className={`text-xs font-medium ${selectedCategory === "all" ? "text-gray-900" : "text-gray-600"}`}>
                  All
                </span>
              </button>
              
              {categories.map((category, index) => {
                const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || Tag
                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex flex-col items-center gap-2 min-w-[70px]"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      selectedCategory === category.id 
                        ? "bg-gray-900 text-white shadow-lg shadow-gray-900/30" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-medium text-center leading-tight ${selectedCategory === category.id ? "text-gray-900" : "text-gray-600"}`}>
                      {category.name}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Featured Banner - Black Theme */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 rounded-lg p-4 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6" />
                <span className="text-xl font-bold">Featured Products</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm bg-white/20 rounded px-3 py-1">
                <Clock className="w-4 h-4" />
                <span>Limited Time Offers</span>
              </div>
            </div>
            <button className="text-sm font-medium hover:underline">
              See All &gt;
            </button>
          </div>
        </motion.div>

        {/* Sort & Filter Bar - Black Theme */}
        <div className="flex items-center justify-between mb-4 bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Sort by:</span>
            <div className="flex gap-1">
              {["popular", "newest", "price-low", "price-high"].map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${
                    sortBy === sort
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {sort === "popular" && "Popular"}
                  {sort === "newest" && "Newest"}
                  {sort === "price-low" && "Price: Low"}
                  {sort === "price-high" && "Price: High"}
                </button>
              ))}
            </div>
          </div>
          
          <p className="text-gray-500 text-sm">
            <span className="text-gray-900 font-semibold">{filteredProducts.length}</span> items
          </p>
        </div>

        {/* Products Grid - Black Theme */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="animate-spin h-10 w-10 border-4 border-gray-900 border-t-transparent rounded-full" />
              <span className="text-gray-500">Loading products...</span>
            </motion.div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <ProductCard 
                  product={product} 
                  viewMode="grid"
                  shopeeStyle={true}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-lg"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm mb-4">Try different keywords or filters</p>
            <Button 
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  )
}
