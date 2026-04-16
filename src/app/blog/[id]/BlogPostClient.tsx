"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useBlogPost, useBlogPosts } from "@/hooks/use-blog"
import { ArrowLeft, Calendar, Clock, User, Share2, MessageCircle, Loader2 } from "lucide-react"

interface BlogPostClientProps {
  id: string
}

export function BlogPostClient({ id }: BlogPostClientProps) {
  const { post, loading, error } = useBlogPost(id)
  const { posts: allPosts } = useBlogPosts()

  if (loading) {
    return (
      <main className="flex-1">
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
          <p className="mt-4 text-stone-600">Loading article...</p>
        </div>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="flex-1">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-red-600">{error || "Article not found"}</p>
          <Button className="mt-4" asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </main>
    )
  }

  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 2)

  return (
    <main className="flex-1">
      {/* Back Navigation */}
      <div className="bg-stone-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>

      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-stone-500">
              <span className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {post.readTime}
              </span>
            </div>
          </div>

          {/* Featured Image Placeholder */}
          <div className="relative h-64 md:h-96 bg-stone-200 rounded-xl mb-8">
            <div className="absolute inset-0 flex items-center justify-center bg-stone-300 rounded-xl">
              <span className="text-stone-500 font-medium">Featured Image</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-stone max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8">
              <Separator className="mb-6" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-stone-100 text-stone-600 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <Separator className="my-8" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-stone-600 font-medium">Share this article:</span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Author Box */}
          <Card className="mt-12">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                  <User className="h-8 w-8 text-stone-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{post.author}</h3>
                  <p className="text-stone-600 text-sm mt-1">
                    Construction industry expert with years of experience in building and project management.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-stone-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <span className="text-amber-600 text-sm font-medium">{relatedPost.category}</span>
                    <h3 className="font-bold text-lg mt-2 mb-3">
                      <Link href={`/blog/${relatedPost.id}`} className="hover:text-amber-600 transition-colors">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-stone-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
