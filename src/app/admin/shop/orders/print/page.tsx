"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useOrder } from "@/hooks/use-orders"
import { PrintInvoice } from "@/components/admin/print-invoice"

export default function PrintOrderPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  
  const { order, loading } = useOrder(orderId || "")

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Order not found</p>
      </div>
    )
  }

  return <PrintInvoice order={order} />
}
