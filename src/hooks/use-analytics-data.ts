"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  collection, 
  query, 
  where,
  orderBy,
  onSnapshot,
  getDocs,
  Timestamp,
  limit
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { 
  PageView, 
  ProductView, 
  CartEvent, 
  PageViewStats,
  ProductAnalytics,
  CartFunnel,
  UserSession
} from "@/types/analytics"

// Get date range for queries
function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  return { start, end }
}

// Convert to Firestore timestamp
function toTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date)
}

// Hook for page view statistics
export function usePageViewStats(days: number = 7) {
  const [stats, setStats] = useState<PageViewStats[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [uniqueVisitors, setUniqueVisitors] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const { start } = getDateRange(days)
    const startTimestamp = toTimestamp(start)

    const q = query(
      collection(db, "page_views"),
      where("timestamp", ">=", startTimestamp),
      orderBy("timestamp", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const views: PageView[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }) as PageView)

      // Aggregate by path
      const pathStats = new Map<string, { views: number; uniqueSessions: Set<string> }>()
      const allSessions = new Set<string>()

      views.forEach(view => {
        allSessions.add(view.sessionId)
        
        const existing = pathStats.get(view.path) || { views: 0, uniqueSessions: new Set() }
        existing.views++
        existing.uniqueSessions.add(view.sessionId)
        pathStats.set(view.path, existing)
      })

      const aggregatedStats: PageViewStats[] = Array.from(pathStats.entries()).map(([path, data]) => ({
        path,
        totalViews: data.views,
        uniqueVisitors: data.uniqueSessions.size,
        avgTimeSpent: 0, // Would need session data
        bounceRate: 0, // Would need calculation
        trending: "stable" as const,
      })).sort((a, b) => b.totalViews - a.totalViews)

      setStats(aggregatedStats)
      setTotalViews(views.length)
      setUniqueVisitors(allSessions.size)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [days])

  return { stats, totalViews, uniqueVisitors, loading }
}

// Hook for product analytics
export function useProductAnalytics(days: number = 7) {
  const [productStats, setProductStats] = useState<ProductAnalytics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const { start } = getDateRange(days)
    const startTimestamp = toTimestamp(start)

    const viewsQuery = query(
      collection(db, "product_views"),
      where("timestamp", ">=", startTimestamp),
      orderBy("timestamp", "desc")
    )

    const cartQuery = query(
      collection(db, "cart_events"),
      where("timestamp", ">=", startTimestamp),
      where("action", "in", ["add", "checkout_complete"])
    )

    const unsubViews = onSnapshot(viewsQuery, (viewSnap) => {
      const unsubCart = onSnapshot(cartQuery, (cartSnap) => {
        const views: ProductView[] = viewSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }) as ProductView)

        const cartEvents: CartEvent[] = cartSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }) as CartEvent)

        // Aggregate by product
        const productMap = new Map<string, {
          name: string
          views: number
          addToCarts: number
          purchases: number
          revenue: number
        }>()

        views.forEach(view => {
          const existing = productMap.get(view.productId) || {
            name: view.productName,
            views: 0,
            addToCarts: 0,
            purchases: 0,
            revenue: 0,
          }
          existing.views++
          productMap.set(view.productId, existing)
        })

        cartEvents.forEach(event => {
          if (event.action === "add") {
            event.items.forEach(item => {
              const existing = productMap.get(item.productId)
              if (existing) {
                existing.addToCarts += item.quantity
              }
            })
          } else if (event.action === "checkout_complete") {
            event.items.forEach(item => {
              const existing = productMap.get(item.productId)
              if (existing) {
                existing.purchases += item.quantity
                existing.revenue += item.price * item.quantity
              }
            })
          }
        })

        const analytics: ProductAnalytics[] = Array.from(productMap.entries()).map(([productId, data]) => ({
          productId,
          productName: data.name,
          views: data.views,
          addToCarts: data.addToCarts,
          purchases: data.purchases,
          conversionRate: data.views > 0 ? (data.purchases / data.views) * 100 : 0,
          revenue: data.revenue,
        })).sort((a, b) => b.views - a.views)

        setProductStats(analytics)
        setLoading(false)
      })

      return () => unsubCart()
    })

    return () => unsubViews()
  }, [days])

  return { productStats, loading }
}

