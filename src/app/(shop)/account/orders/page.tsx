"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Package, Eye, ShoppingBag, Calendar, CreditCard, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Order } from "@/types/shop"

const statusConfig: Record<string, { bg: string; text: string; icon: typeof Package }> = {
  pending: { bg: "bg-gradient-to-r from-yellow-100 to-amber-100", text: "text-yellow-700", icon: Package },
  processing: { bg: "bg-gradient-to-r from-blue-100 to-indigo-100", text: "text-blue-700", icon: Package },
  shipped: { bg: "bg-gradient-to-r from-purple-100 to-violet-100", text: "text-purple-700", icon: Package },
  delivered: { bg: "bg-gradient-to-r from-green-100 to-emerald-100", text: "text-green-700", icon: Package },
  cancelled: { bg: "bg-gradient-to-r from-red-100 to-rose-100", text: "text-red-700", icon: Package },
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
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl"
        >
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
          <ShoppingBag className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      </motion.div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="shadow-lg shadow-gray-200/50 border border-gray-100">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <Package className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
              <Link href="/shop">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 rounded-xl">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Order Number</p>
                      <p className="font-bold text-gray-900">#{order.orderNumber || order.id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Date</p>
                      <div className="flex items-center gap-1 text-gray-900 font-medium">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total</p>
                      <div className="flex items-center gap-1 text-blue-600 font-bold">
                        <CreditCard className="w-4 h-4" />
                        {formatCurrency(order.total)}
                      </div>
                    </div>
                    <Badge className={`${statusConfig[order.status]?.bg || "bg-gray-100"} ${statusConfig[order.status]?.text || "text-gray-700"} px-3 py-1.5 rounded-full font-medium border-0`}>
                      <Sparkles className="w-3 h-3 mr-1" />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-500 mb-3">
                      <span className="font-medium text-gray-900">{order.items.length}</span> {order.items.length === 1 ? "item" : "items"}
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {order.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: itemIndex * 0.05 }}
                          className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-xl overflow-hidden relative"
                        >
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                              <Package className="w-6 h-6 text-blue-400" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
