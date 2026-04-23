"use client"

import { useState, useEffect, useCallback } from "react"
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
  Timestamp,
  where,
  getDocs,
  increment
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Job } from "@/types/careers"

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const q = query(
      collection(db, "jobs"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const jobsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[]
        setJobs(jobsData)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching jobs:", err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const createJob = useCallback(async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicationCount'>) => {
    try {
      const newJob: any = {
        ...jobData,
        applicationCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
      
      // If job is published, set postedAt
      if (jobData.status === 'published') {
        newJob.postedAt = serverTimestamp()
      }
      
      const docRef = await addDoc(collection(db, "jobs"), newJob)
      return docRef.id
    } catch (err) {
      console.error("Error creating job:", err)
      throw err
    }
  }, [])

  const updateJob = useCallback(async (jobId: string, jobData: Partial<Job>) => {
    try {
      const jobRef = doc(db, "jobs", jobId)
      const updateData: any = {
        ...jobData,
        updatedAt: serverTimestamp(),
      }
      
      // If job is being published, set postedAt
      if (jobData.status === 'published') {
        updateData.postedAt = serverTimestamp()
      }
      
      await updateDoc(jobRef, updateData)
    } catch (err) {
      console.error("Error updating job:", err)
      throw err
    }
  }, [])

  const deleteJob = useCallback(async (jobId: string) => {
    try {
      await deleteDoc(doc(db, "jobs", jobId))
    } catch (err) {
      console.error("Error deleting job:", err)
      throw err
    }
  }, [])

  const publishJob = useCallback(async (jobId: string) => {
    try {
      const jobRef = doc(db, "jobs", jobId)
      await updateDoc(jobRef, {
        status: 'published',
        postedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error("Error publishing job:", err)
      throw err
    }
  }, [])

  const closeJob = useCallback(async (jobId: string) => {
    try {
      const jobRef = doc(db, "jobs", jobId)
      await updateDoc(jobRef, {
        status: 'closed',
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error("Error closing job:", err)
      throw err
    }
  }, [])

  const incrementApplicationCount = useCallback(async (jobId: string) => {
    try {
      const jobRef = doc(db, "jobs", jobId)
      await updateDoc(jobRef, {
        applicationCount: increment(1),
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error("Error incrementing application count:", err)
      throw err
    }
  }, [])

  return {
    jobs,
    loading,
    error,
    createJob,
    updateJob,
    deleteJob,
    publishJob,
    closeJob,
    incrementApplicationCount,
  }
}

export function usePublishedJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Query all jobs with status published (without orderBy to avoid index issues)
    const q = query(
      collection(db, "jobs"),
      where("status", "==", "published")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const jobsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[]
        
        // Sort by postedAt (or createdAt as fallback) client-side
        jobsData.sort((a, b) => {
          const dateA = a.postedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0
          const dateB = b.postedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0
          return dateB - dateA // Descending
        })
        
        setJobs(jobsData)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching published jobs:", err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { jobs, loading, error }
}

export function useJob(jobId: string | null) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!jobId) {
      setJob(null)
      setLoading(false)
      return
    }

    const unsubscribe = onSnapshot(
      doc(db, "jobs", jobId),
      (doc) => {
        if (doc.exists()) {
          setJob({ id: doc.id, ...doc.data() } as Job)
        } else {
          setJob(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching job:", err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [jobId])

  return { job, loading, error }
}