// Hook for cart funnel analytics
export function useCartFunnel(days: number = 7) {
  const [funnel, setFunnel] = useState<CartFunnel>({
    addToCart: 0,
    checkoutStarted: 0,
    checkoutCompleted: 0,
    abandoned: 0,
    abandonmentRate: 0,
    recoveryRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const { start } = getDateRange(days)
    const startTimestamp = toTimestamp(start)

    const q = query(
      collection(db, "cart_events"),
      where("timestamp", ">=", startTimestamp),
      orderBy("timestamp", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events: CartEvent[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }) as CartEvent)

      const uniqueSessions = {
        addToCart: new Set<string>(),
        checkoutStarted: new Set<string>(),
        checkoutCompleted: new Set<string>(),
        abandoned: new Set<string>(),
      }

      events.forEach(event => {
        if (event.action === "add") uniqueSessions.addToCart.add(event.sessionId)
        else if (event.action === "checkout_start") uniqueSessions.checkoutStarted.add(event.sessionId)
        else if (event.action === "checkout_complete") uniqueSessions.checkoutCompleted.add(event.sessionId)
        else if (event.action === "abandon") uniqueSessions.abandoned.add(event.sessionId)
      })

      const addToCartCount = uniqueSessions.addToCart.size
      const completedCount = uniqueSessions.checkoutCompleted.size
      const abandonedCount = uniqueSessions.abandoned.size

      setFunnel({
        addToCart: addToCartCount,
        checkoutStarted: uniqueSessions.checkoutStarted.size,
        checkoutCompleted: completedCount,
        abandoned: abandonedCount,
        abandonmentRate: addToCartCount > 0 
          ? ((addToCartCount - completedCount) / addToCartCount) * 100 
          : 0,
        recoveryRate: 0, // Would need to track recovered carts
      })
      setLoading(false)
    })

    return () => unsubscribe()
  }, [days])

  return { funnel, loading }
}

// Hook for top pages
export function useTopPages(days: number = 7, limitCount: number = 10) {
  const { stats, loading } = usePageViewStats(days)
  const topPages = stats.slice(0, limitCount)
  return { topPages, loading }
}

// Hook for top products
export function useTopProducts(days: number = 7, limitCount: number = 10) {
  const { productStats, loading } = useProductAnalytics(days)
  const topProducts = productStats.slice(0, limitCount)
  return { topProducts, loading }
}

// Hook for real-time active users (sessions in last 30 minutes)
export function useActiveUsers() {
  const [activeUsers, setActiveUsers] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    const timestamp = toTimestamp(thirtyMinutesAgo)

    const q = query(
      collection(db, "user_sessions"),
      where("startTime", ">=", timestamp)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Count sessions without endTime (active) or ended less than 30 min ago
      const activeCount = snapshot.docs.filter(doc => {
        const data = doc.data() as UserSession
        return !data.endTime || data.endTime.toMillis() > thirtyMinutesAgo.getTime()
      }).length
      
      setActiveUsers(activeCount)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { activeUsers, loading }
}

// Hook for daily stats (for charts)
export function useDailyStats(days: number = 7) {
  const [dailyData, setDailyData] = useState<Array<{
    date: string
    pageViews: number
    uniqueVisitors: number
    cartEvents: number
    orders: number
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const { start } = getDateRange(days)
    const startTimestamp = toTimestamp(start)

    const fetchData = async () => {
      // Get page views
      const viewsSnap = await getDocs(query(
        collection(db, "page_views"),
        where("timestamp", ">=", startTimestamp)
      ))

      // Get cart events
      const cartSnap = await getDocs(query(
        collection(db, "cart_events"),
        where("timestamp", ">=", startTimestamp)
      ))

      // Group by date
      const dataMap = new Map<string, {
        pageViews: number
        uniqueSessions: Set<string>
        cartEvents: number
        orders: number
      }>()

      // Initialize all days
      for (let i = 0; i < days; i++) {
        const date = new Date(start)
        date.setDate(date.getDate() + i)
        const dateKey = date.toISOString().split('T')[0]
        dataMap.set(dateKey, {
          pageViews: 0,
          uniqueSessions: new Set(),
          cartEvents: 0,
          orders: 0,
        })
      }

      viewsSnap.forEach(doc => {
        const data = doc.data() as PageView
        const date = data.timestamp.toDate().toISOString().split('T')[0]
        const dayData = dataMap.get(date)
        if (dayData) {
          dayData.pageViews++
          dayData.uniqueSessions.add(data.sessionId)
        }
      })

      cartSnap.forEach(doc => {
        const data = doc.data() as CartEvent
        const date = data.timestamp.toDate().toISOString().split('T')[0]
        const dayData = dataMap.get(date)
        if (dayData) {
          dayData.cartEvents++
          if (data.action === "checkout_complete") {
            dayData.orders++
          }
        }
      })

      const result = Array.from(dataMap.entries()).map(([date, data]) => ({
        date,
        pageViews: data.pageViews,
        uniqueVisitors: data.uniqueSessions.size,
        cartEvents: data.cartEvents,
        orders: data.orders,
      })).sort((a, b) => a.date.localeCompare(b.date))

      setDailyData(result)
      setLoading(false)
    }

    fetchData()
  }, [days])

  return { dailyData, loading }
}
