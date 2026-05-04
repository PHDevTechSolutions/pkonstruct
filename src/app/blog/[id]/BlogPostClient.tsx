"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useBlogPost, useBlogPosts } from "@/hooks/use-blog"
import { ArrowLeft, Calendar, Clock, User, Loader2, ArrowRight, Sparkles, Tag, ChevronLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BlogPostClientProps {
  idOrSlug: string
}

export function BlogPostClient({ idOrSlug }: BlogPostClientProps) {
  const { post, loading, error } = useBlogPost(idOrSlug)
  const { posts: allPosts } = useBlogPosts()

  if (loading) {
    return (
      <main className="flex-1 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
        <div className="container mx-auto px-4 py-32 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <Loader2 className="h-12 w-12 mx-auto text-blue-600" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600 text-lg"
          >
            Loading article...
          </motion.p>
        </div>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="flex-1 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
        <div className="container mx-auto px-4 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 mb-6 text-lg">{error || "Article not found"}</p>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg transition-all rounded-full px-6"
              asChild
            >
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </motion.div>
        </div>
      </main>
    )
  }

  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 2)

  return (
    <main className="flex-1">
      {/* Hero Section with Featured Image */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          {post.image ? (
            <>
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" />
          )}
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-16">
          <div className="container mx-auto px-4 py-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="/blog"
                className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm font-medium backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 border border-white/20 hover:bg-white/20"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Blog
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                <Tag className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm font-medium">{post.category}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <article className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg prose-gray max-w-none"
          >
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </motion.div>

          {/* Gallery Images */}
          {post.gallery && post.gallery.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {post.gallery.map((img, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="aspect-video rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <img
                      src={img}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <div className="border-t border-gray-200 pt-8 mb-6" />
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-sm font-medium rounded-full border border-blue-100 hover:border-blue-300 transition-all cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Author Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">{post.author}</h3>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  Construction industry expert with years of experience. Passionate about sharing knowledge and insights to help others succeed in their projects.
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <span>View all posts</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 border-t border-gray-200">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          </div>
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-3"
            >
              <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </span>
              Related Articles
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/blog/${relatedPost.id}`}>
                    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        {relatedPost.image ? (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="h-full w-full"
                          >
                            <img
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                            <span className="text-blue-400 font-medium text-sm">Blog Image</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-semibold rounded-full">
                            {relatedPost.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{relatedPost.excerpt}</p>
                        <div className="mt-4 flex items-center text-sm font-semibold text-blue-600">
                          Read More 
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
