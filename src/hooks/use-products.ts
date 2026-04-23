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
  getDocs,
  where,
  limit,
  startAfter,
  QueryDocumentSnapshot
} from "firebase/firestore"
import type { Product } from "@/types/shop"

const COLLECTION = "products"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Subscribe to products
  useEffect(() => {
    setLoading(true)
    const q = query(
      collection(db, COLLECTION),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Product[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Product[]
        setProducts(items)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching products:", err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Create product
  const createProduct = useCallback(async (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return { id: docRef.id, success: true }
    } catch (err: any) {
      console.error("Error creating product:", err)
      return { error: err.message, success: false }
    }
  }, [])

  // Update product
  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    try {
      const ref = doc(db, COLLECTION, id)
      await updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp(),
      })
      return { success: true }
    } catch (err: any) {
      console.error("Error updating product:", err)
      return { error: err.message, success: false }
    }
  }, [])

  // Delete product
  const deleteProduct = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTION, id))
      return { success: true }
    } catch (err: any) {
      console.error("Error deleting product:", err)
      return { error: err.message, success: false }
    }
  }, [])

  // Bulk delete
  const bulkDelete = useCallback(async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => deleteDoc(doc(db, COLLECTION, id))))
      return { success: true }
    } catch (err: any) {
      console.error("Error bulk deleting:", err)
      return { error: err.message, success: false }
    }
  }, [])

  // Update stock
  const updateStock = useCallback(async (id: string, quantity: number) => {
    try {
      const ref = doc(db, COLLECTION, id)
      await updateDoc(ref, {
        quantity,
        updatedAt: serverTimestamp(),
      })
      return { success: true }
    } catch (err: any) {
      console.error("Error updating stock:", err)
      return { error: err.message, success: false }
    }
  }, [])

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDelete,
    updateStock,
  }
}

// Hook for single product
export function useProduct(id: string | null) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setProduct(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = onSnapshot(
      doc(db, COLLECTION, id),
      (docSnap) => {
        if (docSnap.exists()) {
          setProduct({
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate() || new Date(),
            updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
          } as Product)
        } else {
          setProduct(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching product:", err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [id])

  return { product, loading, error }
}
