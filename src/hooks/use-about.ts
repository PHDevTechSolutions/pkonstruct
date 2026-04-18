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

export interface AboutData {
  id: string
  title: string
  slug: string
  metaTitle?: string
  metaDescription?: string
  sections: PageSection[]
  isPublished: boolean
}

export function useAbout() {
  const [about, setAbout] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true)
        // Fetch from pages collection where slug is "about"
        const q = query(collection(db, "pages"), where("slug", "==", "about"))
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          setAbout({ id: doc.id, ...doc.data() } as AboutData)
        } else {
          setError("About page not found")
        }
      } catch (err) {
        setError("Failed to fetch about page")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAbout()
  }, [])

  return { about, loading, error }
}
