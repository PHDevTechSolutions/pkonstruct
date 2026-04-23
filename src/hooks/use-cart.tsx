"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, onSnapshot } from "firebase/firestore"
import { cartRateLimiter } from "@/lib/rate-limiter"
import { useAnalytics } from "@/hooks/use-analytics"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import type { CartItem, ShippingSettings } from "@/types/shop"

const DEFAULT_SHIPPING: ShippingSettings = {
  freeShippingThreshold: 50,
  defaultShippingFee: 10,
  expressShippingFee: 20,
}

const GUEST_CART_KEY = "pkonstruct_cart_guest"

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variant?: string) => void
  updateQuantity: (productId: string, quantity: number, variant?: string) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  shippingFee: number
  total: number
  calculateShipping: (city?: string, totalWeight?: number) => number
  isLoading: boolean
  isAuthenticated: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { trackCartEvent } = useAnalytics()
  const { user } = useAuth()
  const cartCreatedRef = useRef(false)

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
  const saveGuestCart = useCallback((cartItems: CartItem[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems))
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
  const saveUserCart = useCallback(async (uid: string, cartItems: CartItem[]) => {
    try {
      await setDoc(doc(db, "user_carts", uid), {
        items: cartItems,
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
      setItems(mergedItems)
      
      // Clear guest cart after successful migration
      clearGuestCart()
    } catch (error) {
      console.error("Error migrating guest cart:", error)
    }
  }, [getGuestCart, fetchUserCart, saveUserCart, clearGuestCart])

  // Initialize cart on mount and user change
  useEffect(() => {
    const initCart = async () => {
      if (user) {
        // User is logged in - fetch their cart
        const userItems = await fetchUserCart(user.uid)
        
        // Check if there's a guest cart to migrate
        const guestItems = getGuestCart()
        if (guestItems.length > 0) {
          await migrateGuestCart(user.uid)
        } else {
          setItems(userItems)
        }
      } else {
        // No user - use guest cart
        const guestItems = getGuestCart()
        setItems(guestItems)
      }
      setIsLoaded(true)
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
          setItems(data.items || [])
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
    if (!isLoaded) return

    if (user) {
      // Save to Firestore for logged-in users
      saveUserCart(user.uid, items)
    } else {
      // Save to localStorage for guests
      saveGuestCart(items)
    }
  }, [items, user, isLoaded, saveUserCart, saveGuestCart])

  const addItem = useCallback((newItem: CartItem) => {
    // Rate limit cart additions
    const rateCheck = cartRateLimiter.check('cart:add', 20, 60000)
    if (!rateCheck.allowed) {
      console.warn('Cart addition rate limited')
      return
    }
    
    // Track cart creation on first add
    if (!cartCreatedRef.current && items.length === 0) {
      cartCreatedRef.current = true
    }
    
    // Track add to cart event
    trackCartEvent('add', [{
      productId: newItem.productId,
      name: newItem.name,
      price: newItem.price,
      quantity: newItem.quantity,
      variant: newItem.variant,
    }])
    
    setItems(prev => {
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

  const removeItem = useCallback((productId: string, variant?: string) => {
    // Rate limit cart removals
    const rateCheck = cartRateLimiter.check('cart:remove', 20, 60000)
    if (!rateCheck.allowed) {
      console.warn('Cart removal rate limited')
      return
    }
    
    // Track remove event
    const removedItem = items.find(item => item.productId === productId && item.variant === variant)
    if (removedItem) {
      trackCartEvent('remove', [{
        productId: removedItem.productId,
        name: removedItem.name,
        price: removedItem.price,
        quantity: removedItem.quantity,
        variant: removedItem.variant,
      }])
    }
    
    setItems(prev => prev.filter(
      item => !(item.productId === productId && item.variant === variant)
    ))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number, variant?: string) => {
    // Rate limit quantity updates
    const rateCheck = cartRateLimiter.check('cart:update', 20, 60000)
    if (!rateCheck.allowed) {
      console.warn('Cart update rate limited')
      return
    }
    
    // Track update event
    const updatedItem = items.find(item => item.productId === productId && item.variant === variant)
    if (updatedItem) {
      trackCartEvent('update_quantity', [{
        productId: updatedItem.productId,
        name: updatedItem.name,
        price: updatedItem.price,
        quantity: quantity,
        variant: updatedItem.variant,
      }])
    }
    
    if (quantity <= 0) {
      removeItem(productId, variant)
      return
    }

    setItems(prev => prev.map(item => {
      if (item.productId === productId && item.variant === variant) {
        return { ...item, quantity: Math.min(quantity, item.maxStock) }
      }
      return item
    }))
  }, [])

  const clearCart = useCallback(() => {
    // Track abandonment if cart had items
    if (items.length > 0) {
      const cartSnapshot = items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variant: item.variant,
      }))
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      trackCartEvent('abandon', cartSnapshot, total)
    }
    setItems([])
    cartCreatedRef.current = false
  }, [items, trackCartEvent])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Calculate shipping based on subtotal and settings
  const calculateShipping = (city?: string, totalWeight?: number): number => {
    const settings = DEFAULT_SHIPPING
    
    // Free shipping threshold
    if (subtotal >= settings.freeShippingThreshold) {
      return 0
    }
    
    // Weight-based calculation
    if (settings.calculateByWeight && totalWeight && settings.weightRates) {
      for (const rate of settings.weightRates) {
        if (totalWeight <= rate.maxWeight) {
          return rate.rate
        }
      }
      // If over all weight tiers, use highest rate
      const highestRate = settings.weightRates[settings.weightRates.length - 1]
      return highestRate?.rate || settings.defaultShippingFee
    }
    
    // Zone-based calculation
    if (city && settings.zones) {
      const zone = settings.zones.find(z => 
        z.regions.some(r => r.toLowerCase() === city.toLowerCase())
      )
      if (zone) return zone.rate
    }
    
    return settings.defaultShippingFee
  }
  
  const shippingFee = calculateShipping()
  const total = subtotal + shippingFee

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      shippingFee,
      total,
      calculateShipping,
      isLoading: !isLoaded,
      isAuthenticated: !!user,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
