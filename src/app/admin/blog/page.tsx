"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useBlogPosts } from "@/hooks/use-blog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Eye, Search } from "lucide-react"
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Blog Posts</h2>
          <p className="text-stone-500">Manage your blog content</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search posts by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "all" | "published" | "draft" | "scheduled")
              setCurrentPage(1)
            }}
            className="px-3 py-2 border border-stone-200 rounded-md text-sm bg-white"
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
              className="px-3 py-2 border border-stone-200 rounded-md text-sm bg-white"
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
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="p-6 text-red-600">
            Failed to load blog posts
          </CardContent>
        </Card>
      )}

      {!loading && !error && posts.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-stone-500 mb-4">No blog posts yet</p>
            <Link href="/admin/blog/new">
              <Button variant="outline">Create your first post</Button>
            </Link>
          </CardContent>
        </Card>
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
                <p className="text-sm text-stone-500">
                  Showing {paginatedPosts.length} of {filteredPosts.length} posts
                </p>
              </div>
              
              <div className="space-y-4">
                {paginatedPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      {(() => {
                        const postStatus = post.status || (post.published ? "published" : "draft")
                        const isScheduledLive = postStatus === "scheduled" && post.scheduledAt && new Date(post.scheduledAt) <= new Date()
                        
                        if (postStatus === "scheduled") {
                          return (
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="border-amber-500 text-amber-600">
                                {isScheduledLive ? "Scheduled (Live)" : "Scheduled"}
                              </Badge>
                              {!isScheduledLive && post.scheduledAt && (
                                <span className="text-xs text-stone-500">
                                  {new Date(post.scheduledAt).toLocaleString()}
                                </span>
                              )}
                            </div>
                          )
                        }
                        return (
                          <Badge variant={postStatus === "published" ? "default" : "secondary"}>
                            {postStatus === "published" ? "Published" : "Draft"}
                          </Badge>
                        )
                      })()}
                    </div>
                    <p className="text-stone-600 text-sm line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/blog/${post.id}`} target="_blank">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/blog/edit/${post.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDeleteId(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-stone-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
