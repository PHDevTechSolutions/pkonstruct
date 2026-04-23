"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Package, Eye } from "lucide-react"
import Link from "next/link"
import type { Order } from "@/types/shop"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    setLoading(true)
    const q = query(
      collection(db, "orders"),
      where("customer.email", "==", user.email),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[]
      setOrders(items)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-4">Start shopping to see your orders here</p>
            <Link href="/shop">
              <Button className="bg-cyan-600 hover:bg-cyan-700">Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-medium">{order.orderNumber || order.id.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                  </div>
                  <Badge className={statusColors[order.status] || "bg-gray-100"}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Link href={`/account/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
