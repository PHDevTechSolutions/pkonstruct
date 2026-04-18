"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, query, orderBy, getDoc, setDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUpload } from "@/components/admin/image-upload"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { 
  ArrowUp, 
  ArrowDown,
  Plus, 
  Trash2, 
  Eye, 
  Save,
  Settings,
  ChevronDown,
  ChevronUp,
  Pencil,
  GripVertical,
  X,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { WidgetPreview } from "@/components/widgets/widget-preview"
import { ContentEditor } from "@/components/widgets/content-editor"

// Widget Gallery Thumbnail Component
function WidgetGalleryThumbnail({ type }: { type: string }) {
  const thumbs: Record<string, React.ReactNode> = {
    hero: <div className="h-8 bg-gradient-to-r from-amber-600 to-amber-500 rounded" />,
    text: <div className="space-y-1"><div className="h-2 bg-stone-200 rounded w-3/4" /><div className="h-2 bg-stone-200 rounded w-1/2" /></div>,
    image: <div className="h-8 bg-stone-200 rounded flex items-center justify-center text-stone-400 text-xs">🖼️</div>,
    gallery: <div className="grid grid-cols-3 gap-0.5"><div className="h-2 bg-stone-200 rounded" /><div className="h-2 bg-stone-200 rounded" /><div className="h-2 bg-stone-200 rounded" /></div>,
    video: <div className="h-8 bg-stone-800 rounded flex items-center justify-center text-white text-xs">▶</div>,
    projects: <div className="grid grid-cols-2 gap-0.5"><div className="h-4 bg-stone-200 rounded" /><div className="h-4 bg-stone-200 rounded" /></div>,
    services: <div className="flex gap-0.5"><div className="h-8 flex-1 bg-stone-100 rounded border" /><div className="h-8 flex-1 bg-stone-100 rounded border" /></div>,
    testimonials: <div className="h-8 bg-stone-50 rounded border p-1"><div className="flex gap-1"><div className="w-4 h-4 bg-stone-200 rounded-full" /><div className="flex-1 space-y-0.5"><div className="h-1.5 bg-stone-200 rounded w-2/3" /><div className="h-1 bg-stone-200 rounded w-full" /></div></div></div>,
    team: <div className="flex justify-center gap-1"><div className="w-5 h-5 bg-stone-200 rounded-full" /><div className="w-5 h-5 bg-stone-200 rounded-full" /></div>,
    blog: <div className="space-y-1"><div className="flex gap-1"><div className="w-6 h-4 bg-stone-200 rounded" /><div className="flex-1 space-y-0.5"><div className="h-1.5 bg-stone-200 rounded w-full" /></div></div></div>,
    clients: <div className="flex gap-1 justify-center"><div className="h-3 w-6 bg-stone-200 rounded" /><div className="h-3 w-6 bg-stone-200 rounded" /></div>,
    contact: <div className="space-y-0.5"><div className="h-2 bg-stone-100 rounded" /><div className="h-2 bg-stone-100 rounded" /><div className="h-1.5 w-8 bg-amber-600 rounded" /></div>,
    cta: <div className="h-8 bg-amber-600 rounded flex items-center justify-center text-white text-[8px] font-bold">CTA</div>,
    stats: <div className="flex gap-1 justify-around"><div className="text-center"><div className="text-xs font-bold text-amber-600">100</div><div className="text-[6px] text-stone-400">Stat</div></div><div className="text-center"><div className="text-xs font-bold text-amber-600">50</div></div></div>,
    features: <div className="grid grid-cols-2 gap-0.5"><div className="h-3 bg-stone-50 rounded flex items-center gap-0.5 px-1"><div className="w-2 h-2 bg-amber-100 rounded" /><div className="h-1.5 bg-stone-200 rounded w-6" /></div><div className="h-3 bg-stone-50 rounded" /></div>,
    faq: <div className="space-y-0.5"><div className="h-2.5 bg-stone-100 rounded px-1 flex justify-between items-center text-[6px]">Q <span>▼</span></div><div className="h-2.5 bg-stone-100 rounded" /></div>,
    "before-after": <div className="h-8 flex"><div className="flex-1 bg-stone-300" /><div className="flex-1 bg-amber-100" /><div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full flex items-center justify-center text-[6px]">↔</div></div>,
    pricing: <div className="flex gap-0.5"><div className="flex-1 h-8 bg-white border rounded" /><div className="flex-1 h-8 bg-amber-50 border-2 border-amber-500 rounded" /></div>,
    process: <div className="flex items-center justify-center gap-0.5"><div className="w-4 h-4 rounded-full bg-amber-600 text-white text-[8px] flex items-center justify-center">1</div><div className="w-2 h-0.5 bg-amber-200" /><div className="w-4 h-4 rounded-full bg-amber-600 text-white text-[8px] flex items-center justify-center">2</div></div>,
    location: <div className="flex gap-1"><div className="w-8 h-8 bg-stone-100 rounded flex items-center justify-center text-xs">🗺️</div><div className="flex-1 space-y-0.5"><div className="h-1.5 bg-stone-200 rounded w-full" /><div className="h-1.5 bg-stone-200 rounded w-2/3" /></div></div>,
    newsletter: <div className="h-8 bg-amber-600 rounded flex items-center justify-center gap-1 px-2"><div className="flex-1 h-2 bg-white/30 rounded" /><div className="h-2 w-6 bg-stone-900 rounded text-[6px] text-white flex items-center justify-center">Join</div></div>,
    awards: <div className="flex justify-center gap-1"><div className="text-lg">🏆</div><div className="text-lg">🏆</div></div>,
    downloads: <div className="space-y-0.5"><div className="h-3 bg-white border rounded flex items-center gap-1 px-1"><div className="w-2 h-2 bg-red-100 rounded text-[6px] text-red-500">P</div><div className="flex-1 h-1.5 bg-stone-200 rounded" /></div></div>,
    "social-links": <div className="flex justify-center gap-1"><div className="w-4 h-4 bg-[#1877F2] rounded text-white text-[6px] flex items-center justify-center">f</div><div className="w-4 h-4 bg-gradient-to-tr from-purple-500 to-orange-500 rounded text-white text-[6px] flex items-center justify-center">📷</div></div>,
    partners: <div className="space-y-0.5"><div className="text-[6px] text-stone-400">Materials</div><div className="flex gap-1"><div className="h-3 w-8 bg-stone-200 rounded" /><div className="h-3 w-8 bg-stone-200 rounded" /></div></div>,
    comparison: <div className="border rounded overflow-hidden"><div className="grid grid-cols-3 text-[6px] bg-stone-50"><div className="p-0.5">Feat</div><div className="p-0.5 text-center">A</div><div className="p-0.5 text-center">B</div></div><div className="grid grid-cols-3 text-[6px]"><div className="p-0.5">Item</div><div className="p-0.5 text-center text-green-600">✓</div><div className="p-0.5 text-center text-green-600">✓</div></div></div>
  }
  
  return (
    <div className="h-8 w-full relative overflow-hidden rounded bg-stone-50 mb-2">
      {thumbs[type] || <div className="h-full bg-stone-100 flex items-center justify-center text-stone-300 text-xs">📦</div>}
    </div>
  )
}

