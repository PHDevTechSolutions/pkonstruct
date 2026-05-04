"use client"

import { useState, useCallback } from "react"
import { uploadResumeToCloudinary } from "@/lib/cloudinary"

interface UploadState {
  status: "idle" | "uploading" | "success" | "error"
  progress: number
  error: string | null
  url: string | null
}

export function useCloudinaryUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    progress: 0,
    error: null,
    url: null,
  })

  const resetUpload = useCallback(() => {
    setUploadState({
      status: "idle",
      progress: 0,
      error: null,
      url: null,
    })
  }, [])

  const uploadToCloudinary = async (file: File): Promise<string> => {
    setUploadState({
      status: "uploading",
      progress: 50, // Simulate progress since Cloudinary doesn't provide it
      error: null,
      url: null,
    })

    try {
      // Use the simple unsigned upload from lib/cloudinary
      const { url } = await uploadResumeToCloudinary(file, "resumes")

      setUploadState({
        status: "success",
        progress: 100,
        error: null,
        url: url,
      })

      return url
    } catch (error: any) {
      console.error("Cloudinary upload error:", error)
      setUploadState({
        status: "error",
        progress: 0,
        error: error.message || "Upload failed",
        url: null,
      })
      throw error
    }
  }

  return {
    uploadState,
    uploadToCloudinary,
    resetUpload,
  }
}

// File validation
export const validateResumeFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]
  
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Please upload a PDF or Word document" }
  }

  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 5MB" }
  }

  return { valid: true }
}
