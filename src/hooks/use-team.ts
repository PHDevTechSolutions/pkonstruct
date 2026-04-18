"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface TeamMember {
  id: string
  name: string
  role: string
  experience: string
  bio: string
  phone: string
  email: string
  image?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
  }
  order: number
}

export function useTeam() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true)
        const q = query(
          collection(db, "team"),
          orderBy("order", "asc")
        )

        const snapshot = await getDocs(q)
        const membersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as TeamMember[]

        setMembers(membersData)
      } catch (err) {
        setError("Failed to fetch team members")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [])

  return { members, loading, error }
}

export function useTeamMember(id: string) {
  const [member, setMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return

      try {
        setLoading(true)
        const docRef = doc(db, "team", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setMember({ id: docSnap.id, ...docSnap.data() } as TeamMember)
        } else {
          setError("Team member not found")
        }
      } catch (err) {
        setError("Failed to fetch team member")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMember()
  }, [id])

  return { member, loading, error }
}