interface PageSection {
  id: string
  type: string
  title: string
  content: string | Record<string, any>
  image?: string
  order: number
  isActive: boolean
}

interface CustomPage {
  id: string
  title: string
  slug: string
  metaTitle?: string
  metaDescription?: string
  sections: PageSection[]
  isPublished: boolean
  showInHeader: boolean
  showInFooter: boolean
  isDefault: boolean
  order: number
  createdAt: string
  updatedAt: string
}

const pageTypes = [
  { id: "home", name: "Home Page", icon: "🏠" },
  { id: "about", name: "About Us", icon: "ℹ️" },
  { id: "services", name: "Services", icon: "🛠️" },
  { id: "custom", name: "Custom Page", icon: "📄" },
]

// Widget/Plugin Types - WordPress Style
const widgetTypes = [
  // Static Content Widgets
  { type: "hero", label: "Hero Banner", icon: "🖼️", category: "content" },
  { type: "text", label: "Text Content", icon: "📝", category: "content" },
  { type: "image", label: "Single Image", icon: "🖼️", category: "content" },
  { type: "gallery", label: "Image Gallery", icon: "🖼️", category: "content" },
  { type: "video", label: "Video Embed", icon: "🎬", category: "content" },
  
  // Dynamic Data Widgets (Auto-fetch from collections)
  { type: "projects", label: "Projects Grid", icon: "🏗️", category: "dynamic", description: "Auto-fetches from Projects collection" },
  { type: "services", label: "Services Grid", icon: "🛠️", category: "dynamic", description: "Auto-fetches from Services collection" },
  { type: "testimonials", label: "Testimonials Slider", icon: "💬", category: "dynamic", description: "Auto-fetches from Testimonials collection" },
  { type: "team", label: "Team Members", icon: "👥", category: "dynamic", description: "Auto-fetches from Team collection" },
  { type: "blog", label: "Blog Posts Grid", icon: "📰", category: "dynamic", description: "Auto-fetches latest blog posts" },
  { type: "clients", label: "Client Logos", icon: "🏢", category: "dynamic", description: "Auto-fetches from Clients collection" },
  
  // Interactive Widgets
  { type: "contact", label: "Contact Form", icon: "📧", category: "interactive" },
  { type: "cta", label: "Call to Action", icon: "🎯", category: "interactive" },
  { type: "stats", label: "Statistics", icon: "📊", category: "interactive" },
  { type: "features", label: "Features Grid", icon: "⚡", category: "interactive" },
  { type: "faq", label: "FAQ Accordion", icon: "❓", category: "interactive", description: "Auto-fetches from FAQ collection" },
  { type: "before-after", label: "Before/After Gallery", icon: "🔄", category: "content" },
  { type: "pricing", label: "Pricing Plans", icon: "💰", category: "interactive" },
  { type: "process", label: "Process/Timeline", icon: "⏱️", category: "content" },
  { type: "location", label: "Location/Map", icon: "📍", category: "content" },
  { type: "newsletter", label: "Newsletter Subscribe", icon: "📬", category: "interactive" },
  { type: "awards", label: "Awards/Certifications", icon: "🏆", category: "content" },
  { type: "downloads", label: "Downloads/Brochures", icon: "📥", category: "content" },
  { type: "social-links", label: "Social Media Links", icon: "🔗", category: "interactive" },
  { type: "partners", label: "Partners/Suppliers", icon: "🤝", category: "content" },
  { type: "comparison", label: "Comparison Table", icon: "⚖️", category: "content" },
]

const sectionTypes = widgetTypes // Backward compatibility

