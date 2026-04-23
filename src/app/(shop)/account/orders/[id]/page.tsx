"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Package, ArrowLeft, Truck, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Order } from "@/types/shop"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params.id) return

    setLoading(true)
    const unsubscribe = onSnapshot(
      doc(db, "orders", params.id as string),
      (doc) => {
        if (doc.exists()) {
          setOrder({ id: doc.id, ...doc.data() } as Order)
        }
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [params.id])

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    )
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">Order not found</h2>
          <Link href="/account/orders">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/account/orders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Order {order.orderNumber || order.id.slice(-8)}
        </h1>
      </div>

      {/* Order Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Order Status</p>
              <Badge className={statusColors[order.status] || "bg-gray-100"}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium uppercase">{order.paymentMethod}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 py-4 border-b last:border-0">
              <div className="w-20 h-20 bg-gray-100 rounded-lg relative flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                {item.variant && (
                  <p className="text-sm text-gray-500">{item.variant}</p>
                )}
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span>{formatCurrency(order.shippingFee || 0)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Discount</span>
              <span className="text-green-600">-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="font-medium">{order.customer.name}</p>
            <p className="text-gray-600">{order.customer.email}</p>
            <p className="text-gray-600">{order.customer.phone}</p>
            <p className="text-gray-600 mt-2">{order.customer.address}</p>
            <p className="text-gray-600">
              {order.customer.city}, {order.customer.postalCode}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
