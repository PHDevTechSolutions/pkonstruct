"use client"

import { useState, useEffect, useCallback } from "react"
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/hooks/use-auth"
import type { CartItem } from "@/types/shop"

const GUEST_CART_KEY = "pkonstruct_cart_guest"

interface UserCart {
  items: CartItem[]
  updatedAt: Date
}

export function useUserCart() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  // Get guest cart from localStorage
  const getGuestCart = useCallback((): CartItem[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(GUEST_CART_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return []
      }
    }
    return []
  }, [])

  // Save guest cart to localStorage
  const saveGuestCart = useCallback((items: CartItem[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
  }, [])

  // Clear guest cart
  const clearGuestCart = useCallback(() => {
    if (typeof window === "undefined") return
    localStorage.removeItem(GUEST_CART_KEY)
  }, [])

  // Fetch user's cart from Firestore
  const fetchUserCart = useCallback(async (uid: string): Promise<CartItem[]> => {
    try {
      const cartDoc = await getDoc(doc(db, "user_carts", uid))
      if (cartDoc.exists()) {
        const data = cartDoc.data()
        return data.items || []
      }
      return []
    } catch (error) {
      console.error("Error fetching user cart:", error)
      return []
    }
  }, [])

  // Save user's cart to Firestore
  const saveUserCart = useCallback(async (uid: string, items: CartItem[]) => {
    try {
      await setDoc(doc(db, "user_carts", uid), {
        items,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error saving user cart:", error)
    }
  }, [])

  // Migrate guest cart to user cart on login
  const migrateGuestCart = useCallback(async (userId: string) => {
    const guestItems = getGuestCart()
    if (guestItems.length === 0) return

    setIsSyncing(true)
    try {
      // Get existing user cart
      const userItems = await fetchUserCart(userId)
      
      // Merge carts - guest items take precedence if same product
      const mergedItems = [...userItems]
      
      guestItems.forEach(guestItem => {
        const existingIndex = mergedItems.findIndex(
          item => item.productId === guestItem.productId && item.variant === guestItem.variant
        )
        
        if (existingIndex >= 0) {
          // Update quantity if item exists
          mergedItems[existingIndex] = {
            ...mergedItems[existingIndex],
            quantity: Math.min(
              mergedItems[existingIndex].quantity + guestItem.quantity,
              guestItem.maxStock
            ),
          }
        } else {
          // Add new item
          mergedItems.push(guestItem)
        }
      })

      // Save merged cart
      await saveUserCart(userId, mergedItems)
      setCartItems(mergedItems)
      
      // Clear guest cart after successful migration
      clearGuestCart()
    } catch (error) {
      console.error("Error migrating guest cart:", error)
    } finally {
      setIsSyncing(false)
    }
  }, [getGuestCart, fetchUserCart, saveUserCart, clearGuestCart])

  // Initialize cart on mount and user change
  useEffect(() => {
    const initCart = async () => {
      setLoading(true)
      
      if (user) {
        // User is logged in - fetch their cart
        const userItems = await fetchUserCart(user.uid)
        
        // Check if there's a guest cart to migrate
        const guestItems = getGuestCart()
        if (guestItems.length > 0) {
          await migrateGuestCart(user.uid)
        } else {
          setCartItems(userItems)
        }
      } else {
        // No user - use guest cart
        const guestItems = getGuestCart()
        setCartItems(guestItems)
      }
      
      setLoading(false)
    }

    initCart()
  }, [user, fetchUserCart, getGuestCart, migrateGuestCart])

  // Subscribe to real-time cart updates when logged in
  useEffect(() => {
    if (!user) return

    const unsubscribe = onSnapshot(
      doc(db, "user_carts", user.uid),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data()
          setCartItems(data.items || [])
        } else {
          setCartItems([])
        }
      },
      (error) => {
        console.error("Error subscribing to cart updates:", error)
      }
    )

    return () => unsubscribe()
  }, [user])

  // Save cart whenever it changes
  useEffect(() => {
    if (loading) return

    if (user) {
      // Save to Firestore for logged-in users
      saveUserCart(user.uid, cartItems)
    } else {
      // Save to localStorage for guests
      saveGuestCart(cartItems)
    }
  }, [cartItems, user, loading, saveUserCart, saveGuestCart])

  // Add item to cart
  const addItem = useCallback((newItem: CartItem) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === newItem.productId && item.variant === newItem.variant
      )

      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev]
        const existing = updated[existingIndex]
        const newQty = Math.min(
          existing.quantity + newItem.quantity,
          existing.maxStock
        )
        updated[existingIndex] = { ...existing, quantity: newQty }
        return updated
      } else {
        // Add new item
        return [...prev, newItem]
      }
    })
  }, [])

  // Remove item from cart
  const removeItem = useCallback((productId: string, variant?: string) => {
    setCartItems(prev => prev.filter(
      item => !(item.productId === productId && item.variant === variant)
    ))
  }, [])

  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeItem(productId, variant)
      return
    }

    setCartItems(prev => prev.map(item => {
      if (item.productId === productId && item.variant === variant) {
        return { ...item, quantity: Math.min(quantity, item.maxStock) }
      }
      return item
    }))
  }, [removeItem])

  // Clear cart
  const clearCart = useCallback(async () => {
    setCartItems([])
    
    if (user) {
      try {
        await deleteDoc(doc(db, "user_carts", user.uid))
      } catch (error) {
        console.error("Error clearing user cart:", error)
      }
    } else {
      clearGuestCart()
    }
  }, [user, clearGuestCart])

  // Cart totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return {
    items: cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    loading,
    isSyncing,
    isAuthenticated: !!user,
  }
}
