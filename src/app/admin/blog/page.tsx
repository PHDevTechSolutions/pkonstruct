"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useBlogPosts } from "@/hooks/use-blog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Eye, Search, FileText, Terminal, ArrowUpRight, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/firebase"
import { doc, deleteDoc } from "firebase/firestore"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

export default function BlogManagementPage() {
  const { posts, loading, error } = useBlogPosts()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  
  // Search, Filter, and Pagination states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "scheduled">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Get unique categories
  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))]

  const handleDelete = async () => {
    if (!deleteId) return
    
    setDeleting(true)
    try {
      await deleteDoc(doc(db, "blogPosts", deleteId))
      setDeleteId(null)
      // Refresh the page to show updated list
      window.location.reload()
    } catch (err) {
      console.error("Error deleting post:", err)
      alert("Failed to delete post")
    } finally {
      setDeleting(false)
    }
  }

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={cn("space-y-6 transition-all duration-500", mounted ? "opacity-100" : "opacity-0")}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30">
              <FileText className="h-5 w-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          </div>
          <p className="text-gray-500 font-mono text-sm">// Manage your blog content</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#111111] rounded-xl border border-[#222222]">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search posts by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10 bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "all" | "published" | "draft" | "scheduled")
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-gray-300 focus:border-cyan-500/50 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-gray-300 focus:border-cyan-500/50 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
              <Skeleton className="h-6 w-1/3 mb-2 bg-[#222222]" />
              <Skeleton className="h-4 w-full bg-[#222222]" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-[#111111] border border-red-500/30 p-6">
          <div className="flex items-center gap-3 text-red-400">
            <Terminal className="h-5 w-5" />
            <span className="font-mono">Error: Failed to load blog posts</span>
          </div>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="rounded-2xl bg-[#111111] border border-[#222222] p-8 text-center">
          <div className="p-4 bg-[#1a1a1a] rounded-full w-fit mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-500" />
          </div>
          <p className="text-gray-400 mb-4 font-mono">// No blog posts found</p>
          <Link href="/admin/blog/new">
            <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
              Create your first post
            </Button>
          </Link>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <>
        {(() => {
          // Filter posts
          const filteredPosts = posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
            // Determine post status (use new status field or fallback to published boolean)
            const postStatus = post.status || (post.published ? "published" : "draft")
            const matchesStatus = statusFilter === "all" || postStatus === statusFilter
            const matchesCategory = categoryFilter === "all" || post.category === categoryFilter
            return matchesSearch && matchesStatus && matchesCategory
          })
          
          // Pagination
          const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
          const paginatedPosts = filteredPosts.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )
          
          return (
            <>
              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 font-mono">
                  // Showing {paginatedPosts.length} of {filteredPosts.length} posts
                </p>
              </div>
              
              <div className="space-y-3">
                {paginatedPosts.map((post, index) => (
                  <div 
                    key={post.id} 
                    className="group rounded-2xl bg-[#111111] border border-[#222222] p-5 hover:border-[#333333] transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-semibold text-lg text-white group-hover:text-cyan-400 transition-colors">{post.title}</h3>
                          {(() => {
                            const postStatus = post.status || (post.published ? "published" : "draft")
                            const isScheduledLive = postStatus === "scheduled" && post.scheduledAt && new Date(post.scheduledAt) <= new Date()
                            
                            const statusStyles = {
                              published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                              draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
                              scheduled: isScheduledLive 
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/30" 
                                : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                            }
                            
                            if (postStatus === "scheduled") {
                              return (
                                <div className="flex items-center gap-2">
                                  <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", statusStyles.scheduled)}>
                                    {isScheduledLive ? "Live" : "Scheduled"}
                                  </span>
                                  {!isScheduledLive && post.scheduledAt && (
                                    <span className="text-xs text-gray-500 font-mono">
                                      {new Date(post.scheduledAt).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              )
                            }
                            return (
                              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", statusStyles[postStatus as keyof typeof statusStyles])}>
                                {postStatus}
                              </span>
                            )
                          })()}
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 font-mono">
                          <span className="px-2 py-1 bg-[#1a1a1a] rounded">{post.category}</span>
                          <span className="text-gray-600">•</span>
                          <span>{post.author}</span>
                          <span className="text-gray-600">•</span>
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link href={`/blog/${post.id}`} target="_blank">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/blog/edit/${post.id}`}>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-gray-500 hover:text-amber-400 hover:bg-amber-500/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => setDeleteId(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222] hover:border-[#444444] disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500 font-mono px-3 py-1 bg-[#111111] rounded-lg border border-[#222222]">
                    Page {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222] hover:border-[#444444] disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )
        })()}
        </>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#111111] border-[#333333] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-400" />
              Delete Blog Post
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#1a1a1a] border-[#333333] text-gray-300 hover:bg-[#222222] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 hover:text-red-300"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
