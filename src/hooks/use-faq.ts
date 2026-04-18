"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

export function useFAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true)
        const q = query(
          collection(db, "faq"),
          orderBy("order", "asc")
        )

        const snapshot = await getDocs(q)
        const faqsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as FAQ[]

        setFaqs(faqsData)
      } catch (err) {
        setError("Failed to fetch FAQs")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  return { faqs, loading, error }
}
