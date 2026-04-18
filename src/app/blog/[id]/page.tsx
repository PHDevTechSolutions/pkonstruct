import { Metadata } from "next"
import { BlogPostClient } from "./BlogPostClient"
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"

interface BlogPostData {
  id: string
  title: string
  excerpt: string
  metaTitle?: string
  metaDescription?: string
  slug?: string
  tags?: string[]
  category: string
  image?: string
}

// Fetch all post IDs and slugs dynamically at build time
export async function generateStaticParams() {
  try {
    const snapshot = await getDocs(collection(db, "blogPosts"))
    const params: { id: string }[] = []
    
    snapshot.docs.forEach((doc) => {
      const data = doc.data()
      // Add document ID
      params.push({ id: doc.id })
      // Add custom slug if it exists and is different from ID
      if (data.slug && data.slug !== doc.id) {
        params.push({ id: data.slug })
      }
    })
    
    // Remove duplicates
    return params.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
  } catch (error) {
    console.error("Error generating static params:", error)
    // Fallback to empty array - will be handled at runtime
    return []
  }
}

// Helper to find post by ID or slug
async function findPostByIdOrSlug(idOrSlug: string): Promise<BlogPostData | null> {
  // First try to find by document ID
  const docRef = doc(db, "blogPosts", idOrSlug)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as BlogPostData
  }
  
  // If not found, try to find by slug
  try {
    const q = query(collection(db, "blogPosts"), where("slug", "==", idOrSlug))
    const snapshot = await getDocs(q)
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      return { id: doc.id, ...doc.data() } as BlogPostData
    }
  } catch (error) {
    console.error("Error searching by slug:", error)
  }
  
  return null
}

// Generate dynamic metadata from SEO fields
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  
  try {
    const post: BlogPostData | null = await findPostByIdOrSlug(id)
    
    if (post) {
      const metaTitle = post.metaTitle || post.title
      const metaDescription = post.metaDescription || post.excerpt
      
      return {
        title: `${metaTitle} | PKonstruct Blog`,
        description: metaDescription,
        keywords: post.tags || [post.category],
        openGraph: {
          title: metaTitle,
          description: metaDescription,
          images: post.image ? [post.image] : [],
        },
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }
  
  return {
    title: "Blog Post | PKonstruct",
    description: "Read our latest construction insights and news.",
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BlogPostClient idOrSlug={id} />
}
