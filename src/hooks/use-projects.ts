"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, doc, getDoc, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface Project {
  id: string
  title: string
  category: string
  location: string
  year: string
  duration: string
  size: string
  team: string
  client: string
  description: string
  challenge: string
  solution: string
  results: string[]
  features: string[]
  image?: string
  gallery?: string[]
  published: boolean
}

export function useProjects(category?: string) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        let q = query(
          collection(db, "projects"),
          where("published", "==", true),
          orderBy("year", "desc")
        )
        
        if (category && category !== "All") {
          q = query(q, where("category", "==", category))
        }

        const snapshot = await getDocs(q)
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Project[]
        
        setProjects(projectsData)
      } catch (err) {
        setError("Failed to fetch projects")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [category])

  return { projects, loading, error }
}

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const docRef = doc(db, "projects", id)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project)
        } else {
          setError("Project not found")
        }
      } catch (err) {
        setError("Failed to fetch project")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  return { project, loading, error }
}
