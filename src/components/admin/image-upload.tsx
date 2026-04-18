"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { uploadImageToCloudinary } from "@/lib/cloudinary"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
}

export function ImageUpload({ value, onChange, folder = "pkonstruct" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB")
        return
      }

      setUploading(true)
      setError(null)

      try {
        const result = await uploadImageToCloudinary(file, folder)
        onChange(result.url)
      } catch (err) {
        setError("Failed to upload image. Please try again.")
        console.error(err)
      } finally {
        setUploading(false)
      }
    },
    [folder, onChange]
  )

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Uploaded"
            className="w-48 h-32 object-cover rounded-lg"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="w-48 h-32 flex flex-col items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span className="text-sm">Click to upload</span>
              </>
            )}
          </Button>
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
