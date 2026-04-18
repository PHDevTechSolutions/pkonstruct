"use client"

import { useState, useEffect } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface PageSection {
  id: string
  type: string
  title: string
  content: string
  image?: string
  order: number
  isActive: boolean
}

export interface HomeData {
  id: string
  title: string
  slug: string
  metaTitle?: string
  metaDescription?: string
  sections: PageSection[]
  isPublished: boolean
}

export function useHome() {
  const [home, setHome] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHome = async () => {
      try {
        setLoading(true)
        // First try to find page with slug "home"
        const q = query(collection(db, "pages"), where("slug", "==", "home"))
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          setHome({ id: doc.id, ...doc.data() } as HomeData)
        } else {
          // If no "home" page, get the first published page
          const allPagesQuery = query(
            collection(db, "pages"), 
            where("isPublished", "==", true)
          )
          const allSnapshot = await getDocs(allPagesQuery)
          
          if (!allSnapshot.empty) {
            const doc = allSnapshot.docs[0]
            setHome({ id: doc.id, ...doc.data() } as HomeData)
          } else {
            setError("No published pages found")
          }
        }
      } catch (err) {
        setError("Failed to fetch home page")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHome()
  }, [])

  return { home, loading, error }
}
