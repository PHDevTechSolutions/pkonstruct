"use client"

import { useState } from "react"
import { useBlogPosts } from "@/hooks/use-blog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
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
    console.log("[BlogWidget] Rendering GRID layout with", layoutConfig.columns, "columns. Applied class:", appliedCols)
    
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {section.title && <h2 className="text-3xl font-bold mb-12 text-center text-foreground">{section.title}</h2>}
          
          {/* Category Filters */}
          {layoutConfig.showFilters && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">All</Button>
              {categories.map(cat => (
                <Button key={cat} variant="outline" size="sm">{cat}</Button>
              ))}
            </div>
          )}
          
          <div className={`grid ${appliedCols} gap-6`}>
            {displayPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow bg-card">
                <div className="relative h-48 bg-muted">
                  {post.image ? (
                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/70">
                      <span className="text-muted-foreground">Blog Image</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <span className="text-xs font-medium text-primary uppercase">{post.category}</span>
                  <h3 className="font-semibold mt-1 line-clamp-2 text-card-foreground">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground/70">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline">View All Posts</Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }
  
  // List Layout
  if (layoutConfig.layout === "list") {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {section.title && <h2 className="text-3xl font-bold mb-12 text-center text-foreground">{section.title}</h2>}
          <div className="space-y-4 max-w-4xl mx-auto">
            {displayPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow bg-card">
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-48 md:h-auto md:w-64 bg-muted flex-shrink-0">
                    {post.image ? (
                      <Image src={post.image} alt={post.title} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted/70">
                        <span className="text-muted-foreground">Blog Image</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 flex-1">
                    <span className="text-xs font-medium text-primary uppercase">{post.category}</span>
                    <h3 className="font-semibold text-lg mt-1 text-card-foreground">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground/70">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline">View All Posts</Button>
            </Link>
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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {section.title && <h2 className="text-3xl font-bold mb-12 text-center text-foreground">{section.title}</h2>}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {displayPosts.map((post) => (
                  <div key={post.id} className="w-full flex-shrink-0">
                    <Card className="overflow-hidden bg-card">
                      <div className="relative h-64 md:h-96 bg-muted">
                        {post.image ? (
                          <Image src={post.image} alt={post.title} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted/70">
                            <span className="text-muted-foreground">Blog Image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-foreground">
                          <span className="text-xs font-medium text-primary uppercase">{post.category}</span>
                          <h3 className="font-semibold text-xl mt-1">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                            <span>{post.author}</span>
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation */}
            {displayPosts.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 hover:bg-background shadow-lg border border-border">
                  <ChevronLeft className="h-6 w-6 text-foreground" />
                </button>
                <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 hover:bg-background shadow-lg border border-border">
                  <ChevronRight className="h-6 w-6 text-foreground" />
                </button>
                <div className="flex justify-center gap-2 mt-4">
                  {displayPosts.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentSlide ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline">View All Posts</Button>
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
  console.log("[BlogWidget] Rendering MASONRY (default) layout with", layoutConfig.columns, "columns. Layout value was:", layoutConfig.layout, "Applied class:", appliedMasonryCols)
  
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-12 text-center text-foreground">{section.title}</h2>}
        <div className={`${appliedMasonryCols} gap-6 space-y-6`}>
          {displayPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow break-inside-avoid bg-card">
              <div className="relative h-48 bg-muted">
                {post.image ? (
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/70">
                    <span className="text-muted-foreground">Blog Image</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <span className="text-xs font-medium text-primary uppercase">{post.category}</span>
                <h3 className="font-semibold mt-1 line-clamp-2 text-card-foreground">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground/70">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/blog">
            <Button variant="outline">View All Posts</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
