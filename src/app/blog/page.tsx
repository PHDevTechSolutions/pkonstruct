"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBlogPosts } from "@/hooks/use-blog"
import { Calendar, Clock, ArrowRight, User, Loader2 } from "lucide-react"

const categories = ["All", "Industry Trends", "Tips & Guides", "Education", "Project Stories", "Safety", "Technology"]

const POSTS_PER_PAGE = 6

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const { posts, loading, error } = useBlogPosts(activeCategory === "All" ? undefined : activeCategory)
  
  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }
  
  // Pagination calculations
  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = posts.slice(startIndex, endIndex)
  
  // Generate page numbers array
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
  }

  if (loading) {
    return (
      <main className="flex-1">
        <section className="py-20 bg-stone-900">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white">Blog & Insights</h1>
          </div>
        </section>
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
            <p className="mt-4 text-stone-600">Loading articles...</p>
          </div>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex-1">
        <section className="py-20 bg-stone-900">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white">Blog & Insights</h1>
          </div>
        </section>
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4 text-center">
            <p className="text-red-600">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Blog & Insights
          </h1>
          <div className="w-20 h-1 bg-white rounded-full mb-4" />
          <p className="text-gray-400 text-lg max-w-2xl">
            Stay updated with the latest industry trends, project stories, and expert advice.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === category 
                    ? "bg-gray-900 text-white" 
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No articles found in this category.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug || post.id}`}>
                <div className="group border border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white cursor-pointer">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 font-medium">Blog Image</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-gray-900 text-white text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3 font-mono">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-400">{post.author}</span>
                      <span className="text-sm text-gray-900 flex items-center gap-1">
                        Read <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-50"
              >
                Previous
              </button>
              
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`px-4 py-2 transition-all ${
                      currentPage === page 
                        ? "bg-gray-900 text-white" 
                        : "border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
