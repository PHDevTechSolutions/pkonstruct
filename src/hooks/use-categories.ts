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
} from "firebase/firestore"
import type { Category } from "@/types/shop"

const COLLECTION = "categories"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const q = query(
      collection(db, COLLECTION),
      orderBy("sortOrder", "asc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Category[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[]
        setCategories(items)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching categories:", err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const createCategory = useCallback(async (data: Omit<Category, "id">) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return { id: docRef.id, success: true }
    } catch (err: any) {
      console.error("Error creating category:", err)
      return { error: err.message, success: false }
    }
  }, [])

  const updateCategory = useCallback(async (id: string, data: Partial<Category>) => {
    try {
      const ref = doc(db, COLLECTION, id)
      await updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp(),
      })
      return { success: true }
    } catch (err: any) {
      console.error("Error updating category:", err)
      return { error: err.message, success: false }
    }
  }, [])

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTION, id))
      return { success: true }
    } catch (err: any) {
      console.error("Error deleting category:", err)
      return { error: err.message, success: false }
    }
  }, [])

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
