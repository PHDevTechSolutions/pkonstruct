"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface Client {
  id: string
  name: string
  icon: string
  logo?: string
  website?: string
  order: number
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const q = query(
          collection(db, "clients"),
          orderBy("order", "asc")
        )

        const snapshot = await getDocs(q)
        const clientsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Client[]

        setClients(clientsData)
      } catch (err) {
        setError("Failed to fetch clients")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  return { clients, loading, error }
}
