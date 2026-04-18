"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface Service {
  id: string
  icon: string
  title: string
  slug?: string
  description: string
  fullDescription?: string
  features?: string[]
  image?: string
  order: number
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const q = query(
          collection(db, "services"),
          orderBy("order", "asc")
        )

        const snapshot = await getDocs(q)
        const servicesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Service[]

        setServices(servicesData)
      } catch (err) {
        setError("Failed to fetch services")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return { services, loading, error }
}

export function useService(id: string) {
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return

      try {
        setLoading(true)
        const docRef = doc(db, "services", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setService({ id: docSnap.id, ...docSnap.data() } as Service)
        } else {
          setError("Service not found")
        }
      } catch (err) {
        setError("Failed to fetch service")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [id])

  return { service, loading, error }
}
