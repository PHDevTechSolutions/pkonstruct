"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { app, db } from "@/lib/firebase"

const auth = getAuth(app)

export interface UserData {
  firstName?: string
  lastName?: string
  phone?: string
  role?: "admin" | "customer"
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, userData?: UserData) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string) => {
    try {
      const profileDoc = await getDoc(doc(db, "user_profiles", uid))
      if (profileDoc.exists()) {
        setUserData(profileDoc.data() as UserData)
      } else {
        setUserData(null)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      setUserData(null)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        await fetchUserProfile(user.uid)
      } else {
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const register = async (email: string, password: string, userDataInput?: UserData) => {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
    
    // Update Firebase Auth profile
    if (userDataInput?.firstName || userDataInput?.lastName) {
      const displayName = `${userDataInput.firstName || ""} ${userDataInput.lastName || ""}`.trim()
      await updateProfile(newUser, { displayName })
    }
    
    // Save user profile to Firestore
    const profileData: UserData & { email: string; createdAt: any; updatedAt: any } = {
      firstName: userDataInput?.firstName || "",
      lastName: userDataInput?.lastName || "",
      phone: userDataInput?.phone || "",
      role: userDataInput?.role || "customer",
      email: newUser.email!,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    
    await setDoc(doc(db, "user_profiles", newUser.uid), profileData)
    setUserData(profileData)
  }

  const logout = async () => {
    await signOut(auth)
    setUserData(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
