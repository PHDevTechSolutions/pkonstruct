"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShopHeader } from "@/components/shop/shop-header"
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Clock,
  Copy,
  ChevronRight
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Order } from "@/types/shop"

const PAYMENT_INSTRUCTIONS: Record<string, { title: string; steps: string[] }> = {
  gcash: {
    title: "GCash Payment",
    steps: [
      "Open your GCash app",
      "Send payment to: 0917-123-4567",
      "Amount: Order total",
      "Screenshot the receipt",
      "Upload proof in your order details"
    ]
  },
  maya: {
    title: "Maya Payment",
    steps: [
      "Open your Maya app",
      "Send payment to: 0917-123-4567",
      "Amount: Order total",
      "Screenshot the receipt",
      "Upload proof in your order details"
    ]
  },
  bank_transfer: {
    title: "Bank Transfer",
    steps: [
      "Transfer to: BDO Account # 1234-5678-9012",
      "Account Name: Your Store Name",
      "Amount: Order total",
      "Email screenshot to orders@yourstore.com"
    ]
  },
  cod: {
    title: "Cash on Delivery",
    steps: [
      "Prepare exact amount: Order total",
      "Wait for delivery",
      "Pay upon receiving your order"
    ]
  }
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.orderId as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", orderId)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setOrder({
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          } as Order)
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const copyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-5 h-5 text-yellow-500" />
      case "processing": return <Package className="w-5 h-5 text-purple-500" />
      case "shipped": return <Truck className="w-5 h-5 text-cyan-500" />
      case "delivered": return <CheckCircle className="w-5 h-5 text-green-500" />
      default: return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing": return "bg-purple-100 text-purple-800 border-purple-200"
      case "shipped": return "bg-cyan-100 text-cyan-800 border-cyan-200"
      case "delivered": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h1>
        <p className="text-gray-500 mb-4">We couldn&apos;t find this order</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  const paymentInfo = PAYMENT_INSTRUCTIONS[order.paymentMethod]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <ShopHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank you for your order!</h1>
          <p className="text-gray-600">We&apos;ve received your order and will process it shortly.</p>
        </div>

        {/* Order Number */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-xl font-bold text-gray-900">{order.orderNumber || order.id.slice(-8).toUpperCase()}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={copyOrderNumber}
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>

        {/* Order Status */}
        <div className="mb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="font-medium capitalize">{order.status}</span>
          </div>
          
          {order.paymentStatus === "pending" && order.paymentMethod !== "cod" && (
            <p className="mt-2 text-sm text-yellow-600">
              Payment pending - Please complete payment using the instructions below
            </p>
          )}
        </div>

        {/* Payment Instructions */}
        {paymentInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">{paymentInfo.title}</h2>
            <ol className="space-y-2">
              {paymentInfo.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-blue-800">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium">
                    {idx + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Order Summary */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Order Summary</h2>
          </div>
          
          {/* Items */}
          <div className="divide-y divide-gray-200">
            {order.items.map((item, idx) => (
              <div key={idx} className="px-6 py-4 flex items-center gap-4">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  {item.variant && (
                    <p className="text-sm text-gray-500">{item.variant}</p>
                  )}
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          
          {/* Totals */}
          <div className="bg-gray-50 px-6 py-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{order.shippingFee === 0 ? 'Free' : `$${order.shippingFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Shipping Information</h2>
          <div className="space-y-1 text-gray-600">
            <p className="font-medium text-gray-900">{order.customer.name}</p>
            <p>{order.customer.email}</p>
            <p>{order.customer.phone}</p>
            <p>{order.customer.address}</p>
            <p>{order.customer.city}, {order.customer.postalCode}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="flex-1">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/shop" className="flex-1">
            <Button className="w-full bg-gray-900 hover:bg-gray-800">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Shop More
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
