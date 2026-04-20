"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/admin/image-upload"
import { ArrowLeft, Loader2, FileText, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NewBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    image: "",
    published: true, // legacy field
    status: "published" as "draft" | "published" | "scheduled",
    scheduledAt: "",
    gallery: [] as string[],
    metaTitle: "",
    metaDescription: "",
    slug: "",
    tags: [] as string[],
  })

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

  // Update slug when title changes (if slug is empty)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: prev.slug || generateSlug(newTitle),
      metaTitle: prev.metaTitle || generateMetaTitle(newTitle),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Auto-generate slug if still empty
    const finalSlug = formData.slug || generateSlug(formData.title)
    const finalMetaTitle = formData.metaTitle || generateMetaTitle(formData.title)

    try {
      const now = new Date().toISOString()
      const today = now.split('T')[0] // Format: 2024-03-15
      await addDoc(collection(db, "blogPosts"), {
        ...formData,
        slug: finalSlug,
        metaTitle: finalMetaTitle,
        date: today,
        readTime: "5 min read",
        createdAt: today,
        updatedAt: today,
        // Set published based on status for backward compatibility
        published: formData.status === "published",
        // If scheduled, convert scheduledAt to ISO string
        scheduledAt: formData.status === "scheduled" && formData.scheduledAt 
          ? new Date(formData.scheduledAt).toISOString() 
          : null,
      })
      router.push("/admin/blog")
    } catch (err) {
      console.error("Error creating post:", err)
      alert("Failed to create post")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={cn("space-y-6 transition-all duration-500", mounted ? "opacity-100" : "opacity-0")}>
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
              <FileText className="h-5 w-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">New Blog Post</h1>
          </div>
          <p className="text-gray-500 font-mono text-sm">// Create a new blog article</p>
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
                // URL will be: /blog/{formData.slug || "your-post-title"}
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
                  <span className="text-sm text-gray-300">Publish Now</span>
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
                  <span className="text-sm text-gray-300">Save as Draft</span>
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
                    value={formData.scheduledAt}
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
              {formData.gallery.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} alt="" className="w-full h-24 object-cover rounded-lg border border-[#333333]" />
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      gallery: formData.gallery.filter((_, i) => i !== index)
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
                    gallery: [...formData.gallery, url]
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
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="SEO title (H1 tag) - max 60 characters"
                maxLength={60}
                className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
              />
              <p className="text-xs text-gray-600 font-mono">{formData.metaTitle.length}/60 chars</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Meta Description (SEO)</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="SEO description for search engines - max 160 characters"
                rows={3}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none"
                maxLength={160}
              />
              <p className="text-xs text-gray-600 font-mono">{formData.metaDescription.length}/160 chars</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">URL Slug</label>
              <Input
                value={formData.slug}
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
                          tags: [...formData.tags, input.value.trim()]
                        })
                        input.value = ""
                      }
                    }
                  }}
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        tags: formData.tags.filter((_, i) => i !== index)
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
              "Create Post"
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
