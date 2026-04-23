"use client"

import { useState, useEffect, useCallback } from "react"
import { db } from "@/lib/firebase"
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  where,
  getDocs,
  increment,
} from "firebase/firestore"
import type { Review } from "@/types/shop"

const COLLECTION = "reviews"

export function useReviews(productId?: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    average: 0,
    count: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  })

  useEffect(() => {
    if (!productId) {
      setReviews([])
      setLoading(false)
      return
    }

    setLoading(true)
    const q = query(
      collection(db, COLLECTION),
      where("productId", "==", productId),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Review[]
        
        setReviews(data)
        
        // Calculate stats
        if (data.length > 0) {
          const total = data.reduce((sum, r) => sum + r.rating, 0)
          const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          data.forEach(r => {
            if (r.rating >= 1 && r.rating <= 5) {
              distribution[r.rating as keyof typeof distribution]++
            }
          })
          setStats({
            average: Math.round((total / data.length) * 10) / 10,
            count: data.length,
            distribution
          })
        } else {
          setStats({ average: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } })
        }
        
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching reviews:", err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [productId])

  const addReview = useCallback(async (review: Omit<Review, "id" | "createdAt" | "updatedAt" | "helpful">) => {
    try {
      const result = await addDoc(collection(db, COLLECTION), {
        ...review,
        helpful: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return { success: true, id: result.id }
    } catch (err: any) {
      console.error("Error adding review:", err)
      return { error: err.message, success: false }
    }
  }, [])

  const markHelpful = useCallback(async (reviewId: string) => {
    try {
      const ref = doc(db, COLLECTION, reviewId)
      await updateDoc(ref, {
        helpful: increment(1),
      })
      return { success: true }
    } catch (err: any) {
      console.error("Error marking helpful:", err)
      return { error: err.message, success: false }
    }
  }, [])

  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      await deleteDoc(doc(db, COLLECTION, reviewId))
      return { success: true }
    } catch (err: any) {
      console.error("Error deleting review:", err)
      return { error: err.message, success: false }
    }
  }, [])

  return { 
    reviews, 
    loading, 
    error, 
    stats,
    addReview, 
    markHelpful,
    deleteReview 
  }
}

// Hook to check if user can review (verified purchase)
export function useCanReview(productId: string, userId?: string) {
  const [canReview, setCanReview] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !productId) {
      setCanReview(false)
      setLoading(false)
      return
    }

    const checkPurchase = async () => {
      try {
        // Check if user has a delivered order with this product
        const ordersQuery = query(
          collection(db, "orders"),
          where("customer.email", "==", userId),
          where("status", "==", "delivered")
        )
        const snapshot = await getDocs(ordersQuery)
        
        const hasPurchased = snapshot.docs.some(doc => {
          const items = doc.data().items || []
          return items.some((item: any) => item.productId === productId)
        })
        
        // Also check if user already reviewed
        const reviewsQuery = query(
          collection(db, COLLECTION),
          where("productId", "==", productId),
          where("userId", "==", userId)
        )
        const reviewsSnap = await getDocs(reviewsQuery)
        const hasReviewed = !reviewsSnap.empty
        
        setCanReview(hasPurchased && !hasReviewed)
      } catch (err) {
        console.error("Error checking review eligibility:", err)
        setCanReview(false)
      } finally {
        setLoading(false)
      }
    }

    checkPurchase()
  }, [productId, userId])

  return { canReview, loading }
}