export default function PagesManagement() {
  const [pages, setPages] = useState<CustomPage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [expandedPage, setExpandedPage] = useState<string | null>("about")
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [showWidgetGallery, setShowWidgetGallery] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<"pages" | "navigation">("pages")
  
  // Delete confirmation dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pageToDelete, setPageToDelete] = useState<{ id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  
  // Template selection dialog states
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [creatingWithTemplate, setCreatingWithTemplate] = useState(false)
  
  // Search, Filter, and Pagination states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const q = query(collection(db, "pages"), orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data()
        return {
          id: doc.id,
          ...docData,
          // Ensure boolean values have defaults
          showInHeader: docData.showInHeader ?? false,
          showInFooter: docData.showInFooter ?? false,
          isPublished: docData.isPublished ?? false,
          isDefault: docData.isDefault ?? false,
          order: docData.order ?? 0,
        }
      }) as CustomPage[]
      
      // If no pages exist, create default ones
      if (data.length === 0) {
        await createDefaultPages()
        await fetchPages()
        return
      }
      
      setPages(data)
    } catch (err) {
      console.error("Error fetching pages:", err)
      setError("Failed to load pages")
    } finally {
      setLoading(false)
    }
  }

  const createDefaultPages = async () => {
    const defaultPages = [
      {
        title: "Home",
        slug: "home",
        metaTitle: "PKonstruct | Building Excellence Since 2005",
        metaDescription: "Leading construction company specializing in residential, commercial, and industrial projects.",
        sections: [
          {
            id: "home-hero",
            type: "hero",
            title: "Building Tomorrow's Landmarks Today",
            content: "Transforming visions into reality with precision, innovation, and unmatched expertise in construction.",
            image: "",
            order: 1,
            isActive: true,
          },
        ],
        isPublished: true,
        showInHeader: true,
        showInFooter: true,
        isDefault: true,
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        title: "About Us",
        slug: "about",
        metaTitle: "About Us | PKonstruct",
        metaDescription: "Learn about PKonstruct, our mission, values, and team.",
        sections: [
          {
            id: "about-hero",
            type: "hero",
            title: "Building Excellence Since 2005",
            content: "PKonstruct is a leading construction company dedicated to delivering exceptional results across residential, commercial, and industrial projects.",
            image: "",
            order: 1,
            isActive: true,
          },
          {
            id: "about-story",
            type: "text",
            title: "Our Story",
            content: "Founded in 2005, PKonstruct has grown from a small local contractor to a premier construction company serving clients nationwide. Our commitment to quality, safety, and innovation has been the foundation of our success.",
            order: 2,
            isActive: true,
          },
          {
            id: "about-stats",
            type: "stats",
            title: "Our Impact",
            content: JSON.stringify([
              { label: "Projects Completed", value: "500+" },
              { label: "Years Experience", value: "19" },
              { label: "Team Members", value: "150+" },
              { label: "Client Satisfaction", value: "99%" },
            ]),
            order: 3,
            isActive: true,
          },
        ],
        isPublished: true,
        showInHeader: true,
        showInFooter: true,
        isDefault: false,
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        title: "Services",
        slug: "services",
        metaTitle: "Our Services | PKonstruct",
        metaDescription: "Comprehensive construction services for residential, commercial, and industrial projects.",
        sections: [
          {
            id: "services-hero",
            type: "hero",
            title: "Our Services",
            content: "From concept to completion, we deliver excellence in every project.",
            image: "",
            order: 1,
            isActive: true,
          },
        ],
        isPublished: true,
        showInHeader: true,
        showInFooter: true,
        isDefault: false,
        order: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        title: "Projects",
        slug: "projects",
        metaTitle: "Our Projects | PKonstruct",
        metaDescription: "View our portfolio of completed construction projects.",
        sections: [
          {
            id: "projects-grid",
            type: "projects",
            title: "Featured Projects",
            content: "",
            order: 1,
            isActive: true,
          },
        ],
        isPublished: true,
        showInHeader: true,
        showInFooter: true,
        isDefault: false,
        order: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        title: "Blog",
        slug: "blog",
        metaTitle: "Blog | PKonstruct",
        metaDescription: "Construction insights, tips, and industry news.",
        sections: [],
        isPublished: true,
        showInHeader: true,
        showInFooter: true,
        isDefault: false,
        order: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        title: "FAQ",
        slug: "faq",
        metaTitle: "FAQ | PKonstruct",
        metaDescription: "Frequently asked questions about our services.",
        sections: [],
        isPublished: true,
        showInHeader: true,
        showInFooter: true,
        isDefault: false,
        order: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        title: "Contact",
        slug: "contact",
        metaTitle: "Contact Us | PKonstruct",
        metaDescription: "Get in touch with PKonstruct for your construction needs.",
        sections: [
          {
            id: "contact-form",
            type: "contact",
            title: "Get In Touch",
            content: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
            order: 1,
            isActive: true,
          },
        ],
        isPublished: true,
        showInHeader: true,
        showInFooter: true,
        isDefault: false,
        order: 7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    for (const page of defaultPages) {
      await addDoc(collection(db, "pages"), page)
    }
  }

  const handleSavePage = async (page: CustomPage) => {
    setSaving(true)
    try {
      const docRef = doc(db, "pages", page.id)
      await updateDoc(docRef, {
        ...page,
        updatedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error("Error saving page:", err)
      setError("Failed to save page")
    } finally {
      setSaving(false)
    }
  }

  const moveSection = async (pageId: string, sectionId: string, direction: 'up' | 'down') => {
    const page = pages.find((p) => p.id === pageId)
    if (!page) return

    const sections = [...page.sections].sort((a, b) => a.order - b.order)
    const index = sections.findIndex((s) => s.id === sectionId)
    
    if (direction === 'up' && index > 0) {
      const temp = sections[index].order
      sections[index].order = sections[index - 1].order
      sections[index - 1].order = temp
    } else if (direction === 'down' && index < sections.length - 1) {
      const temp = sections[index].order
      sections[index].order = sections[index + 1].order
      sections[index + 1].order = temp
    }

    const updatedPage = { ...page, sections }
    setPages(pages.map((p) => (p.id === pageId ? updatedPage : p)))
    await handleSavePage(updatedPage)
  }

  const addSection = async (pageId: string, type: string) => {
    const page = pages.find((p) => p.id === pageId)
    if (!page) return

    const newSection: PageSection = {
      id: `${type}-${Date.now()}`,
      type,
      title: "New Section",
      content: "",
      order: page.sections.length + 1,
      isActive: true,
    }

    const updatedPage = {
      ...page,
      sections: [...page.sections, newSection],
    }

    setPages(pages.map((p) => (p.id === pageId ? updatedPage : p)))
    await handleSavePage(updatedPage)
    setEditingSection(newSection.id)
  }

  const updateSection = async (pageId: string, sectionId: string, updates: Partial<PageSection>) => {
    const page = pages.find((p) => p.id === pageId)
    if (!page) return

    const updatedSections = page.sections.map((s) =>
      s.id === sectionId ? { ...s, ...updates } : s
    )

    const updatedPage = { ...page, sections: updatedSections }
    setPages(pages.map((p) => (p.id === pageId ? updatedPage : p)))
    await handleSavePage(updatedPage)
  }

  const deleteSection = async (pageId: string, sectionId: string) => {
    const page = pages.find((p) => p.id === pageId)
    if (!page) return

    const updatedSections = page.sections.filter((s) => s.id !== sectionId)
    const reorderedSections = updatedSections.map((s, index) => ({
      ...s,
      order: index + 1,
    }))

    const updatedPage = { ...page, sections: reorderedSections }
    setPages(pages.map((p) => (p.id === pageId ? updatedPage : p)))
    await handleSavePage(updatedPage)
  }

  const toggleSection = async (pageId: string, sectionId: string) => {
    const page = pages.find((p) => p.id === pageId)
    if (!page) return

    const updatedSections = page.sections.map((s) =>
      s.id === sectionId ? { ...s, isActive: !s.isActive } : s
    )

    const updatedPage = { ...page, sections: updatedSections }
    setPages(pages.map((p) => (p.id === pageId ? updatedPage : p)))
    await handleSavePage(updatedPage)
  }

  // Page Templates
  const pageTemplates = {
    homepage: {
      title: "Homepage",
      slug: "home",
      metaTitle: "Welcome to Our Company",
      metaDescription: "Your trusted partner for construction and building excellence.",
      sections: [
        { id: `section-${Date.now()}-1`, type: "hero", title: "Hero Section", isActive: true, order: 1, content: { headline: "Building Excellence", subheadline: "Your vision, our expertise" } },
        { id: `section-${Date.now()}-2`, type: "services", title: "Our Services", isActive: true, order: 2, content: {} },
        { id: `section-${Date.now()}-3`, type: "projects", title: "Featured Projects", isActive: true, order: 3, content: {} },
        { id: `section-${Date.now()}-4`, type: "testimonials", title: "Testimonials", isActive: true, order: 4, content: {} },
        { id: `section-${Date.now()}-5`, type: "cta", title: "Call to Action", isActive: true, order: 5, content: { title: "Ready to Start?", buttonText: "Get Quote" } },
      ],
      showInHeader: true,
      showInFooter: false,
    },
    about: {
      title: "About Us",
      slug: "about-us",
      metaTitle: "About Us - Our Company",
      metaDescription: "Learn about our story, mission, and the team behind our success.",
      sections: [
        { id: `section-${Date.now()}-1`, type: "hero", title: "About Hero", isActive: true, order: 1, content: { headline: "About Us", subheadline: "Our story and mission" } },
        { id: `section-${Date.now()}-2`, type: "text", title: "Our Story", isActive: true, order: 2, content: { text: "Founded with a vision to transform the construction industry..." } },
        { id: `section-${Date.now()}-3`, type: "team", title: "Our Team", isActive: true, order: 3, content: {} },
        { id: `section-${Date.now()}-4`, type: "stats", title: "Company Stats", isActive: true, order: 4, content: {} },
      ],
      showInHeader: true,
      showInFooter: true,
    },
    projects: {
      title: "Projects",
      slug: "projects",
      metaTitle: "Our Projects - Portfolio",
      metaDescription: "Explore our completed projects and see our work in action.",
      sections: [
        { id: `section-${Date.now()}-1`, type: "hero", title: "Projects Hero", isActive: true, order: 1, content: { headline: "Our Projects", subheadline: "Excellence in every build" } },
        { id: `section-${Date.now()}-2`, type: "projects", title: "Project Gallery", isActive: true, order: 2, content: { layout: "grid" } },
        { id: `section-${Date.now()}-3`, type: "cta", title: "Start Your Project", isActive: true, order: 3, content: { title: "Have a project in mind?", buttonText: "Contact Us" } },
      ],
      showInHeader: true,
      showInFooter: true,
    },
    services: {
      title: "Services",
      slug: "services",
      metaTitle: "Our Services - What We Offer",
      metaDescription: "Comprehensive construction services for residential and commercial projects.",
      sections: [
        { id: `section-${Date.now()}-1`, type: "hero", title: "Services Hero", isActive: true, order: 1, content: { headline: "Our Services", subheadline: "Comprehensive solutions for your needs" } },
        { id: `section-${Date.now()}-2`, type: "services", title: "Service List", isActive: true, order: 2, content: { layout: "detailed" } },
        { id: `section-${Date.now()}-3`, type: "features", title: "Why Choose Us", isActive: true, order: 3, content: {} },
        { id: `section-${Date.now()}-4`, type: "cta", title: "Get Started", isActive: true, order: 4, content: { title: "Ready to work together?", buttonText: "Request Quote" } },
      ],
      showInHeader: true,
      showInFooter: true,
    },
    blog: {
      title: "Blog",
      slug: "blog",
      metaTitle: "Blog - Latest News & Insights",
      metaDescription: "Stay updated with the latest industry news, tips, and insights.",
      sections: [
        { id: `section-${Date.now()}-1`, type: "hero", title: "Blog Hero", isActive: true, order: 1, content: { headline: "Our Blog", subheadline: "Insights and updates" } },
        { id: `section-${Date.now()}-2`, type: "blog", title: "Latest Posts", isActive: true, order: 2, content: {} },
      ],
      showInHeader: true,
      showInFooter: true,
    },
    careers: {
      title: "Careers",
      slug: "careers",
      metaTitle: "Careers - Join Our Team",
      metaDescription: "Explore career opportunities and join our growing team.",
      sections: [
        { id: `section-${Date.now()}-1`, type: "hero", title: "Careers Hero", isActive: true, order: 1, content: { headline: "Join Our Team", subheadline: "Build your career with us" } },
        { id: `section-${Date.now()}-2`, type: "text", title: "Why Work Here", isActive: true, order: 2, content: { text: "We offer competitive benefits and a collaborative environment..." } },
        { id: `section-${Date.now()}-3`, type: "cta", title: "Apply Now", isActive: true, order: 3, content: { title: "Ready to apply?", buttonText: "View Openings" } },
      ],
      showInHeader: true,
      showInFooter: true,
    },
    privacy: {
      title: "Privacy Policy",
      slug: "privacy-policy",
      metaTitle: "Privacy Policy",
      metaDescription: "Our privacy policy and data protection practices.",
      sections: [
        { id: `section-${Date.now()}-1`, type: "text", title: "Privacy Policy", isActive: true, order: 1, content: { text: "Privacy policy content..." } },
      ],
      showInHeader: false,
      showInFooter: true,
    },
    terms: {
      title: "Terms of Service",
      slug: "terms-of-service",
      metaTitle: "Terms of Service",
      metaDescription: "Our terms of service and legal agreements.",
      sections: [
        { id: `section-${Date.now()}-1`, type: "text", title: "Terms of Service", isActive: true, order: 1, content: { text: "Terms of service content..." } },
      ],
      showInHeader: false,
      showInFooter: true,
    },
    cookies: {
      title: "Cookie Policy",
      slug: "cookie-policy",
      metaTitle: "Cookie Policy",
      metaDescription: "Information about how we use cookies.",
      sections: [
        { id: `section-${Date.now()}-1`, type: "text", title: "Cookie Policy", isActive: true, order: 1, content: { text: "Cookie policy content..." } },
      ],
      showInHeader: false,
      showInFooter: true,
    },
    contact: {
      title: "Contact Us",
      slug: "contact",
      metaTitle: "Contact Us - Get in Touch",
      metaDescription: "Contact us for inquiries, quotes, or support.",
      sections: [
        { id: `section-${Date.now()}-1`, type: "hero", title: "Contact Hero", isActive: true, order: 1, content: { headline: "Contact Us", subheadline: "We'd love to hear from you" } },
        { id: `section-${Date.now()}-2`, type: "contact", title: "Contact Form", isActive: true, order: 2, content: {} },
        { id: `section-${Date.now()}-3`, type: "text", title: "Office Info", isActive: true, order: 3, content: { text: "Visit our office or reach out online..." } },
      ],
      showInHeader: true,
      showInFooter: true,
    },
    quote: {
      title: "Get Quote",
      slug: "quote",
      metaTitle: "Request a Quote",
      metaDescription: "Get a free quote for your construction project.",
      sections: [
        { id: `section-${Date.now()}-1`, type: "hero", title: "Quote Hero", isActive: true, order: 1, content: { headline: "Get a Free Quote", subheadline: "Tell us about your project" } },
        { id: `section-${Date.now()}-2`, type: "contact", title: "Quote Form", isActive: true, order: 2, content: { type: "quote" } },
        { id: `section-${Date.now()}-3`, type: "faq", title: "FAQ", isActive: true, order: 3, content: {} },
      ],
      showInHeader: true,
      showInFooter: false,
    },
    blank: {
      title: "New Page",
      slug: `page-${Date.now()}`,
      metaTitle: "",
      metaDescription: "",
      sections: [],
      showInHeader: false,
      showInFooter: false,
    },
  }

  const createCustomPage = async (templateKey: string = "blank") => {
    setCreatingWithTemplate(true)
    const template = pageTemplates[templateKey as keyof typeof pageTemplates] || pageTemplates.blank
    
    const newPage = {
      title: template.title,
      slug: template.slug === `page-${Date.now()}` ? `page-${Date.now()}` : template.slug,
      metaTitle: template.metaTitle,
      metaDescription: template.metaDescription,
      sections: template.sections,
      isPublished: false,
      showInHeader: template.showInHeader,
      showInFooter: template.showInFooter,
      isDefault: false,
      order: pages.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      const docRef = await addDoc(collection(db, "pages"), newPage)
      setPages([{ id: docRef.id, ...newPage }, ...pages])
      setExpandedPage(docRef.id)
      setTemplateDialogOpen(false)
      setSelectedTemplate(null)
    } catch (err) {
      console.error("Error creating page:", err)
      setError("Failed to create page")
    } finally {
      setCreatingWithTemplate(false)
    }
  }

  // Open delete confirmation dialog
  const confirmDelete = (pageId: string, pageTitle: string) => {
    setPageToDelete({ id: pageId, title: pageTitle })
    setDeleteDialogOpen(true)
  }

  // Execute delete after confirmation
  const handleDelete = async () => {
    if (!pageToDelete) return
    
    setDeleting(true)
    try {
      setError(null)
      await deleteDoc(doc(db, "pages", pageToDelete.id))
      setPages(pages.filter((p) => p.id !== pageToDelete.id))
      setDeleteDialogOpen(false)
      setPageToDelete(null)
    } catch (err) {
      console.error("Error deleting page:", err)
      setError("Failed to delete page. Please check your permissions.")
    } finally {
      setDeleting(false)
    }
  }

  // Navigation Settings State
  const [navSettings, setNavSettings] = useState({
    siteName: "PKonstruct",
    headerLogo: "",
    headerBgColor: "#ffffff",
    headerTextColor: "#1c1917",
    footerDescription: "Building excellence since 2005. We transform your vision into reality with quality craftsmanship and innovative solutions.",
    footerCopyright: "© 2024 PKonstruct. All rights reserved.",
    footerBgColor: "#1c1917",
    footerTextColor: "#ffffff",
    socialLinks: [
      { platform: "Facebook", url: "", icon: "Facebook", isActive: false },
      { platform: "Twitter", url: "", icon: "Twitter", isActive: false },
      { platform: "Instagram", url: "", icon: "Instagram", isActive: false },
      { platform: "LinkedIn", url: "", icon: "LinkedIn", isActive: false },
      { platform: "YouTube", url: "", icon: "YouTube", isActive: false },
    ] as { platform: string; url: string; icon: string; isActive: boolean }[],
    footerColumns: [] as { title: string; links: { label: string; url: string }[] }[],
  })
  const [loadingNavSettings, setLoadingNavSettings] = useState(false)

  // Load navigation settings
  useEffect(() => {
    if (activeView === "navigation") {
      loadNavSettings()
    }
  }, [activeView])

  const loadNavSettings = async () => {
    try {
      const docRef = doc(db, "settings", "navigation")
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setNavSettings(prev => ({ ...prev, ...docSnap.data() }))
      }
    } catch (err) {
      console.error("Error loading nav settings:", err)
    }
  }

  const saveNavSettings = async (updates: Partial<typeof navSettings>) => {
    setLoadingNavSettings(true)
    try {
      const docRef = doc(db, "settings", "navigation")
      const newSettings = { ...navSettings, ...updates }
      await setDoc(docRef, {
        ...newSettings,
        updatedAt: new Date().toISOString(),
      })
      setNavSettings(newSettings)
    } catch (err) {
      console.error("Error saving nav settings:", err)
    } finally {
      setLoadingNavSettings(false)
    }
  }

  // Navigation Manager Component
  function NavigationManager() {
    const headerPages = pages
      .filter(p => p.showInHeader && p.isPublished)
      .sort((a, b) => a.order - b.order)
    
    const footerPages = pages
      .filter(p => p.showInFooter && p.isPublished)
      .sort((a, b) => a.order - b.order)

    // Local form state to prevent auto-scroll on every keystroke
    const [formState, setFormState] = useState(navSettings)
    const [hasChanges, setHasChanges] = useState(false)

    // Sync formState when navSettings loads
    useEffect(() => {
      setFormState(navSettings)
    }, [navSettings])

    // Update form state without saving to Firebase
    const updateFormState = (updates: Partial<typeof navSettings>) => {
      setFormState(prev => ({ ...prev, ...updates }))
      setHasChanges(true)
    }

    // Save all changes to Firebase
    const handleSaveAll = async () => {
      await saveNavSettings(formState)
      setHasChanges(false)
    }

    const updateNavOrder = async (pageId: string, newOrder: number) => {
      const page = pages.find(p => p.id === pageId)
      if (!page) return
      
      const updated = { ...page, order: newOrder }
      setPages(pages.map((p) => (p.id === pageId ? updated : p)))
      await handleSavePage(updated)
    }

    const moveNavItem = async (pageId: string, direction: 'up' | 'down', isHeader: boolean) => {
      const list = isHeader ? headerPages : footerPages
      const index = list.findIndex(p => p.id === pageId)
      if (index === -1) return

      const newOrder = direction === 'up' 
        ? (index > 0 ? list[index - 1].order - 1 : list[0].order - 1)
        : (index < list.length - 1 ? list[index + 1].order + 1 : list[list.length - 1].order + 1)

      await updateNavOrder(pageId, newOrder)
    }

    return (
      <div className="space-y-6">
        {/* Save Changes Button - Sticky Top */}
        {hasChanges && (
          <div className="sticky top-4 z-50 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between shadow-lg">
            <span className="text-amber-800 font-medium">You have unsaved changes</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setFormState(navSettings)
                  setHasChanges(false)
                }}
                disabled={loadingNavSettings}
              >
                Reset
              </Button>
              <Button
                onClick={handleSaveAll}
                disabled={loadingNavSettings}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {loadingNavSettings ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Header Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">🎨</span> Header Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Site Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Name</label>
              <Input
                value={formState.siteName}
                onChange={(e) => updateFormState({ siteName: e.target.value })}
                placeholder="Your Company Name"
              />
              <p className="text-xs text-stone-500">Company name shown in header and footer</p>
            </div>
            
            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Logo</label>
              <div className="flex items-center gap-4">
                {formState.headerLogo && (
                  <img 
                    src={formState.headerLogo} 
                    alt="Current Logo" 
                    className="h-12 w-auto rounded border"
                  />
                )}
                <div className="flex-1">
                  <ImageUpload
                    value={formState.headerLogo}
                    onChange={(url) => updateFormState({ headerLogo: url })}
                    folder="pkonstruct/logo"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formState.headerBgColor}
                    onChange={(e) => updateFormState({ headerBgColor: e.target.value })}
                    className="h-10 w-20 rounded border"
                  />
                  <Input
                    value={formState.headerBgColor}
                    onChange={(e) => updateFormState({ headerBgColor: e.target.value })}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formState.headerTextColor}
                  onChange={(e) => updateFormState({ headerTextColor: e.target.value })}
                  className="h-10 w-20 rounded border"
                />
                <Input
                  value={formState.headerTextColor}
                  onChange={(e) => updateFormState({ headerTextColor: e.target.value })}
                  placeholder="#1c1917"
                />
              </div>
            </div>
            {/* Preview */}
            <div 
              className="p-4 rounded-lg border mt-4"
              style={{ 
                backgroundColor: formState.headerBgColor,
                color: formState.headerTextColor 
              }}
            >
              <div className="flex items-center gap-4">
                {formState.headerLogo ? (
                  <img src={formState.headerLogo} alt="Logo" className="h-8 w-auto" />
                ) : (
                  <span className="font-bold text-lg">{formState.siteName.charAt(0)}</span>
                )}
                <span className="font-bold text-lg">{formState.siteName}</span>
                <span className="text-sm opacity-75 ml-auto">Navigation Preview</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Header Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">📍</span> Header Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {headerPages.length === 0 ? (
              <p className="text-stone-500 text-center py-4">No pages set to show in header. Enable "Show in Header" in page settings.</p>
            ) : (
              <div className="space-y-2">
                {headerPages.map((page, index) => (
                  <div key={page.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveNavItem(page.id, 'up', true)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveNavItem(page.id, 'down', true)}
                          disabled={index === headerPages.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <p className="font-medium">{page.title}</p>
                        <p className="text-sm text-stone-500">/{page.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-stone-400">Order: {page.order}</span>
                      <input
                        type="checkbox"
                        checked={page.showInHeader}
                        onChange={async (e) => {
                          const updated = { ...page, showInHeader: e.target.checked }
                          setPages(pages.map((p) => (p.id === page.id ? updated : p)))
                          await handleSavePage(updated)
                        }}
                        className="rounded border-stone-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">🦶</span> Footer Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {footerPages.length === 0 ? (
              <p className="text-stone-500 text-center py-4">No pages set to show in footer. Enable "Show in Footer" in page settings.</p>
            ) : (
              <div className="space-y-2">
                {footerPages.map((page, index) => (
                  <div key={page.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveNavItem(page.id, 'up', false)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveNavItem(page.id, 'down', false)}
                          disabled={index === footerPages.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <p className="font-medium">{page.title}</p>
                        <p className="text-sm text-stone-500">/{page.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-stone-400">Order: {page.order}</span>
                      <input
                        type="checkbox"
                        checked={page.showInFooter}
                        onChange={async (e) => {
                          const updated = { ...page, showInFooter: e.target.checked }
                          setPages(pages.map((p) => (p.id === page.id ? updated : p)))
                          await handleSavePage(updated)
                        }}
                        className="rounded border-stone-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">🎨</span> Footer Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Footer Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Footer Description / Tagline</label>
              <textarea
                value={formState.footerDescription}
                onChange={(e) => updateFormState({ footerDescription: e.target.value })}
                placeholder="Brief description of your company..."
                rows={3}
                className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm resize-none"
              />
            </div>

            {/* Social Media Links */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Social Media Links</label>
              <div className="space-y-2">
                {formState.socialLinks.map((social, index) => (
                  <div key={social.platform} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={social.isActive}
                      onChange={(e) => {
                        const newLinks = [...formState.socialLinks]
                        newLinks[index] = { ...social, isActive: e.target.checked }
                        updateFormState({ socialLinks: newLinks })
                      }}
                      className="rounded border-stone-300"
                    />
                    <span className="text-sm w-24">{social.platform}</span>
                    <Input
                      value={social.url}
                      onChange={(e) => {
                        const newLinks = [...formState.socialLinks]
                        newLinks[index] = { ...social, url: e.target.value, isActive: e.target.value ? true : social.isActive }
                        updateFormState({ socialLinks: newLinks })
                      }}
                      placeholder={`https://${social.platform.toLowerCase()}.com/yourpage`}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Copyright Text</label>
              <Input
                value={formState.footerCopyright}
                onChange={(e) => updateFormState({ footerCopyright: e.target.value })}
                placeholder="© 2024 Your Company. All rights reserved."
              />
            </div>

            {/* Footer Columns */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Footer Columns</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newColumns = [...formState.footerColumns, { title: "New Column", links: [] }]
                    updateFormState({ footerColumns: newColumns })
                  }}
                  disabled={formState.footerColumns.length >= 4}
                >
                  + Add Column
                </Button>
              </div>
              <p className="text-xs text-stone-500">Custom columns appear beside Services, Company, and Legal sections</p>
              
              {formState.footerColumns.map((column, colIndex) => (
                <div key={colIndex} className="border rounded-lg p-3 space-y-2 bg-stone-50">
                  <div className="flex items-center gap-2">
                    <Input
                      value={column.title}
                      onChange={(e) => {
                        const newColumns = [...formState.footerColumns]
                        newColumns[colIndex] = { ...column, title: e.target.value }
                        updateFormState({ footerColumns: newColumns })
                      }}
                      placeholder="Column Title"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newColumns = formState.footerColumns.filter((_, i) => i !== colIndex)
                        updateFormState({ footerColumns: newColumns })
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    {column.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="flex items-center gap-2">
                        <Input
                          value={link.label}
                          onChange={(e) => {
                            const newColumns = [...formState.footerColumns]
                            const newLinks = [...column.links]
                            newLinks[linkIndex] = { ...link, label: e.target.value }
                            newColumns[colIndex] = { ...column, links: newLinks }
                            updateFormState({ footerColumns: newColumns })
                          }}
                          placeholder="Link Label"
                          className="flex-1"
                        />
                        <Input
                          value={link.url}
                          onChange={(e) => {
                            const newColumns = [...formState.footerColumns]
                            const newLinks = [...column.links]
                            newLinks[linkIndex] = { ...link, url: e.target.value }
                            newColumns[colIndex] = { ...column, links: newLinks }
                            updateFormState({ footerColumns: newColumns })
                          }}
                          placeholder="URL"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newColumns = [...formState.footerColumns]
                            newColumns[colIndex] = { 
                              ...column, 
                              links: column.links.filter((_, i) => i !== linkIndex) 
                            }
                            updateFormState({ footerColumns: newColumns })
                          }}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newColumns = [...formState.footerColumns]
                        newColumns[colIndex] = { 
                          ...column, 
                          links: [...column.links, { label: "", url: "" }] 
                        }
                        updateFormState({ footerColumns: newColumns })
                      }}
                    >
                      + Add Link
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formState.footerBgColor}
                    onChange={(e) => updateFormState({ footerBgColor: e.target.value })}
                    className="h-10 w-20 rounded border"
                  />
                  <Input
                    value={formState.footerBgColor}
                    onChange={(e) => updateFormState({ footerBgColor: e.target.value })}
                    placeholder="#1c1917"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formState.footerTextColor}
                    onChange={(e) => updateFormState({ footerTextColor: e.target.value })}
                    className="h-10 w-20 rounded border"
                  />
                  <Input
                    value={formState.footerTextColor}
                    onChange={(e) => updateFormState({ footerTextColor: e.target.value })}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
            {/* Preview */}
            <div 
              className="p-6 rounded-lg border mt-4"
              style={{ 
                backgroundColor: formState.footerBgColor,
                color: formState.footerTextColor 
              }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">
                    {formState.headerLogo ? "Logo" : formState.siteName.charAt(0)}
                  </span>
                  <span className="font-bold text-lg">{formState.siteName}</span>
                </div>
                <p className="text-sm opacity-90 max-w-sm">{formState.footerDescription}</p>
                <div className="flex gap-2">
                  {formState.socialLinks.filter(s => s.isActive && s.url).length > 0 ? (
                    formState.socialLinks.filter(s => s.isActive && s.url).map(social => (
                      <span key={social.platform} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs">
                        {social.platform.charAt(0)}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs opacity-50">No active social links</span>
                  )}
                </div>
                <p className="text-sm text-center pt-2 border-t border-white/20">{formState.footerCopyright}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {activeView === "navigation" ? "Navigation Manager" : "Pages"}
          </h1>
          <p className="text-stone-500">
            {activeView === "navigation" 
              ? "Manage header and footer navigation order" 
              : "Manage website pages and content"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-stone-100 rounded-lg p-1">
            <Button
              variant={activeView === "pages" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("pages")}
              className={activeView === "pages" ? "bg-amber-600" : ""}
            >
              Pages
            </Button>
            <Button
              variant={activeView === "navigation" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("navigation")}
              className={activeView === "navigation" ? "bg-amber-600" : ""}
            >
              Navigation
            </Button>
          </div>
          {activeView === "pages" && (
            <Button 
              onClick={() => {
                setSelectedTemplate(null)
                setTemplateDialogOpen(true)
              }} 
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Custom Page
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filter Bar */}
      {activeView === "pages" && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search pages by title or slug..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "all" | "published" | "draft")
                setCurrentPage(1)
              }}
              className="px-3 py-2 border border-stone-200 rounded-md text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      )}

      {activeView === "navigation" ? (
        <NavigationManager />
      ) : (
      <>
      {/* Filtered and Paginated Pages */}
      {(() => {
        // Filter pages
        const filteredPages = pages.filter(page => {
          const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               page.slug.toLowerCase().includes(searchQuery.toLowerCase())
          const matchesStatus = statusFilter === "all" ||
                               (statusFilter === "published" && page.isPublished) ||
                               (statusFilter === "draft" && !page.isPublished)
          return matchesSearch && matchesStatus
        })
        
        // Pagination
        const totalPages = Math.ceil(filteredPages.length / itemsPerPage)
        const paginatedPages = filteredPages.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
        
        return (
          <>
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-stone-500">
                Showing {paginatedPages.length} of {filteredPages.length} pages
              </p>
            </div>
            
            <div className="space-y-4">
              {paginatedPages.map((page) => (
          <Card key={page.id} className={expandedPage === page.id ? "border-amber-600" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                    <p className="text-sm text-stone-500">/{page.slug}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      page.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-stone-100 text-stone-800"
                    }`}
                  >
                    {page.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/${page.slug}`} target="_blank">
                    <Button variant="ghost" size="sm" title="View page">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/pages/${page.id}`}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-amber-50"
                      title="Edit page content"
                    >
                      <Settings className="h-4 w-4 text-amber-600" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDelete(page.id, page.title)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete page"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-6">
                {/* Quick Settings Row */}
                <div className="flex items-center gap-4 py-2 border-b border-stone-100">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={page.isPublished}
                      onChange={async (e) => {
                        const updated = { ...page, isPublished: e.target.checked }
                        setPages(pages.map((p) => (p.id === page.id ? updated : p)))
                        await handleSavePage(updated)
                      }}
                      className="rounded border-stone-300"
                    />
                    Published
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={page.showInHeader}
                      onChange={async (e) => {
                        const updated = { ...page, showInHeader: e.target.checked }
                        setPages(pages.map((p) => (p.id === page.id ? updated : p)))
                        await handleSavePage(updated)
                      }}
                      className="rounded border-stone-300"
                    />
                    Show in Header
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={page.showInFooter}
                      onChange={async (e) => {
                        const updated = { ...page, showInFooter: e.target.checked }
                        setPages(pages.map((p) => (p.id === page.id ? updated : p)))
                        await handleSavePage(updated)
                      }}
                      className="rounded border-stone-300"
                    />
                    Show in Footer
                  </label>
                </div>

                {/* Page Content Preview & Edit Link */}
                <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm text-stone-500">{page.sections.length} section(s)</span>
                      <span className="mx-2 text-stone-300">•</span>
                      <span className="text-sm text-stone-500">
                        {page.sections.filter(s => s.isActive).length} active
                      </span>
                    </div>
                    <Link href={`/admin/pages/${page.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white hover:bg-amber-50"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Manage Content
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Quick Preview of Sections */}
                  <div className="space-y-2">
                    {page.sections
                      .sort((a, b) => a.order - b.order)
                      .slice(0, 3)
                      .map((section) => (
                        <div 
                          key={section.id} 
                          className={`flex items-center gap-2 p-2 rounded ${
                            section.isActive ? 'bg-white' : 'bg-stone-100 opacity-50'
                          }`}
                        >
                          <span className="text-sm">
                            {sectionTypes.find((t) => t.type === section.type)?.icon || "📦"}
                          </span>
                          <span className="text-sm text-stone-700">
                            {sectionTypes.find((t) => t.type === section.type)?.label || section.type}
                          </span>
                          {section.title && (
                            <span className="text-sm text-stone-400">- {section.title}</span>
                          )}
                          {!section.isActive && (
                            <span className="text-xs text-stone-400 ml-auto">(inactive)</span>
                          )}
                        </div>
                      ))}
                    {page.sections.length > 3 && (
                      <p className="text-sm text-stone-400 text-center py-1">
                        +{page.sections.length - 3} more sections...
                      </p>
                    )}
                    {page.sections.length === 0 && (
                      <p className="text-sm text-stone-400 text-center py-4">
                        No sections yet. Click "Manage Content" to add widgets.
                      </p>
                    )}
                  </div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{pageToDelete?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPageToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Template Selection Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Choose a Page Template</DialogTitle>
            <DialogDescription>
              Select a template to start with pre-built sections, or start blank.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6">
            {/* Blank Template */}
            <button
              onClick={() => createCustomPage("blank")}
              disabled={creatingWithTemplate}
              className="group relative flex flex-col items-center p-6 border-2 border-dashed border-stone-300 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-center"
            >
              <div className="w-16 h-16 mb-4 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-white">
                <Plus className="h-8 w-8 text-stone-400 group-hover:text-amber-600" />
              </div>
              <h3 className="font-semibold text-stone-900">Blank Page</h3>
              <p className="text-sm text-stone-500 mt-1">Start from scratch</p>
            </button>

            {/* Homepage Template */}
            <button
              onClick={() => createCustomPage("homepage")}
              disabled={creatingWithTemplate}
              className="group relative flex flex-col p-6 border rounded-xl hover:border-amber-500 hover:shadow-lg transition-all text-left"
            >
              <div className="w-full h-24 mb-4 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                <span className="text-white font-bold">Home</span>
              </div>
              <h3 className="font-semibold text-stone-900">Homepage</h3>
              <p className="text-sm text-stone-500 mt-1">Hero, Services, Projects, Testimonials, CTA</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Hero</span>
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Services</span>
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Projects</span>
              </div>
            </button>

            {/* About Us Template */}
            <button
              onClick={() => createCustomPage("about")}
              disabled={creatingWithTemplate}
              className="group relative flex flex-col p-6 border rounded-xl hover:border-amber-500 hover:shadow-lg transition-all text-left"
            >
              <div className="w-full h-24 mb-4 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <span className="text-white font-bold">About</span>
              </div>
              <h3 className="font-semibold text-stone-900">About Us</h3>
              <p className="text-sm text-stone-500 mt-1">Hero, Story, Team, Stats</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Hero</span>
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Team</span>
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Stats</span>
              </div>
            </button>

            {/* Services Template */}
            <button
              onClick={() => createCustomPage("services")}
              disabled={creatingWithTemplate}
              className="group relative flex flex-col p-6 border rounded-xl hover:border-amber-500 hover:shadow-lg transition-all text-left"
            >
              <div className="w-full h-24 mb-4 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <span className="text-white font-bold">Services</span>
              </div>
              <h3 className="font-semibold text-stone-900">Services Page</h3>
              <p className="text-sm text-stone-500 mt-1">Hero, Service List, Features, CTA</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Services</span>
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Features</span>
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">CTA</span>
              </div>
            </button>

            {/* Projects Template */}
            <button
              onClick={() => createCustomPage("projects")}
              disabled={creatingWithTemplate}
              className="group relative flex flex-col p-6 border rounded-xl hover:border-amber-500 hover:shadow-lg transition-all text-left"
            >
              <div className="w-full h-24 mb-4 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <span className="text-white font-bold">Projects</span>
              </div>
              <h3 className="font-semibold text-stone-900">Projects Portfolio</h3>
              <p className="text-sm text-stone-500 mt-1">Hero, Project Gallery, CTA</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Hero</span>
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Projects</span>
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">CTA</span>
              </div>
            </button>

            {/* Blog Template */}
            <button
              onClick={() => createCustomPage("blog")}
              disabled={creatingWithTemplate}
              className="group relative flex flex-col p-6 border rounded-xl hover:border-amber-500 hover:shadow-lg transition-all text-left"
            >
              <div className="w-full h-24 mb-4 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                <span className="text-white font-bold">Blog</span>
              </div>
              <h3 className="font-semibold text-stone-900">Blog Page</h3>
              <p className="text-sm text-stone-500 mt-1">Hero, Blog Posts Grid</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Hero</span>
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Blog Grid</span>
              </div>
            </button>

            {/* Contact Template */}
            <button
              onClick={() => createCustomPage("contact")}
              disabled={creatingWithTemplate}
              className="group relative flex flex-col p-6 border rounded-xl hover:border-amber-500 hover:shadow-lg transition-all text-left"
            >
              <div className="w-full h-24 mb-4 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                <span className="text-white font-bold">Contact</span>
              </div>
              <h3 className="font-semibold text-stone-900">Contact Us</h3>
              <p className="text-sm text-stone-500 mt-1">Hero, Contact Form, Office Info</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Hero</span>
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Contact Form</span>
              </div>
            </button>

            {/* Quote Template */}
            <button
              onClick={() => createCustomPage("quote")}
              disabled={creatingWithTemplate}
              className="group relative flex flex-col p-6 border rounded-xl hover:border-amber-500 hover:shadow-lg transition-all text-left"
            >
              <div className="w-full h-24 mb-4 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <span className="text-white font-bold">Quote</span>
              </div>
              <h3 className="font-semibold text-stone-900">Get Quote</h3>
              <p className="text-sm text-stone-500 mt-1">Hero, Quote Form, FAQ</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Hero</span>
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Quote Form</span>
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">FAQ</span>
              </div>
            </button>

            {/* Careers Template */}
            <button
              onClick={() => createCustomPage("careers")}
              disabled={creatingWithTemplate}
              className="group relative flex flex-col p-6 border rounded-xl hover:border-amber-500 hover:shadow-lg transition-all text-left"
            >
              <div className="w-full h-24 mb-4 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                <span className="text-white font-bold">Careers</span>
              </div>
              <h3 className="font-semibold text-stone-900">Careers</h3>
              <p className="text-sm text-stone-500 mt-1">Hero, Why Work Here, Apply CTA</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Hero</span>
                <span className="text-xs px-2 py-0.5 bg-stone-100 rounded">Benefits</span>
              </div>
            </button>

            {/* Legal Pages Group */}
            <div className="col-span-2 md:col-span-3 mt-4">
              <h4 className="text-sm font-medium text-stone-500 mb-3">Legal Pages</h4>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => createCustomPage("privacy")}
                  disabled={creatingWithTemplate}
                  className="group flex flex-col p-4 border rounded-lg hover:border-amber-500 transition-all text-left"
                >
                  <div className="w-full h-16 mb-3 rounded bg-stone-200 flex items-center justify-center">
                    <span className="text-stone-600 font-medium text-sm">Privacy</span>
                  </div>
                  <h3 className="font-medium text-stone-900 text-sm">Privacy Policy</h3>
                </button>

                <button
                  onClick={() => createCustomPage("terms")}
                  disabled={creatingWithTemplate}
                  className="group flex flex-col p-4 border rounded-lg hover:border-amber-500 transition-all text-left"
                >
                  <div className="w-full h-16 mb-3 rounded bg-stone-200 flex items-center justify-center">
                    <span className="text-stone-600 font-medium text-sm">Terms</span>
                  </div>
                  <h3 className="font-medium text-stone-900 text-sm">Terms of Service</h3>
                </button>

                <button
                  onClick={() => createCustomPage("cookies")}
                  disabled={creatingWithTemplate}
                  className="group flex flex-col p-4 border rounded-lg hover:border-amber-500 transition-all text-left"
                >
                  <div className="w-full h-16 mb-3 rounded bg-stone-200 flex items-center justify-center">
                    <span className="text-stone-600 font-medium text-sm">Cookies</span>
                  </div>
                  <h3 className="font-medium text-stone-900 text-sm">Cookie Policy</h3>
                </button>
              </div>
            </div>
          </div>

          {creatingWithTemplate && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
              <span className="ml-2 text-stone-600">Creating page...</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
