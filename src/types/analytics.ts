import type { Timestamp } from "firebase/firestore"

// Page View Tracking
export interface PageView {
  id?: string
  path: string
  fullUrl: string
  referrer: string | null
  title?: string
  userAgent: string
  sessionId: string
  userId: string | null
  ipAddress?: string
  timestamp: Timestamp
  // Device info
  deviceType: "desktop" | "tablet" | "mobile"
  browser: string
  os: string
  // Performance
  loadTime?: number
}

// Product View/Interaction Tracking
export interface ProductView {
  id?: string
  productId: string
  productName: string
  productSlug: string
  source: "shop" | "home" | "related" | "search" | "direct"
  sourcePath: string
  sessionId: string
  userId: string | null
  timestamp: Timestamp
  // Optional: track if they added to cart after viewing
  convertedToCart?: boolean
  convertedToOrder?: boolean
}

// Cart Event Tracking
export type CartAction = "add" | "remove" | "update_quantity" | "abandon" | "checkout_start" | "checkout_complete"

export interface CartEvent {
  id?: string
  action: CartAction
  sessionId: string
  userId: string | null
  items: CartItemSnapshot[]
  totalAmount?: number
  itemCount: number
  timestamp: Timestamp
  // For abandonment tracking
  abandonedAfterSeconds?: number
  recovered?: boolean
}

export interface CartItemSnapshot {
  productId: string
  name: string
  price: number
  quantity: number
  variant?: string
}

// User Session Tracking
export interface UserSession {
  id: string
  userId: string | null
  startTime: Timestamp
  endTime?: Timestamp
  pages: PageVisit[]
  deviceType: "desktop" | "tablet" | "mobile"
  browser: string
  os: string
  userAgent: string
  referrer: string | null
  // Conversion tracking
  cartCreated?: boolean
  orderPlaced?: boolean
  orderId?: string
}

export interface PageVisit {
  path: string
  timestamp: Timestamp
  timeSpentSeconds?: number
}

// Analytics Aggregations (for dashboard)
export interface PageViewStats {
  path: string
  totalViews: number
  uniqueVisitors: number
  avgTimeSpent: number
  bounceRate: number
  trending: "up" | "down" | "stable"
}

export interface ProductAnalytics {
  productId: string
  productName: string
  views: number
  addToCarts: number
  purchases: number
  conversionRate: number // purchases / views
  revenue: number
}

export interface CartFunnel {
  addToCart: number
  checkoutStarted: number
  checkoutCompleted: number
  abandoned: number
  abandonmentRate: number
  recoveryRate: number
}

export interface TimeRange {
  label: string
  days: number
  startDate: Date
  endDate: Date
}
