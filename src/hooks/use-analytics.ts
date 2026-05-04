"use client"

import { useCallback, useEffect, useRef } from "react"
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc,
  setDoc,
  Timestamp,
  arrayUnion
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "./use-auth"
import type { 
  PageView, 
  ProductView, 
  CartEvent, 
  CartAction, 
  CartItemSnapshot,
  UserSession,
  PageVisit
} from "@/types/analytics"

const SESSION_STORAGE_KEY = "analytics_session_id"
const SESSION_START_KEY = "analytics_session_start"

// Utility to detect device type
function getDeviceType(): "desktop" | "tablet" | "mobile" {
  const userAgent = navigator.userAgent
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent)) return "tablet"
  if (/Mobile|iPhone|Android|iPod/i.test(userAgent)) return "mobile"
  return "desktop"
}

// Utility to detect browser
function getBrowser(): string {
  const userAgent = navigator.userAgent
  if (userAgent.includes("Chrome")) return "Chrome"
  if (userAgent.includes("Safari")) return "Safari"
  if (userAgent.includes("Firefox")) return "Firefox"
  if (userAgent.includes("Edge")) return "Edge"
  if (userAgent.includes("Opera")) return "Opera"
  return "Unknown"
}

// Utility to detect OS
function getOS(): string {
  const userAgent = navigator.userAgent
  if (userAgent.includes("Windows")) return "Windows"
  if (userAgent.includes("Mac")) return "MacOS"
  if (userAgent.includes("Linux")) return "Linux"
  if (userAgent.includes("Android")) return "Android"
  if (userAgent.includes("iOS")) return "iOS"
  return "Unknown"
}

export function useAnalytics() {
  const { user } = useAuth()
  const sessionIdRef = useRef<string>("")
  const currentPageRef = useRef<{ path: string; startTime: number } | null>(null)

  // Initialize or get session ID
  useEffect(() => {
    let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY)
    const sessionStart = sessionStorage.getItem(SESSION_START_KEY)
    const now = Date.now()
    
    // Create new session if doesn't exist or if session is older than 30 minutes
    if (!sessionId || !sessionStart || (now - parseInt(sessionStart)) > 30 * 60 * 1000) {
      sessionId = `sess_${now}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId)
      sessionStorage.setItem(SESSION_START_KEY, now.toString())
      
      // Initialize session document in Firestore
      initializeSession(sessionId)
    }
    
    sessionIdRef.current = sessionId
    
    // Track session end on page unload
    const handleBeforeUnload = () => {
      endSession(sessionId!)
    }
    
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [])

  // Initialize session in Firestore - DISABLED to prevent quota exhaustion
  const initializeSession = async (sessionId: string) => {
    // Analytics disabled to save Firebase quota
    console.log("Analytics session initialized (not saved to Firestore):", sessionId)
    return
  }

  // End session - DISABLED to prevent quota exhaustion
  const endSession = async (sessionId: string) => {
    // Analytics disabled to save Firebase quota
    console.log("Analytics session ended (not saved to Firestore):", sessionId)
    return
  }

  // Update session with page visit - DISABLED to prevent quota exhaustion
  const updateSessionPage = useCallback(async (path: string, timeSpentSeconds?: number) => {
    // Analytics disabled to save Firebase quota
    return
  }, [])

  // Track page view - DISABLED to prevent quota exhaustion
  const trackPageView = useCallback(async (path?: string, title?: string) => {
    // Analytics disabled to save Firebase quota
    console.log("Page view tracked (not saved to Firestore):", path || window.location.pathname)
    return
  }, [])

  // Track product view - DISABLED to prevent quota exhaustion
  const trackProductView = useCallback(async (
    productId: string, 
    productName: string,
    productSlug: string,
    source: ProductView["source"] = "direct"
  ) => {
    // Analytics disabled to save Firebase quota
    console.log("Product view tracked (not saved to Firestore):", productId, productName)
    return
  }, [])

  // Track cart event - DISABLED to prevent quota exhaustion
  const trackCartEvent = useCallback(async (
    action: CartAction,
    items: CartItemSnapshot[],
    totalAmount?: number
  ) => {
    // Analytics disabled to save Firebase quota
    console.log("Cart event tracked (not saved to Firestore):", action, items.length, "items")
    return
  }, [])

  // Track cart abandonment - DISABLED to prevent quota exhaustion
  const trackCartAbandonment = useCallback(async (
    items: CartItemSnapshot[],
    totalAmount: number,
    timeInCartSeconds: number
  ) => {
    // Analytics disabled to save Firebase quota
    console.log("Cart abandonment tracked (not saved to Firestore):", items.length, "items")
    return
  }, [])

  // Track conversion from product view
  const trackProductConversion = useCallback(async (productId: string, toCart: boolean, toOrder?: boolean) => {
    // Find the most recent product view for this product in this session
    // This would be handled by a cloud function in production
    // For now, we'll just log it
    console.log("Product conversion tracked:", { productId, toCart, toOrder })
  }, [])

  return {
    trackPageView,
    trackProductView,
    trackCartEvent,
    trackCartAbandonment,
    trackProductConversion,
    sessionId: sessionIdRef.current,
  }
}

// Hook to track page view on mount
export function usePageViewTracking(path?: string, title?: string) {
  const { trackPageView } = useAnalytics()
  
  useEffect(() => {
    trackPageView(path, title)
  }, [trackPageView, path, title])
}

