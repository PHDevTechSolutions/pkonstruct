import { Metadata } from "next"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { DynamicPage } from "@/components/dynamic-page"

interface PageData {
  id: string
  title: string
  slug: string
  metaTitle?: string
  metaDescription?: string
  sections: any[]
  isPublished: boolean
}

async function getDefaultPage(): Promise<PageData | null> {
  try {
    // First try to find page marked as default
    const q = query(collection(db, "pages"), where("isDefault", "==", true))
    const snapshot = await getDocs(q)
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      return { id: doc.id, ...doc.data() } as PageData
    }
    
    // Fallback: find published home page
    const homeQuery = query(collection(db, "pages"), where("slug", "==", "home"))
    const homeSnapshot = await getDocs(homeQuery)
    
    if (!homeSnapshot.empty) {
      const doc = homeSnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as PageData
    }
    
    return null
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDefaultPage()
  
  if (!page) {
    return {
      title: "PKonstruct | Building Excellence Since 2005",
    }
  }
  
  return {
    title: page.metaTitle || `${page.title} | PKonstruct`,
    description: page.metaDescription || `Welcome to ${page.title}`,
  }
}

export default async function HomePage() {
  const page = await getDefaultPage()
  
  return (
    <main className="flex-1">
      <DynamicPage page={{ sections: page?.sections || [] }} />
    </main>
  )
}
