export interface Product {
  id: string
  name: string
  itemCode: string
  description: string
  price: number
  comparePrice?: number
  cost?: number
  quantity: number
  lowStockThreshold: number
  status: 'active' | 'draft' | 'out_of_stock'
  categoryIds: string[]
  images: string[]
  featuredImage: string
  variants?: ProductVariant[]
  attributes?: Record<string, string>
  weight?: number
  seo?: {
    title?: string
    description?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface ProductVariantOption {
  name: string
  value: string
  priceAdjustment?: number
  stock?: number
}

export interface ProductVariant {
  id: string
  name: string  // e.g., "Size", "Color"
  options: ProductVariantOption[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  sortOrder: number
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  variant?: string
  image?: string
}

export interface Order {
  id: string
  orderNumber?: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'gcash' | 'maya' | 'bank_transfer' | 'cod'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentProof?: string
  notes?: string
  statusHistory?: {
    status: string
    timestamp: Date
    note?: string
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  variant?: string  // e.g., "Size: Large, Color: Blue"
  image: string
  maxStock: number
}

export interface CartSession {
  sessionId: string
  userId?: string
  items: CartItem[]
  expiresAt: Date
}

export interface ShippingSettings {
  freeShippingThreshold: number  // e.g., 50 for free shipping over $50
  defaultShippingFee: number     // e.g., 10 for standard shipping
  expressShippingFee?: number    // e.g., 20 for express
  calculateByWeight?: boolean    // enable weight-based calculation
  weightRates?: {
    maxWeight: number  // in kg
    rate: number
  }[]
  zones?: {
    name: string
    regions: string[]  // list of cities/postal codes
    rate: number
  }[]
}

export interface CartItemWithVariant extends CartItem {
  selectedVariants?: Record<string, string>  // { "Size": "Large", "Color": "Blue" }
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number  // 1-5
  title?: string
  comment: string
  verified: boolean  // verified purchase
  helpful: number  // helpful vote count
  createdAt: Date
  updatedAt: Date
}

export interface WishlistItem {
  productId: string
  userId: string
  addedAt: Date
}
