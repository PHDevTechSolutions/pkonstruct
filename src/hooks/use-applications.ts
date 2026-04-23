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
  arrayUnion,
  getDocs
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Application, ApplicationStatus, ApplicationNote } from "@/types/careers"

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const q = query(
      collection(db, "applications"),
      orderBy("appliedAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const appsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Application[]
        setApplications(appsData)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching applications:", err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const createApplication = useCallback(async (
    applicationData: Omit<Application, 'id' | 'appliedAt' | 'updatedAt' | 'status' | 'statusHistory' | 'notes' | 'labels'>
  ) => {
    try {
      const newApplication = {
        ...applicationData,
        status: 'new',
        statusHistory: [{
          status: 'new',
          changedAt: serverTimestamp(),
          changedBy: 'system',
          note: 'Application submitted'
        }],
        notes: [],
        labels: [],
        appliedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
      
      const docRef = await addDoc(collection(db, "applications"), newApplication)
      return docRef.id
    } catch (err) {
      console.error("Error creating application:", err)
      throw err
    }
  }, [])

  const updateApplicationStatus = useCallback(async (
    applicationId: string, 
    newStatus: ApplicationStatus,
    note?: string,
    changedBy: string = 'admin'
  ) => {
    try {
      const appRef = doc(db, "applications", applicationId)
      const statusEntry = {
        status: newStatus,
        changedAt: serverTimestamp(),
        changedBy,
        note
      }
      
      await updateDoc(appRef, {
        status: newStatus,
        statusHistory: arrayUnion(statusEntry),
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error("Error updating application status:", err)
      throw err
    }
  }, [])

  const addApplicationNote = useCallback(async (
    applicationId: string,
    noteText: string,
    createdBy: string
  ) => {
    try {
      const appRef = doc(db, "applications", applicationId)
      const newNote = {
        id: crypto.randomUUID(),
        text: noteText,
        createdAt: serverTimestamp(),
        createdBy
      }
      
      await updateDoc(appRef, {
        notes: arrayUnion(newNote),
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error("Error adding note:", err)
      throw err
    }
  }, [])

  const updateApplicationRating = useCallback(async (
    applicationId: string,
    rating: number
  ) => {
    try {
      const appRef = doc(db, "applications", applicationId)
      await updateDoc(appRef, {
        rating,
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error("Error updating rating:", err)
      throw err
    }
  }, [])

  const addLabel = useCallback(async (applicationId: string, label: string) => {
    try {
      const appRef = doc(db, "applications", applicationId)
      await updateDoc(appRef, {
        labels: arrayUnion(label),
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error("Error adding label:", err)
      throw err
    }
  }, [])

  const deleteApplication = useCallback(async (applicationId: string) => {
    try {
      await deleteDoc(doc(db, "applications", applicationId))
    } catch (err) {
      console.error("Error deleting application:", err)
      throw err
    }
  }, [])

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplicationStatus,
    addApplicationNote,
    updateApplicationRating,
    addLabel,
    deleteApplication,
  }
}

export function useJobApplications(jobId: string | null) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!jobId) {
      setApplications([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "applications"),
      where("jobId", "==", jobId),
      orderBy("appliedAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const appsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Application[]
        setApplications(appsData)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching job applications:", err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [jobId])

  return { applications, loading, error }
}

export function useApplication(applicationId: string | null) {
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!applicationId) {
      setApplication(null)
      setLoading(false)
      return
    }

    const unsubscribe = onSnapshot(
      doc(db, "applications", applicationId),
      (doc) => {
        if (doc.exists()) {
          setApplication({ id: doc.id, ...doc.data() } as Application)
        } else {
          setApplication(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching application:", err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [applicationId])

  return { application, loading, error }
}

export function useApplicationsByStatus(status: ApplicationStatus) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const q = query(
      collection(db, "applications"),
      where("status", "==", status),
      orderBy("appliedAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const appsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Application[]
        setApplications(appsData)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching applications by status:", err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [status])

  return { applications, loading, error }
}
