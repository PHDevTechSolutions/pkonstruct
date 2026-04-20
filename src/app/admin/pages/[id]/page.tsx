"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Eye, 
  Save,
  Settings,
  ArrowUp,
  ArrowDown,
  GripVertical,
  X,
  ChevronLeft,
  Loader2
} from "lucide-react"
import { WidgetPreview } from "@/components/widgets/widget-preview"
import { ContentEditor } from "@/components/widgets/content-editor"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

// Widget types
const sectionTypes = [
  { type: "hero", label: "Hero Banner", icon: "🦸" },
  { type: "text", label: "Text Content", icon: "📝" },
  { type: "image", label: "Single Image", icon: "🖼️" },
  { type: "gallery", label: "Image Gallery", icon: "🖼️" },
  { type: "video", label: "Video Embed", icon: "🎬" },
  { type: "projects", label: "Projects Grid", icon: "🏗️" },
  { type: "services", label: "Services Grid", icon: "⚙️" },
  { type: "testimonials", label: "Testimonials", icon: "💬" },
  { type: "team", label: "Team Members", icon: "👥" },
  { type: "blog", label: "Blog Posts Grid", icon: "📰" },
  { type: "clients", label: "Client Logos", icon: "🏢" },
  { type: "contact", label: "Contact Form", icon: "📧" },
  { type: "cta", label: "Call to Action", icon: "🎯" },
  { type: "stats", label: "Statistics", icon: "📊" },
  { type: "features", label: "Features Grid", icon: "✨" },
  { type: "faq", label: "FAQ Section", icon: "❓" },
  { type: "before-after", label: "Before/After Gallery", icon: "⚖️" },
  { type: "pricing", label: "Pricing Table", icon: "💰" },
  { type: "process", label: "Process Steps", icon: "🔄" },
  { type: "location", label: "Location Map", icon: "📍" },
  { type: "newsletter", label: "Newsletter Signup", icon: "📮" },
  { type: "awards", label: "Awards/Certifications", icon: "🏆" },
  { type: "downloads", label: "Downloads/Brochures", icon: "📥" },
  { type: "social-links", label: "Social Media Links", icon: "🔗" },
  { type: "partners", label: "Partners/Suppliers", icon: "🤝" },
  { type: "comparison", label: "Comparison Table", icon: "⚖️" },
]

const widgetTypes = [
  { type: "hero", label: "Hero Banner", icon: "🦸", category: "content" },
  { type: "text", label: "Text Content", icon: "📝", category: "content" },
  { type: "image", label: "Single Image", icon: "🖼️", category: "content" },
  { type: "gallery", label: "Image Gallery", icon: "🖼️", category: "content" },
  { type: "video", label: "Video Embed", icon: "🎬", category: "content" },
  { type: "projects", label: "Projects Grid", icon: "🏗️", category: "dynamic" },
  { type: "services", label: "Services Grid", icon: "⚙️", category: "dynamic" },
  { type: "testimonials", label: "Testimonials", icon: "💬", category: "dynamic" },
  { type: "team", label: "Team Members", icon: "👥", category: "dynamic" },
  { type: "blog", label: "Blog Posts Grid", icon: "📰", category: "dynamic" },
  { type: "clients", label: "Client Logos", icon: "🏢", category: "dynamic" },
  { type: "contact", label: "Contact Form", icon: "📧", category: "interactive" },
  { type: "cta", label: "Call to Action", icon: "🎯", category: "interactive" },
  { type: "stats", label: "Statistics", icon: "📊", category: "interactive" },
  { type: "features", label: "Features Grid", icon: "✨", category: "content" },
  { type: "faq", label: "FAQ Section", icon: "❓", category: "interactive" },
  { type: "before-after", label: "Before/After Gallery", icon: "⚖️", category: "content" },
  { type: "pricing", label: "Pricing Table", icon: "💰", category: "interactive" },
  { type: "process", label: "Process Steps", icon: "🔄", category: "content" },
  { type: "location", label: "Location Map", icon: "📍", category: "interactive" },
  { type: "newsletter", label: "Newsletter Signup", icon: "📮", category: "interactive" },
  { type: "awards", label: "Awards/Certifications", icon: "🏆", category: "content" },
  { type: "downloads", label: "Downloads/Brochures", icon: "📥", category: "content" },
  { type: "social-links", label: "Social Media Links", icon: "🔗", category: "interactive" },
  { type: "partners", label: "Partners/Suppliers", icon: "🤝", category: "dynamic" },
  { type: "comparison", label: "Comparison Table", icon: "⚖️", category: "interactive" },
]

