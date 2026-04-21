"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface Testimonial {
  id: string
  name: string
  role: string
  location: string
  rating: number
  text: string
  project: string
  published: boolean
  avatar?: string
  company?: string
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true)
        const q = query(
          collection(db, "testimonials"),
          where("published", "==", true),
          orderBy("rating", "desc")
        )

        const snapshot = await getDocs(q)
        const testimonialsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Testimonial[]
        
        setTestimonials(testimonialsData)
      } catch (err) {
        setError("Failed to fetch testimonials")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  return { testimonials, loading, error }
}
