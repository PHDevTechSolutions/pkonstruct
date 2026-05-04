"use client"

import { useState } from "react"
import { useBlogPosts } from "@/hooks/use-blog"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronLeft, ChevronRight, ArrowUpRight, Calendar, User, Tag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import type { PageSection } from "./types"

interface BlogWidgetProps {
  section: PageSection
}

interface LayoutConfig {
  layout: "grid" | "masonry" | "list" | "slider"
  columns: number
  itemsPerPage: number
  showFilters: boolean
}

export function BlogWidget({ section }: BlogWidgetProps) {
  const { posts, loading } = useBlogPosts()
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Parse layout configuration from content
  let layoutConfig: LayoutConfig = {
    layout: "grid",
    columns: 3,
    itemsPerPage: 6,
    showFilters: false
  }
  
  try {
    const contentToParse = typeof section.content === 'string' ? section.content : JSON.stringify(section.content)
    const parsed = JSON.parse(contentToParse || "{}")
    layoutConfig = {
      layout: parsed.layout || "grid",
      columns: parsed.columns || 3,
      itemsPerPage: parsed.itemsPerPage || 6,
      showFilters: parsed.showFilters || false
    }
    console.log("[BlogWidget] Parsed layout config:", layoutConfig, "from content:", typeof section.content === 'string' ? section.content.slice(0, 100) : '[object]')
  } catch (e) {
    console.error("[BlogWidget] Failed to parse content:", e, "Content:", typeof section.content === 'string' ? section.content.slice(0, 100) : '[object]')
    // Use defaults
  }
  
  // Limit posts based on itemsPerPage
  const displayPosts = posts.slice(0, layoutConfig.itemsPerPage)
  
  // Get unique categories for filters
  const categories = [...new Set(posts.map(p => p.category))]
  
  if (loading) return <div className="py-16 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></div>

  // Grid Layout
  if (layoutConfig.layout === "grid") {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    }
    const appliedCols = gridCols[layoutConfig.columns as keyof typeof gridCols] || gridCols[3]
    
    return (
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Modern Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              {section.title && (
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {section.title}
                  </span>
                </h2>
              )}
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
            </div>
            
            <Link href="/blog">
              <Button 
                variant="outline" 
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 rounded-full px-6"
              >
                View All Posts
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
          
          {/* Category Filters */}
          {layoutConfig.showFilters && categories.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              <button className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg">
                All
              </button>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 rounded-full border border-gray-200 hover:border-blue-300"
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}
          
          {/* Modern Grid with Framer Motion */}
          <div className={`grid ${appliedCols} gap-8`}>
            {displayPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.id}`}>
                  <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {post.image ? (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          className="h-full w-full"
                        >
                          <Image 
                            src={post.image} 
                            alt={post.title} 
                            fill 
                            className="object-cover" 
                          />
                        </motion.div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                          <span className="text-blue-400 text-sm font-medium">Blog Image</span>
                        </div>
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 text-xs font-semibold bg-white/90 backdrop-blur-sm text-blue-600 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      
                      {/* Arrow button */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                      >
                        <ArrowUpRight className="w-5 h-5 text-blue-600" />
                      </motion.div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          {post.author}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      {/* Read more link */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                          Read More 
                          <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  // List Layout
  if (layoutConfig.layout === "list") {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Clean Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              {section.title && (
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
              )}
              <div className="w-20 h-1 bg-gray-900 rounded-full" />
            </div>
            
            <Link href="/blog">
              <Button variant="outline" className="border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all rounded-none">
                View All Posts
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-0 max-w-4xl">
            {displayPosts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <div className="group border-b border-gray-200 py-8 first:pt-0 hover:bg-gray-50 transition-colors cursor-pointer -mx-4 px-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="relative h-48 md:h-32 md:w-48 bg-gray-100 flex-shrink-0 overflow-hidden">
                      {post.image ? (
                        <Image 
                          src={post.image} 
                          alt={post.title} 
                          fill 
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-sm">Blog Image</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{post.category}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs text-gray-400">{post.date}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>
                      <div className="mt-4 text-xs text-gray-400">
                        By {post.author}
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <div className="flex items-center justify-center md:justify-end">
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  // Slider Layout
  if (layoutConfig.layout === "slider") {
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % displayPosts.length)
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + displayPosts.length) % displayPosts.length)
    
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Clean Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              {section.title && (
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
              )}
              <div className="w-20 h-1 bg-gray-900 rounded-full" />
            </div>
            
            {/* Navigation */}
            {displayPosts.length > 1 && (
              <div className="flex gap-2">
                <button 
                  onClick={prevSlide} 
                  className="p-3 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={nextSlide} 
                  className="p-3 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {displayPosts.map((post) => (
                <div key={post.id} className="w-full flex-shrink-0 pr-8">
                  <Link href={`/blog/${post.id}`}>
                    <div className="group cursor-pointer bg-white">
                      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                        {post.image ? (
                          <Image 
                            src={post.image} 
                            alt={post.title} 
                            fill 
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400">Blog Image</span>
                          </div>
                        )}
                        <div className="absolute top-4 right-4 w-12 h-12 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <ArrowUpRight className="w-6 h-6 text-gray-900" />
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{post.category}</span>
                          <span className="text-gray-300">|</span>
                          <span className="text-xs text-gray-400">{post.date}</span>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-500 mt-3">{post.excerpt}</p>
                        <div className="mt-4 text-sm text-gray-400">
                          By {post.author}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots */}
          {displayPosts.length > 1 && (
            <div className="flex gap-2 mt-8">
              {displayPosts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1 transition-all duration-300 ${
                    idx === currentSlide ? "w-8 bg-gray-900" : "w-4 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button variant="outline" className="border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all rounded-none">
                View All Posts
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }
  
  // Masonry Layout (default to grid for now)
  // Use columns config to set masonry columns
  const masonryCols = {
    1: "columns-1",
    2: "columns-1 md:columns-2",
    3: "columns-1 md:columns-2 lg:columns-3",
    4: "columns-1 md:columns-2 lg:columns-4",
    5: "columns-1 md:columns-2 lg:columns-3 xl:columns-5"
  }
  const appliedMasonryCols = masonryCols[layoutConfig.columns as keyof typeof masonryCols] || masonryCols[3]
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Clean Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            {section.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
            )}
            <div className="w-20 h-1 bg-gray-900 rounded-full" />
          </div>
          
          <Link href="/blog">
            <Button variant="outline" className="border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all rounded-none">
              View All Posts
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        {/* Masonry Grid */}
        <div className={`${appliedMasonryCols} gap-6 space-y-6`}>
          {displayPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <div className="group cursor-pointer break-inside-avoid mb-6">
                <div className="relative bg-gray-100 overflow-hidden">
                  {post.image ? (
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    />
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">Blog Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 text-gray-900" />
                  </div>
                </div>
                <div className="pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{post.category}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>
                  <div className="mt-3 text-xs text-gray-400">
                    By {post.author}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
