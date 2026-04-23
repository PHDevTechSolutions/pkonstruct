"use client"

import { useState, useEffect, useCallback } from "react"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/hooks/use-auth"

export interface Address {
  id: string
  label: string // e.g., "Home", "Work"
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface UserProfile {
  userId: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: "admin" | "customer"
  addresses: Address[]
  createdAt?: Date
  updatedAt?: Date
}

export function useUserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const profileDoc = await getDoc(doc(db, "user_profiles", user.uid))
      
      if (profileDoc.exists()) {
        const data = profileDoc.data()
        setProfile({
          userId: user.uid,
          email: data.email || user.email || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          role: data.role || "customer",
          addresses: data.addresses || [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        })
      } else {
        setProfile(null)
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile")
      console.error("Error fetching user profile:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Load profile on mount or user change
  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) {
      throw new Error("User not authenticated")
    }

    setLoading(true)
    setError(null)

    try {
      const profileRef = doc(db, "user_profiles", user.uid)
      
      await updateDoc(profileRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  // Add address
  const addAddress = useCallback(async (address: Omit<Address, "id">) => {
    if (!user) {
      throw new Error("User not authenticated")
    }

    const newAddress: Address = {
      ...address,
      id: `addr_${Date.now()}`,
    }

    const currentAddresses = profile?.addresses || []
    
    // If this is the first address or marked as default, update other addresses
    let updatedAddresses = [...currentAddresses, newAddress]
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id,
      }))
    }

    await updateProfile({ addresses: updatedAddresses })
    
    return newAddress
  }, [user, profile, updateProfile])

  // Update address
  const updateAddress = useCallback(async (addressId: string, updates: Partial<Address>) => {
    if (!user || !profile) {
      throw new Error("User not authenticated")
    }

    let updatedAddresses = profile.addresses.map(addr => 
      addr.id === addressId ? { ...addr, ...updates } : addr
    )

    // If setting this as default, unset others
    if (updates.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    }

    await updateProfile({ addresses: updatedAddresses })
  }, [user, profile, updateProfile])

  // Remove address
  const removeAddress = useCallback(async (addressId: string) => {
    if (!user || !profile) {
      throw new Error("User not authenticated")
    }

    const updatedAddresses = profile.addresses.filter(addr => addr.id !== addressId)
    
    // If we removed the default, set the first remaining as default
    if (profile.addresses.find(a => a.id === addressId)?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true
    }

    await updateProfile({ addresses: updatedAddresses })
  }, [user, profile, updateProfile])

  // Get default address
  const getDefaultAddress = useCallback(() => {
    if (!profile?.addresses) return null
    return profile.addresses.find(addr => addr.isDefault) || profile.addresses[0] || null
  }, [profile])

  return {
    profile,
    loading,
    error,
    refresh: fetchProfile,
    updateProfile,
    addAddress,
    updateAddress,
    removeAddress,
    getDefaultAddress,
    isAuthenticated: !!user,
  }
}
