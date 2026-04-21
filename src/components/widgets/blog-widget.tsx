"use client"

import { useState } from "react"
import { useBlogPosts } from "@/hooks/use-blog"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
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
          
          {/* Category Filters */}
          {layoutConfig.showFilters && categories.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-10">
              <button className="px-4 py-2 text-sm font-medium bg-gray-900 text-white">All</button>
              {categories.map(cat => (
                <button key={cat} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          )}
          
          {/* Minimal Grid */}
          <div className={`grid ${appliedCols} gap-8`}>
            {displayPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <div className="group cursor-pointer">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden mb-4">
                    {post.image ? (
                      <Image 
                        src={post.image} 
                        alt={post.title} 
                        fill 
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-sm">Blog Image</span>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/20 transition-colors duration-300" />
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <ArrowUpRight className="w-5 h-5 text-gray-900" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{post.category}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-xs text-gray-400">{post.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 text-xs text-gray-400">
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