// Widget Gallery Thumbnail Component
function WidgetGalleryThumbnail({ type }: { type: string }) {
  const thumbs: Record<string, React.ReactNode> = {
    hero: <div className="h-full w-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs">HERO</div>,
    text: <div className="h-full w-full bg-[#222222] p-1"><div className="h-1 w-full bg-[#333333] rounded mb-0.5" /><div className="h-1 w-3/4 bg-[#333333] rounded" /></div>,
    image: <div className="h-full w-full bg-[#222222] flex items-center justify-center text-gray-500 text-lg">🖼️</div>,
    gallery: <div className="h-full w-full bg-[#222222] grid grid-cols-3 gap-0.5 p-0.5"><div className="bg-[#333333] rounded-sm" /><div className="bg-[#333333] rounded-sm" /><div className="bg-[#333333] rounded-sm" /></div>,
    video: <div className="h-full w-full bg-[#111111] flex items-center justify-center"><div className="w-0 h-0 border-l-4 border-l-cyan-400 border-y-2 border-y-transparent" /></div>,
    projects: <div className="h-full w-full bg-[#222222] flex items-center justify-center text-gray-400 text-lg">🏗️</div>,
    services: <div className="h-full w-full bg-[#222222] flex items-center justify-center text-gray-400 text-lg">⚙️</div>,
    testimonials: <div className="h-full w-full bg-[#222222] flex items-center justify-center text-gray-400 text-lg">💬</div>,
    team: <div className="h-full w-full bg-[#222222] flex items-center justify-center text-gray-400 text-lg">👥</div>,
    blog: <div className="h-full w-full bg-[#222222] flex items-center justify-center text-gray-400 text-lg">📰</div>,
    clients: <div className="h-full w-full bg-[#222222] flex items-center justify-center text-gray-400 text-lg">🏢</div>,
    contact: <div className="h-full w-full bg-[#222222] flex items-center justify-center text-gray-400 text-lg">📧</div>,
    cta: <div className="h-full w-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">CTA</div>,
    stats: <div className="h-full w-full bg-[#111111] flex items-center justify-center text-cyan-400 text-xs font-bold">123</div>,
    features: <div className="h-full w-full bg-[#222222] grid grid-cols-2 gap-0.5 p-0.5"><div className="bg-[#333333] rounded-sm" /><div className="bg-[#333333] rounded-sm" /></div>,
    faq: <div className="h-full w-full bg-[#222222] flex items-center justify-center text-gray-400 text-lg">❓</div>,
  }
  return thumbs[type] || <div className="h-full w-full bg-[#222222] flex items-center justify-center text-gray-500 text-xs">📦</div>
}

