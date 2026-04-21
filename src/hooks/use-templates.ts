"use client"

import { useState, useEffect, useCallback } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, collection, getDocs, writeBatch, deleteDoc } from "firebase/firestore"

export interface Template {
  id: string
  name: string
  description: string
  thumbnail?: string
  pages: Record<string, {
    title: string
    slug: string
    metaTitle: string
    metaDescription: string
    sections: any[]
    showInHeader: boolean
    showInFooter: boolean
    isPublished: boolean
  }>
  navigation: {
    siteName: string
    headerLogo?: string
    headerBgColor: string
    headerTextColor: string
    footerDescription: string
    footerCopyright: string
    footerBgColor: string
    footerTextColor: string
    socialLinks: any[]
    footerColumns: any[]
  }
  styles: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
  }
}

export interface ActiveTemplate {
  id: string
  name: string
  appliedAt: string
}

// Available templates from the templates directory
const AVAILABLE_TEMPLATES = [
  { id: "construction", name: "Construction & Building", description: "Professional template for construction companies", folder: "construction" },
  { id: "cleaning-services", name: "Cleaning Services", description: "Template for cleaning and maintenance companies", folder: "cleaning-services" },
  { id: "it-consultant", name: "IT Consultant & Technology", description: "Premium template for IT consulting firms with dark theme and enterprise solutions", folder: "it-consultant" },
]

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [activeTemplate, setActiveTemplate] = useState<ActiveTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load available templates and active template
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true)
        
        // Load template metadata
        const templateList = AVAILABLE_TEMPLATES
        
        // Load full template data from JSON files
        const loadedTemplates = await Promise.all(
          templateList.map(async (t) => {
            try {
              const response = await fetch(`/templates/${t.folder}/template.json`)
              if (response.ok) {
                const data = await response.json()
                return { ...data, id: t.id, name: t.name, description: t.description }
              }
            } catch (err) {
              console.error(`Failed to load template ${t.id}:`, err)
            }
            return null
          })
        )
        
        setTemplates(loadedTemplates.filter(Boolean) as Template[])
        
        // Load active template from Firestore
        const activeDoc = await getDoc(doc(db, "settings", "activeTemplate"))
        if (activeDoc.exists()) {
          setActiveTemplate(activeDoc.data() as ActiveTemplate)
        }
      } catch (err) {
        console.error("Error loading templates:", err)
        setError("Failed to load templates")
      } finally {
        setLoading(false)
      }
    }
    
    loadTemplates()
  }, [])

  // Apply a template
  const applyTemplate = useCallback(async (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) {
      setError("Template not found")
      return false
    }

    setApplying(true)
    setError(null)

    try {
      const batch = writeBatch(db)

      // 1. Clear existing pages (optional - or merge)
      // For now, let's add template pages alongside existing ones
      
      // 2. Create pages from template
      const pagesCollection = collection(db, "pages")
      const createdPages: string[] = []
      
      for (const [pageKey, pageData] of Object.entries(template.pages)) {
        const pageRef = doc(pagesCollection)
        const timestamp = new Date().toISOString()
        
        batch.set(pageRef, {
          ...pageData,
          id: pageRef.id,
          templateSource: templateId,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
        
        createdPages.push(pageRef.id)
      }

      // 3. Apply navigation settings
      const navRef = doc(db, "settings", "navigation")
      batch.set(navRef, {
        ...template.navigation,
        templateSource: templateId,
        updatedAt: new Date().toISOString(),
      })

      // 4. Apply styles
      const stylesRef = doc(db, "settings", "styles")
      batch.set(stylesRef, {
        ...template.styles,
        templateSource: templateId,
        updatedAt: new Date().toISOString(),
      })

      // 5. Save active template reference
      const activeRef = doc(db, "settings", "activeTemplate")
      batch.set(activeRef, {
        id: templateId,
        name: template.name,
        appliedAt: new Date().toISOString(),
      })

      // Commit all changes
      await batch.commit()

      setActiveTemplate({
        id: templateId,
        name: template.name,
        appliedAt: new Date().toISOString(),
      })

      return true
    } catch (err) {
      console.error("Error applying template:", err)
      setError("Failed to apply template")
      return false
    } finally {
      setApplying(false)
    }
  }, [templates])

  // Get template preview data
  const getTemplatePreview = useCallback((templateId: string) => {
    return templates.find(t => t.id === templateId)
  }, [templates])

  // Reset to default (clear template)
  const resetTemplate = useCallback(async () => {
    setApplying(true)
    try {
      // Delete active template reference
      await deleteDoc(doc(db, "settings", "activeTemplate"))
      setActiveTemplate(null)
      return true
    } catch (err) {
      console.error("Error resetting template:", err)
      setError("Failed to reset template")
      return false
    } finally {
      setApplying(false)
    }
  }, [])

  return {
    templates,
    activeTemplate,
    loading,
    applying,
    error,
    applyTemplate,
    getTemplatePreview,
    resetTemplate,
  }
}
