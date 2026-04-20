"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/admin/image-upload"
import { ArrowLeft, Loader2, FileEdit, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

type BlogPostStatus = "draft" | "published" | "scheduled"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  image: string
  published: boolean // legacy
  status?: BlogPostStatus
  scheduledAt?: string
  gallery?: string[]
  // SEO Fields
  metaTitle?: string
  metaDescription?: string
  slug?: string
  tags?: string[]
}

export default function EditBlogPostClient({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<BlogPost | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "blogPosts", id)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          // Determine status from data
          const status: BlogPostStatus = data.status || (data.published ? "published" : "draft")
          setFormData({ 
            id: docSnap.id, 
            ...data,
            status,
            scheduledAt: data.scheduledAt || "",
            gallery: data.gallery || [],
            metaTitle: data.metaTitle || "",
            metaDescription: data.metaDescription || "",
            slug: data.slug || "",
            tags: data.tags || [],
          } as BlogPost)
        } else {
          alert("Post not found")
          router.push("/admin/blog")
        }
      } catch (err) {
        console.error("Error fetching post:", err)
        alert("Failed to load post")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, router])

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)
  }

  // Auto-generate meta title from title
  const generateMetaTitle = (title: string) => {
    return title.substring(0, 60)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return
    const newTitle = e.target.value
    setFormData({
      ...formData,
      title: newTitle,
      slug: formData.slug || generateSlug(newTitle),
      metaTitle: formData.metaTitle || generateMetaTitle(newTitle),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setSaving(true)

    // Auto-generate slug and meta title if empty
    const finalSlug = formData.slug || generateSlug(formData.title)
    const finalMetaTitle = formData.metaTitle || generateMetaTitle(formData.title)

    try {
      const docRef = doc(db, "blogPosts", id)
      const now = new Date().toISOString()
      await updateDoc(docRef, {
        slug: finalSlug,
        metaTitle: finalMetaTitle,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        image: formData.image,
        published: formData.status === "published",
        status: formData.status,
        scheduledAt: formData.status === "scheduled" && formData.scheduledAt 
          ? new Date(formData.scheduledAt).toISOString() 
          : null,
        gallery: formData.gallery,
        metaDescription: formData.metaDescription,
        tags: formData.tags,
        updatedAt: now,
      })
      router.push("/admin/blog")
    } catch (err) {
      console.error("Error updating post:", err)
      alert("Failed to update post")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="p-6 bg-[#111111] border border-red-500/30 rounded-xl text-red-400 font-mono">
        <Terminal className="h-5 w-5 inline mr-2" />
        Error: Post not found
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#222222]">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
              <FileEdit className="h-5 w-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Edit Blog Post</h1>
          </div>
          <p className="text-gray-500 font-mono text-sm">// Update blog article</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-[#111111] border-[#222222]">
          <CardHeader>
            <CardTitle className="text-white">Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Title</label>
              <Input
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter post title"
                required
                className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
              />
              <p className="text-xs text-gray-600 font-mono">
                // URL: /blog/{formData.slug || "your-post-title"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description of the post"
                rows={3}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full blog post content"
                rows={10}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Construction, Renovation"
                  required
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Author</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                  required
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Featured Image</label>
              <div className="p-4 bg-[#1a1a1a] border border-[#333333] rounded-lg">
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  folder="pkonstruct/blog"
                />
              </div>
            </div>

            {/* Publishing Status */}
            <div className="space-y-3 border-t border-[#333333] pt-4">
              <label className="text-sm font-medium text-gray-400 font-mono">Publishing Status</label>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={formData.status === "published"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "published", published: true })}
                    className="rounded border-[#333333] bg-[#1a1a1a] text-cyan-500 focus:ring-cyan-500/20"
                  />
                  <span className="text-sm text-gray-300">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={formData.status === "draft"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft", published: false })}
                    className="rounded border-[#333333] bg-[#1a1a1a] text-cyan-500 focus:ring-cyan-500/20"
                  />
                  <span className="text-sm text-gray-300">Draft</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="scheduled"
                    checked={formData.status === "scheduled"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "scheduled", published: false })}
                    className="rounded border-[#333333] bg-[#1a1a1a] text-cyan-500 focus:ring-cyan-500/20"
                  />
                  <span className="text-sm text-gray-300">Schedule</span>
                </label>
              </div>
              
              {/* Schedule DateTime Picker */}
              {formData.status === "scheduled" && (
                <div className="space-y-2 pl-6">
                  <label className="text-sm text-gray-500 font-mono">Publish Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt ? formData.scheduledAt.slice(0, 16) : ""}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                    required={formData.status === "scheduled"}
                  />
                  <p className="text-xs text-gray-600 font-mono">
                    // Post will be visible starting from this date and time
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gallery Images */}
        <Card className="bg-[#111111] border-[#222222]">
          <CardHeader>
            <CardTitle className="text-white">Gallery Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {(formData.gallery || []).map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} alt="" className="w-full h-24 object-cover rounded-lg border border-[#333333]" />
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      gallery: formData.gallery?.filter((_, i) => i !== index) || []
                    })}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500/80 text-white rounded-full text-xs hover:bg-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="border-2 border-dashed border-[#333333] rounded-lg h-24 flex items-center justify-center hover:border-cyan-500/50 hover:bg-[#1a1a1a] transition-colors">
                <ImageUpload
                  value=""
                  onChange={(url) => setFormData({
                    ...formData,
                    gallery: [...(formData.gallery || []), url]
                  })}
                  folder="pkonstruct/blog"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card className="bg-[#111111] border-[#222222]">
          <CardHeader>
            <CardTitle className="text-white">SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Meta Title (SEO)</label>
              <Input
                value={formData.metaTitle || ""}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="SEO title (H1 tag) - max 60 characters"
                maxLength={60}
                className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
              />
              <p className="text-xs text-gray-600 font-mono">{(formData.metaTitle || "").length}/60 chars</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Meta Description (SEO)</label>
              <textarea
                value={formData.metaDescription || ""}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="SEO description for search engines - max 160 characters"
                rows={3}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none"
                maxLength={160}
              />
              <p className="text-xs text-gray-600 font-mono">{(formData.metaDescription || "").length}/160 chars</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">URL Slug</label>
              <Input
                value={formData.slug || ""}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. sustainable-building-practices"
                className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono"
              />
              <p className="text-xs text-gray-600 font-mono">// Used in URL: /blog/your-slug</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Tags</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag and press Enter"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const input = e.target as HTMLInputElement
                      if (input.value.trim()) {
                        setFormData({
                          ...formData,
                          tags: [...(formData.tags || []), input.value.trim()]
                        })
                        input.value = ""
                      }
                    }
                  }}
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.tags || []).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        tags: formData.tags?.filter((_, i) => i !== index) || []
                      })}
                      className="text-cyan-400 hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={saving} 
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Update Post"
            )}
          </Button>
          <Link href="/admin/blog">
            <Button variant="outline" type="button" className="border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222] hover:border-[#444444]">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