export default function PageEditor() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.id as string

  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPage()
  }, [pageId])

  const loadPage = async () => {
    try {
      const pagesQuery = query(collection(db, "pages"), orderBy("createdAt", "desc"))
      const snapshot = await getDocs(pagesQuery)
      const pagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      const currentPage = pagesData.find((p) => p.id === pageId)
      if (currentPage) {
        setPage(currentPage)
      }
    } catch (error) {
      console.error("Error loading page:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePage = async (updatedPage: any) => {
    setSaving(true)
    try {
      const pageRef = doc(db, "pages", updatedPage.id)
      await updateDoc(pageRef, {
        title: updatedPage.title,
        slug: updatedPage.slug,
        metaTitle: updatedPage.metaTitle,
        metaDescription: updatedPage.metaDescription,
        isPublished: updatedPage.isPublished,
        isDefault: updatedPage.isDefault,
        showInHeader: updatedPage.showInHeader,
        showInFooter: updatedPage.showInFooter,
        sections: updatedPage.sections,
        updatedAt: new Date(),
      })
      setPage(updatedPage)
    } catch (error) {
      console.error("Error saving page:", error)
    } finally {
      setSaving(false)
    }
  }

  const addSection = async (type: string) => {
    const newSection = {
      id: `section_${Date.now()}`,
      type,
      title: "",
      content: "",
      image: "",
      order: page.sections.length,
      isActive: true,
    }
    const updatedPage = { ...page, sections: [...page.sections, newSection] }
    await handleSavePage(updatedPage)
  }

  const deleteSection = async (sectionId: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return
    const updatedPage = { ...page, sections: page.sections.filter((s: any) => s.id !== sectionId) }
    await handleSavePage(updatedPage)
  }

  const updateSection = async (sectionId: string, updates: any) => {
    const updatedSections = page.sections.map((s: any) =>
      s.id === sectionId ? { ...s, ...updates } : s
    )
    await handleSavePage({ ...page, sections: updatedSections })
  }

  const toggleSection = async (sectionId: string) => {
    const section = page.sections.find((s: any) => s.id === sectionId)
    await updateSection(sectionId, { isActive: !section.isActive })
  }

  const moveSection = async (sectionId: string, direction: 'up' | 'down') => {
    const index = page.sections.findIndex((s: any) => s.id === sectionId)
    if (direction === 'up' && index > 0) {
      const newSections = [...page.sections]
      ;[newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]]
      await handleSavePage({ ...page, sections: newSections.map((s: any, i: number) => ({ ...s, order: i })) })
    } else if (direction === 'down' && index < page.sections.length - 1) {
      const newSections = [...page.sections]
      ;[newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]
      await handleSavePage({ ...page, sections: newSections.map((s: any, i: number) => ({ ...s, order: i })) })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p className="text-gray-500 font-mono">// Page not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header - Full Width */}
      <div className="bg-[#111111] border-b border-[#222222] sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/pages">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#222222]">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Pages
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-white">{page.title}</h1>
                <p className="text-sm text-gray-500 font-mono">/{page.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/${page.slug}`} target="_blank">
                <Button variant="outline" size="sm" className="border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222]">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </Link>
              <Button 
                size="sm" 
                onClick={() => handleSavePage(page)}
                disabled={saving}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Page Sections */}
          <div className="xl:col-span-3 space-y-6">
            {/* Page Settings */}
            <Card className="bg-[#111111] border-[#222222]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5 text-cyan-400" />
                  Page Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 font-mono">Page Title</label>
                    <Input
                      value={page.title}
                      onChange={(e) => setPage({ ...page, title: e.target.value })}
                      className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 font-mono">URL Slug</label>
                    <Input
                      value={page.slug}
                      onChange={(e) => setPage({ ...page, slug: e.target.value })}
                      className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 font-mono">Meta Title</label>
                    <Input
                      value={page.metaTitle || ""}
                      onChange={(e) => setPage({ ...page, metaTitle: e.target.value })}
                      placeholder="SEO title"
                      className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 font-mono">Meta Description</label>
                    <Input
                      value={page.metaDescription || ""}
                      onChange={(e) => setPage({ ...page, metaDescription: e.target.value })}
                      placeholder="SEO description"
                      className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={page.isPublished}
                      onChange={(e) => setPage({ ...page, isPublished: e.target.checked })}
                      className="rounded border-[#333333] bg-[#1a1a1a] text-cyan-500 focus:ring-cyan-500/20"
                    />
                    <span className="text-sm text-gray-300">Published</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={page.showInHeader}
                      onChange={(e) => setPage({ ...page, showInHeader: e.target.checked })}
                      className="rounded border-[#333333] bg-[#1a1a1a] text-cyan-500 focus:ring-cyan-500/20"
                    />
                    <span className="text-sm text-gray-300">Show in Header</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={page.showInFooter}
                      onChange={(e) => setPage({ ...page, showInFooter: e.target.checked })}
                      className="rounded border-[#333333] bg-[#1a1a1a] text-cyan-500 focus:ring-cyan-500/20"
                    />
                    <span className="text-sm text-gray-300">Show in Footer</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Page Sections */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Page Sections</h2>
                <span className="text-sm text-gray-500 font-mono">{page.sections.length} section(s)</span>
              </div>

              <div className="space-y-4">
                {page.sections
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((section: any, index: number, array: any[]) => (
                    <Card key={section.id} className={cn(section.isActive ? "bg-[#111111] border-[#222222]" : "bg-[#111111]/60 border-[#222222]/60", "transition-opacity")}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                          {/* Move Buttons */}
                          <div className="flex flex-col gap-0.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveSection(section.id, 'up')}
                              disabled={index === 0}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-[#222222]"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveSection(section.id, 'down')}
                              disabled={index === array.length - 1}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-[#222222]"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Section Info */}
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xl">
                              {sectionTypes.find((t) => t.type === section.type)?.icon || "📦"}
                            </span>
                            <div>
                              <span className="font-medium text-gray-200">
                                {sectionTypes.find((t) => t.type === section.type)?.label || section.type}
                              </span>
                              {section.title && (
                                <p className="text-sm text-gray-500">{section.title}</p>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <label className="flex items-center gap-1.5 cursor-pointer mr-2">
                              <input
                                type="checkbox"
                                checked={section.isActive}
                                onChange={() => toggleSection(section.id)}
                                className="rounded border-[#333333] bg-[#1a1a1a] text-cyan-500 focus:ring-cyan-500/20"
                              />
                              <span className="text-sm text-gray-400">Active</span>
                            </label>

                            {/* Edit Sheet */}
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#222222]"
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </SheetTrigger>
                              <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto bg-[#111111] border-l border-[#222222]">
                                <SheetHeader className="pb-4 border-b border-[#222222]">
                                  <SheetTitle className="text-white">Edit Section</SheetTitle>
                                </SheetHeader>
                                <div className="py-6 space-y-6">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 font-mono">Section Title</label>
                                    <Input
                                      value={section.title}
                                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                      placeholder="Enter title"
                                      className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 font-mono">Content</label>
                                    <div className="border border-[#333333] rounded-lg p-4 bg-[#1a1a1a]">
                                      <ContentEditor
                                        type={section.type}
                                        content={section.content}
                                        onChange={(newContent) => updateSection(section.id, { content: newContent })}
                                      />
                                    </div>
                                  </div>
                                  {(section.type === "hero" || section.type === "image") && (
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-400 font-mono">Image URL</label>
                                      <Input
                                        value={section.image || ""}
                                        onChange={(e) => updateSection(section.id, { image: e.target.value })}
                                        placeholder="https://..."
                                        className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono"
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="flex justify-end gap-2 pt-4 border-t border-[#333333] mt-6">
                                  <SheetClose asChild>
                                    <Button variant="outline" className="border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222]">
                                      <X className="h-4 w-4 mr-1" />
                                      Close
                                    </Button>
                                  </SheetClose>
                                </div>
                              </SheetContent>
                            </Sheet>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSection(section.id)}
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Preview */}
                        <div className="border border-[#333333] rounded-lg p-3 bg-[#1a1a1a]">
                          <WidgetPreview section={section} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {page.sections.length === 0 && (
                  <div className="text-center py-12 bg-[#1a1a1a] rounded-lg border border-dashed border-[#333333]">
                    <p className="text-gray-500 mb-2 font-mono">// No sections yet</p>
                    <p className="text-sm text-gray-600 font-mono">// Add widgets from the panel on the right</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Widget Gallery */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="bg-[#111111] border-[#222222]">
              <CardHeader>
                <CardTitle className="text-lg text-white">🧩 Widget Gallery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Content Widgets */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 font-mono">// Content</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {widgetTypes
                      .filter((w) => w.category === "content")
                      .map((widget) => (
                        <button
                          key={widget.type}
                          onClick={() => addSection(widget.type)}
                          className="text-left p-3 rounded-lg border border-[#333333] bg-[#1a1a1a] hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all group"
                        >
                          <div className="h-12 w-full rounded mb-2 overflow-hidden">
                            <WidgetGalleryThumbnail type={widget.type} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="group-hover:scale-110 transition-transform">{widget.icon}</span>
                            <span className="text-xs font-medium text-gray-300 group-hover:text-white">{widget.label}</span>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Dynamic Widgets */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 font-mono">// Dynamic Data</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {widgetTypes
                      .filter((w) => w.category === "dynamic")
                      .map((widget) => (
                        <button
                          key={widget.type}
                          onClick={() => addSection(widget.type)}
                          className="text-left p-3 rounded-lg border border-[#333333] bg-[#1a1a1a] hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all group"
                        >
                          <div className="h-12 w-full rounded mb-2 overflow-hidden">
                            <WidgetGalleryThumbnail type={widget.type} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="group-hover:scale-110 transition-transform">{widget.icon}</span>
                            <span className="text-xs font-medium text-gray-300 group-hover:text-white">{widget.label}</span>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Interactive Widgets */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 font-mono">// Interactive</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {widgetTypes
                      .filter((w) => w.category === "interactive")
                      .map((widget) => (
                        <button
                          key={widget.type}
                          onClick={() => addSection(widget.type)}
                          className="text-left p-3 rounded-lg border border-[#333333] bg-[#1a1a1a] hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all group"
                        >
                          <div className="h-12 w-full rounded mb-2 overflow-hidden">
                            <WidgetGalleryThumbnail type={widget.type} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="group-hover:scale-110 transition-transform">{widget.icon}</span>
                            <span className="text-xs font-medium text-gray-300 group-hover:text-white">{widget.label}</span>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
