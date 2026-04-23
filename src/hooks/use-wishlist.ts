"use client"

import { useState, useEffect, useCallback } from "react"
import { db } from "@/lib/firebase"
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore"
import type { WishlistItem } from "@/types/shop"

const COLLECTION = "wishlists"

export function useWishlist(userId?: string) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [productIds, setProductIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      // Load from localStorage for anonymous users
      const stored = localStorage.getItem('wishlist_guest')
      if (stored) {
        try {
          const guestItems = JSON.parse(stored)
          setItems(guestItems.map((id: string) => ({ productId: id, userId: 'guest', addedAt: new Date() })))
          setProductIds(new Set(guestItems))
        } catch {
          setItems([])
          setProductIds(new Set())
        }
      }
      setLoading(false)
      return
    }

    setLoading(true)
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", userId),
      orderBy("addedAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          productId: doc.data().productId,
          userId: doc.data().userId,
          addedAt: doc.data().addedAt?.toDate(),
        })) as WishlistItem[]
        
        setItems(data)
        setProductIds(new Set(data.map(item => item.productId)))
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching wishlist:", err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [userId])

  const isInWishlist = useCallback((productId: string) => {
    return productIds.has(productId)
  }, [productIds])

  const addToWishlist = useCallback(async (productId: string) => {
    if (!userId) {
      // Store in localStorage for guests
      const stored = localStorage.getItem('wishlist_guest')
      const guestItems = stored ? JSON.parse(stored) : []
      if (!guestItems.includes(productId)) {
        guestItems.push(productId)
        localStorage.setItem('wishlist_guest', JSON.stringify(guestItems))
        setProductIds(prev => new Set([...prev, productId]))
        setItems(prev => [...prev, { productId, userId: 'guest', addedAt: new Date() }])
      }
      return { success: true }
    }

    try {
      // Check if already exists
      if (productIds.has(productId)) {
        return { success: true }
      }

      await addDoc(collection(db, COLLECTION), {
        productId,
        userId,
        addedAt: serverTimestamp(),
      })
      return { success: true }
    } catch (err: any) {
      console.error("Error adding to wishlist:", err)
      return { error: err.message, success: false }
    }
  }, [userId, productIds])

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!userId) {
      // Remove from localStorage for guests
      const stored = localStorage.getItem('wishlist_guest')
      if (stored) {
        const guestItems = JSON.parse(stored).filter((id: string) => id !== productId)
        localStorage.setItem('wishlist_guest', JSON.stringify(guestItems))
        setProductIds(prev => {
          const next = new Set(prev)
          next.delete(productId)
          return next
        })
        setItems(prev => prev.filter(item => item.productId !== productId))
      }
      return { success: true }
    }

    try {
      // Find and delete the document
      const q = query(
        collection(db, COLLECTION),
        where("userId", "==", userId),
        where("productId", "==", productId)
      )
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        await deleteDoc(doc(db, COLLECTION, snapshot.docs[0].id))
      }
      return { success: true }
    } catch (err: any) {
      console.error("Error removing from wishlist:", err)
      return { error: err.message, success: false }
    }
  }, [userId])

  const toggleWishlist = useCallback(async (productId: string) => {
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId)
    } else {
      return addToWishlist(productId)
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist])

  // Migrate guest wishlist to user on login
  const migrateGuestWishlist = useCallback(async () => {
    if (!userId) return
    
    const stored = localStorage.getItem('wishlist_guest')
    if (!stored) return

    try {
      const guestItems = JSON.parse(stored) as string[]
      for (const productId of guestItems) {
        // Check if not already in user's wishlist
        if (!productIds.has(productId)) {
          await addDoc(collection(db, COLLECTION), {
            productId,
            userId,
            addedAt: serverTimestamp(),
          })
        }
      }
      localStorage.removeItem('wishlist_guest')
    } catch (err) {
      console.error("Error migrating wishlist:", err)
    }
  }, [userId, productIds])

  return { 
    items, 
    loading, 
    error, 
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    migrateGuestWishlist
  }
}
