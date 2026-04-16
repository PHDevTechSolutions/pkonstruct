"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBlogPosts } from "@/hooks/use-blog"
import { Calendar, Clock, ArrowRight, User, Loader2 } from "lucide-react"

const categories = ["All", "Industry Trends", "Tips & Guides", "Education", "Project Stories", "Safety", "Technology"]

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const { posts, loading, error } = useBlogPosts(activeCategory === "All" ? undefined : activeCategory)

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
      <section className="py-20 bg-stone-900">
        <div className="container mx-auto px-4 text-center">
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">Blog & Insights</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Construction Insights & News
          </h1>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto">
            Stay updated with the latest industry trends, project stories, and expert advice from the PKonstruct team.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                className={activeCategory === category ? "bg-amber-600 hover:bg-amber-700" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-600">No articles found in this category.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/blog/${post.id}`}>
                  <div className="relative h-48 bg-stone-200">
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-300">
                      <span className="text-stone-500 font-medium">Blog Image</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-amber-600 text-white text-sm font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                </Link>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4 text-sm text-stone-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <Link href={`/blog/${post.id}`} className="hover:text-amber-600 transition-colors">
                    <h2 className="text-xl font-bold text-stone-900">
                      {post.title}
                    </h2>
                  </Link>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700" asChild>
                      <Link href={`/blog/${post.id}`}>
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="default" size="sm" className="bg-amber-600">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </section>
    </main>
  )
}
