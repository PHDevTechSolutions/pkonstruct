"use client"

import { useState, useEffect } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
  isActive: boolean
}

export interface HeaderButton {
  id: string
  label: string
  link: string
  variant: "default" | "outline" | "ghost"
  isActive: boolean
}

export interface SiteSettings {
  header: {
    logoText: string
    logoImage?: string
    showLogo: boolean
    buttons: HeaderButton[]
  }
  footer: {
    companyName: string
    tagline: string
    showSocialLinks: boolean
    socialLinks: SocialLink[]
    copyright: string
  }
}

const defaultSettings: SiteSettings = {
  header: {
    logoText: "PKonstruct",
    showLogo: true,
    buttons: [
      { id: "cta-1", label: "Get Quote", link: "/contact", variant: "default", isActive: true }
    ]
  },
  footer: {
    companyName: "PKonstruct",
    tagline: "Building excellence since 2005. We transform your vision into reality with quality craftsmanship and innovative solutions.",
    showSocialLinks: true,
    socialLinks: [
      { id: "social-1", platform: "Facebook", url: "#", icon: "Facebook", isActive: true },
      { id: "social-2", platform: "Twitter", url: "#", icon: "Twitter", isActive: true },
      { id: "social-3", platform: "Instagram", url: "#", icon: "Instagram", isActive: true },
      { id: "social-4", platform: "LinkedIn", url: "#", icon: "LinkedIn", isActive: true },
    ],
    copyright: "© 2025 PKonstruct. All rights reserved."
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const docRef = doc(db, "settings", "site")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings
          // Merge with defaults to ensure all fields exist
          setSettings({
            header: { ...defaultSettings.header, ...data.header },
            footer: { ...defaultSettings.footer, ...data.footer }
          })
        }
      } catch (err) {
        console.error("Error fetching settings:", err)
        setError("Failed to load settings")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const saveSettings = async (newSettings: SiteSettings) => {
    try {
      await setDoc(doc(db, "settings", "site"), newSettings)
      setSettings(newSettings)
      return true
    } catch (err) {
      console.error("Error saving settings:", err)
      setError("Failed to save settings")
      return false
    }
  }

  return { settings, loading, error, saveSettings }
}
