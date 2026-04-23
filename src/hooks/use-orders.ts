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
  writeBatch,
  increment,
  arrayUnion,
} from "firebase/firestore"
import type { Order, OrderItem } from "@/types/shop"

const COLLECTION = "orders"
const PRODUCTS_COLLECTION = "products"

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Subscribe to orders
  useEffect(() => {
    setLoading(true)
    const q = query(
      collection(db, COLLECTION),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Order[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Order[]
        setOrders(items)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching orders:", err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Create order with stock reduction
  const createOrder = useCallback(async (data: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    try {
      // Generate order number
      const date = new Date()
      const orderNumber = `ORD-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
      
      // Create order
      const orderRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        orderNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // Reduce stock for each item
      const batch = writeBatch(db)
      for (const item of data.items) {
        const productRef = doc(db, PRODUCTS_COLLECTION, item.productId)
        batch.update(productRef, {
          quantity: increment(-item.quantity),
          updatedAt: serverTimestamp(),
        })
      }
      await batch.commit()

      return { id: orderRef.id, orderNumber, success: true }
    } catch (err: any) {
      console.error("Error creating order:", err)
      return { error: err.message, success: false }
    }
  }, [])

  // Update order status with history tracking
  const updateOrderStatus = useCallback(async (id: string, status: Order['status'], note?: string) => {
    try {
      const ref = doc(db, COLLECTION, id)
      await updateDoc(ref, {
        status,
        updatedAt: serverTimestamp(),
        statusHistory: arrayUnion({
          status,
          timestamp: serverTimestamp(),
          note: note || undefined,
        })
      })
      return { success: true }
    } catch (err: any) {
      console.error("Error updating order status:", err)
      return { error: err.message, success: false }
    }
  }, [])

  // Update payment status
  const updatePaymentStatus = useCallback(async (id: string, paymentStatus: Order['paymentStatus']) => {
    try {
      const ref = doc(db, COLLECTION, id)
      await updateDoc(ref, {
        paymentStatus,
        updatedAt: serverTimestamp(),
      })
      return { success: true }
    } catch (err: any) {
      console.error("Error updating payment status:", err)
      return { error: err.message, success: false }
    }
  }, [])

  // Add note to order
  const addOrderNote = useCallback(async (id: string, note: string) => {
    try {
      const ref = doc(db, COLLECTION, id)
      await updateDoc(ref, {
        notes: note,
        updatedAt: serverTimestamp(),
      })
      return { success: true }
    } catch (err: any) {
      console.error("Error adding note:", err)
      return { error: err.message, success: false }
    }
  }, [])

  // Delete order (restore stock)
  const deleteOrder = useCallback(async (id: string, items?: OrderItem[]) => {
    try {
      // Restore stock if items provided
      if (items && items.length > 0) {
        const batch = writeBatch(db)
        for (const item of items) {
          const productRef = doc(db, PRODUCTS_COLLECTION, item.productId)
          batch.update(productRef, {
            quantity: increment(item.quantity),
            updatedAt: serverTimestamp(),
          })
        }
        await batch.commit()
      }

      await deleteDoc(doc(db, COLLECTION, id))
      return { success: true }
    } catch (err: any) {
      console.error("Error deleting order:", err)
      return { error: err.message, success: false }
    }
  }, [])

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    addOrderNote,
    deleteOrder,
  }
}

// Hook for single order
export function useOrder(id: string | null) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setOrder(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = onSnapshot(
      doc(db, COLLECTION, id),
      (docSnap) => {
        if (docSnap.exists()) {
          setOrder({
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate() || new Date(),
            updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
          } as Order)
        } else {
          setOrder(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching order:", err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [id])

  return { order, loading, error }
}
