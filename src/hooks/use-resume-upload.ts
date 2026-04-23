"use client"

import { useState, useCallback } from "react"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "@/lib/firebase"

interface UploadProgress {
  progress: number
  status: 'idle' | 'uploading' | 'success' | 'error'
  error?: string
  url?: string
}

export function useResumeUpload() {
  const [uploadState, setUploadState] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  })

  const uploadResume = useCallback(async (
    file: File,
    jobId: string,
    applicationId?: string
  ): Promise<string> => {
    // Validate file
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only PDF and Word documents are allowed')
    }

    // 5MB max
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB')
    }

    const uniqueId = applicationId || Date.now().toString()
    const extension = file.name.split('.').pop()
    const filename = `${uniqueId}_${Date.now()}.${extension}`
    const storageRef = ref(storage, `resumes/${jobId}/${filename}`)

    return new Promise((resolve, reject) => {
      setUploadState({ progress: 0, status: 'uploading' })

      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          )
          setUploadState({ progress, status: 'uploading' })
        },
        (error) => {
          console.error('Upload error:', error)
          setUploadState({ progress: 0, status: 'error', error: error.message })
          reject(error)
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
            setUploadState({ progress: 100, status: 'success', url: downloadUrl })
            resolve(downloadUrl)
          } catch (error) {
            console.error('Error getting download URL:', error)
            setUploadState({ progress: 0, status: 'error', error: 'Failed to get download URL' })
            reject(error)
          }
        }
      )
    })
  }, [])

  const deleteResume = useCallback(async (url: string) => {
    try {
      const storageRef = ref(storage, url)
      await deleteObject(storageRef)
    } catch (err) {
      console.error('Error deleting resume:', err)
    }
  }, [])

  const resetUpload = useCallback(() => {
    setUploadState({ progress: 0, status: 'idle' })
  }, [])

  return {
    uploadResume,
    deleteResume,
    resetUpload,
    uploadState
  }
}

export function validateResumeFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only PDF and Word documents are allowed' }
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' }
  }

  return { valid: true }
}
