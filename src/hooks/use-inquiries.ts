"use client"

import { useState, useEffect, useCallback } from "react"
import { db } from "@/lib/firebase"
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  where,
  Timestamp,
  serverTimestamp
} from "firebase/firestore"

export interface Inquiry {
  id: string
  name: string
  email: string
  subject: string
  message: string
  phone?: string
  address?: string
  hasAttachments?: boolean
  fileCount?: number
  status: 'new' | 'read' | 'replied' | 'archived'
  notes?: string
  replyMessage?: string
  repliedAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface InquiryStats {
  total: number
  new: number
  read: number
  replied: number
  archived: number
}

export function useInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [stats, setStats] = useState<InquiryStats>({ total: 0, new: 0, read: 0, replied: 0, archived: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInquiries = useCallback(async (filters?: { status?: string; search?: string }) => {
    try {
      setLoading(true)
      setError(null)

      let q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"))

      if (filters?.status && filters.status !== 'all') {
        q = query(
          collection(db, "inquiries"),
          where("status", "==", filters.status),
          orderBy("createdAt", "desc")
        )
      }

      const snapshot = await getDocs(q)
      let data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Inquiry[]

      // Client-side search
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase()
        data = data.filter(
          inquiry =>
            inquiry.name.toLowerCase().includes(searchLower) ||
            inquiry.email.toLowerCase().includes(searchLower) ||
            inquiry.subject.toLowerCase().includes(searchLower) ||
            inquiry.message.toLowerCase().includes(searchLower)
        )
      }

      setInquiries(data)

      // Calculate stats
      const allSnapshot = await getDocs(collection(db, "inquiries"))
      const allData = allSnapshot.docs.map(doc => doc.data()) as Inquiry[]
      setStats({
        total: allData.length,
        new: allData.filter(i => i.status === 'new').length,
        read: allData.filter(i => i.status === 'read').length,
        replied: allData.filter(i => i.status === 'replied').length,
        archived: allData.filter(i => i.status === 'archived').length,
      })
    } catch (err) {
      setError("Failed to fetch inquiries")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createInquiry = async (data: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
      // Filter out undefined values
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined && v !== '')
      )
      
      const docRef = await addDoc(collection(db, "inquiries"), {
        ...cleanData,
        status: 'new',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (err) {
      console.error("Error creating inquiry:", err)
      throw err
    }
  }

  const updateInquiry = async (id: string, data: Partial<Inquiry>) => {
    try {
      const docRef = doc(db, "inquiries", id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error("Error updating inquiry:", err)
      throw err
    }
  }

  const deleteInquiry = async (id: string) => {
    try {
      await deleteDoc(doc(db, "inquiries", id))
    } catch (err) {
      console.error("Error deleting inquiry:", err)
      throw err
    }
  }

  const deleteMultipleInquiries = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => deleteDoc(doc(db, "inquiries", id))))
    } catch (err) {
      console.error("Error deleting inquiries:", err)
      throw err
    }
  }

  const markAsReplied = async (id: string, replyMessage: string) => {
    try {
      const docRef = doc(db, "inquiries", id)
      await updateDoc(docRef, {
        status: 'replied',
        replyMessage,
        repliedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error("Error marking as replied:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

  return {
    inquiries,
    stats,
    loading,
    error,
    fetchInquiries,
    createInquiry,
    updateInquiry,
    deleteInquiry,
    deleteMultipleInquiries,
    markAsReplied,
  }
}
