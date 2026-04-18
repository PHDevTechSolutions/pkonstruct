import { Metadata } from "next"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { DynamicPage } from "@/components/dynamic-page"
import { notFound } from "next/navigation"

interface PageData {
  id: string
  title: string
  slug: string
  metaTitle?: string
  metaDescription?: string
  sections: any[]
  isPublished: boolean
}

async function getPageBySlug(slug: string): Promise<PageData | null> {
  try {
    const q = query(collection(db, "pages"), where("slug", "==", slug))
    const snapshot = await getDocs(q)
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      return { id: doc.id, ...doc.data() } as PageData
    }
    return null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  
  if (!page) {
    return {
      title: "Page Not Found | PKonstruct",
    }
  }
  
  return {
    title: page.metaTitle || `${page.title} | PKonstruct`,
    description: page.metaDescription || `Learn more about ${page.title}`,
  }
}

export async function generateStaticParams() {
  try {
    const snapshot = await getDocs(collection(db, "pages"))
    return snapshot.docs.map((doc) => ({
      slug: doc.data().slug || doc.id,
    }))
  } catch {
    return []
  }
}

export default async function DynamicPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  
  if (!page || !page.isPublished) {
    notFound()
  }
  
  return (
    <main className="min-h-screen">
      <DynamicPage page={{ sections: page.sections }} />
    </main>
  )
}
