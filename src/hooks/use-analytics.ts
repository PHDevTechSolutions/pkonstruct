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

  // Initialize session in Firestore
  const initializeSession = async (sessionId: string) => {
    try {
      const sessionData: Omit<UserSession, "id"> = {
        userId: user?.uid || null,
        startTime: serverTimestamp() as Timestamp,
        pages: [],
        deviceType: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || null,
      }
      
      await setDoc(doc(db, "user_sessions", sessionId), sessionData)
    } catch (err) {
      console.error("Error initializing session:", err)
    }
  }

  // End session
  const endSession = async (sessionId: string) => {
    try {
      await updateDoc(doc(db, "user_sessions", sessionId), {
        endTime: serverTimestamp(),
      })
    } catch (err) {
      console.error("Error ending session:", err)
    }
  }

  // Update session with page visit
  const updateSessionPage = useCallback(async (path: string, timeSpentSeconds?: number) => {
    if (!sessionIdRef.current) return
    
    try {
      // Use Timestamp.now() instead of serverTimestamp() for arrayUnion
      const { Timestamp } = await import("firebase/firestore")
      const pageVisit: PageVisit = {
        path,
        timestamp: Timestamp.now(),
        timeSpentSeconds,
      }
      
      await updateDoc(doc(db, "user_sessions", sessionIdRef.current), {
        pages: arrayUnion(pageVisit),
      })
    } catch (err) {
      console.error("Error updating session page:", err)
    }
  }, [])

  // Track page view
  const trackPageView = useCallback(async (path?: string, title?: string) => {
    const pagePath = path || window.location.pathname
    const pageTitle = title || document.title
    const now = Date.now()
    
    // Calculate time spent on previous page
    if (currentPageRef.current) {
      const timeSpent = Math.round((now - currentPageRef.current.startTime) / 1000)
      await updateSessionPage(currentPageRef.current.path, timeSpent)
    }
    
    currentPageRef.current = { path: pagePath, startTime: now }
    
    try {
      const pageView: Omit<PageView, "id"> = {
        path: pagePath,
        fullUrl: window.location.href,
        referrer: document.referrer || null,
        title: pageTitle,
        userAgent: navigator.userAgent,
        sessionId: sessionIdRef.current,
        userId: user?.uid || null,
        timestamp: serverTimestamp() as Timestamp,
        deviceType: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
      }
      
      await addDoc(collection(db, "page_views"), pageView)
    } catch (err) {
      console.error("Error tracking page view:", err)
    }
  }, [user?.uid, updateSessionPage])

  // Track product view
  const trackProductView = useCallback(async (
    productId: string, 
    productName: string,
    productSlug: string,
    source: ProductView["source"] = "direct"
  ) => {
    try {
      const productView: Omit<ProductView, "id"> = {
        productId,
        productName,
        productSlug,
        source,
        sourcePath: window.location.pathname,
        sessionId: sessionIdRef.current,
        userId: user?.uid || null,
        timestamp: serverTimestamp() as Timestamp,
      }
      
      await addDoc(collection(db, "product_views"), productView)
    } catch (err) {
      console.error("Error tracking product view:", err)
    }
  }, [user?.uid])

  // Track cart event
  const trackCartEvent = useCallback(async (
    action: CartAction,
    items: CartItemSnapshot[],
    totalAmount?: number
  ) => {
    try {
      const cartEvent: Omit<CartEvent, "id"> = {
        action,
        sessionId: sessionIdRef.current,
        userId: user?.uid || null,
        items,
        totalAmount,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        timestamp: serverTimestamp() as Timestamp,
      }
      
      // Add abandonment tracking for cart adds
      if (action === "add") {
        cartEvent.abandonedAfterSeconds = 0 // Will be updated later
      }
      
      await addDoc(collection(db, "cart_events"), cartEvent)
      
      // Update session if cart created or order placed
      if (action === "checkout_complete" || action === "checkout_start") {
        await updateDoc(doc(db, "user_sessions", sessionIdRef.current), {
          [action === "checkout_complete" ? "orderPlaced" : "cartCreated"]: true,
        })
      }
    } catch (err) {
      console.error("Error tracking cart event:", err)
    }
  }, [user?.uid])

  // Track cart abandonment (call when user leaves with items in cart)
  const trackCartAbandonment = useCallback(async (
    items: CartItemSnapshot[],
    totalAmount: number,
    timeInCartSeconds: number
  ) => {
    try {
      const cartEvent: Omit<CartEvent, "id"> = {
        action: "abandon",
        sessionId: sessionIdRef.current,
        userId: user?.uid || null,
        items,
        totalAmount,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        timestamp: serverTimestamp() as Timestamp,
        abandonedAfterSeconds: timeInCartSeconds,
      }
      
      await addDoc(collection(db, "cart_events"), cartEvent)
    } catch (err) {
      console.error("Error tracking cart abandonment:", err)
    }
  }, [user?.uid])

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

