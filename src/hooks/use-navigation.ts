"use client"

import { useState, useEffect } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface NavItem {
  id: string
  title: string
  slug: string
  order: number
}

export function useNavigation() {
  const [headerNav, setHeaderNav] = useState<NavItem[]>([])
  const [footerNav, setFooterNav] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        // Fetch all published pages - simpler query without orderBy to avoid index requirement
        const pagesQuery = query(
          collection(db, "pages"),
          where("isPublished", "==", true)
        )
        const snapshot = await getDocs(pagesQuery)
        
        const allPages = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          slug: doc.data().slug,
          order: doc.data().order || 0,
          showInHeader: doc.data().showInHeader || false,
          showInFooter: doc.data().showInFooter || false,
        }))
        
        // Filter and sort for header
        const headerItems = allPages
          .filter(p => p.showInHeader)
          .sort((a, b) => a.order - b.order)
        setHeaderNav(headerItems)

        // Filter and sort for footer
        const footerItems = allPages
          .filter(p => p.showInFooter)
          .sort((a, b) => a.order - b.order)
        setFooterNav(footerItems)
      } catch (err) {
        console.error("Error fetching navigation:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNavigation()
  }, [])

  return { headerNav, footerNav, loading }
}
