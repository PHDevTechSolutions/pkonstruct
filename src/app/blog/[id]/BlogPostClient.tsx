"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useBlogPost, useBlogPosts } from "@/hooks/use-blog"
import { ArrowLeft, Calendar, Clock, User, Loader2 } from "lucide-react"

interface BlogPostClientProps {
  idOrSlug: string
}

export function BlogPostClient({ idOrSlug }: BlogPostClientProps) {
  const { post, loading, error } = useBlogPost(idOrSlug)
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
    <main className="flex-1 bg-white">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/blog"
            className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors text-sm font-mono"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-medium mb-4 font-mono">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="w-20 h-1 bg-gray-900 rounded-full mb-6" />
            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm font-mono">
              <span>{post.author}</span>
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-64 md:h-96 bg-gray-100 mb-8 border border-gray-200">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 font-medium">Featured Image</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Gallery Images */}
          {post.gallery && post.gallery.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {post.gallery.map((img, index) => (
                  <div key={index} className="aspect-video bg-gray-100 border border-gray-200">
                    <img
                      src={img}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8">
              <div className="border-t border-gray-200 pt-6 mb-6" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 border border-gray-200 text-gray-600 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Box */}
          <div className="mt-12 border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{post.author}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Construction industry expert with years of experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                  <div className="group border border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white cursor-pointer">
                    <div className="relative h-40 bg-gray-100 overflow-hidden">
                      {relatedPost.image ? (
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 font-medium text-sm">Blog Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-gray-400 font-mono">{relatedPost.category}</span>
                      <h3 className="font-semibold text-gray-900 mt-1">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">{relatedPost.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
