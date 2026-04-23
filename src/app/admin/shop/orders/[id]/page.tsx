"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useOrder, useOrders } from "@/hooks/use-orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, CreditCard, MapPin, Phone, Mail, Calendar, Printer, Clock } from "lucide-react"
import Image from "next/image"
import type { Order } from "@/types/shop"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-600",
  paid: "bg-blue-600",
  processing: "bg-purple-600",
  shipped: "bg-cyan-600",
  delivered: "bg-green-600",
  cancelled: "bg-red-600",
}

const paymentStatusColors: Record<string, string> = {
  pending: "bg-yellow-600",
  paid: "bg-green-600",
  failed: "bg-red-600",
  refunded: "bg-gray-600",
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  
  const { order, loading } = useOrder(orderId)
  const { updateOrderStatus, updatePaymentStatus, addOrderNote } = useOrders()
  
  const [note, setNote] = useState("")
  const [savingNote, setSavingNote] = useState(false)

  const handleStatusChange = async (status: Order['status']) => {
    await updateOrderStatus(orderId, status)
  }

  const handlePaymentStatusChange = async (status: Order['paymentStatus']) => {
    await updatePaymentStatus(orderId, status)
  }

  const handleSaveNote = async () => {
    setSavingNote(true)
    await addOrderNote(orderId, note)
    setSavingNote(false)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>Order not found</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              window.open(`/admin/shop/orders/print?orderId=${orderId}`, '_blank')
            }}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{order.orderNumber || 'N/A'}</h1>
            <p className="text-gray-400 text-sm">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[order.status]}>
            {order.status}
          </Badge>
          <Badge className={paymentStatusColors[order.paymentStatus]}>
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-3 border-b border-[#333] last:border-0">
                  <div className="w-16 h-16 bg-[#222] rounded-lg overflow-hidden relative flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <Package className="w-8 h-8 text-gray-500 absolute inset-0 m-auto" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{item.name}</h3>
                    {item.variant && (
                      <p className="text-sm text-gray-400">{item.variant}</p>
                    )}
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Totals */}
            <div className="mt-6 pt-6 border-t border-[#333] space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>{formatCurrency(order.shippingFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-semibold text-lg pt-2 border-t border-[#333]">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Payment Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                <p className="text-white capitalize">{order.paymentMethod.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                <Badge className={paymentStatusColors[order.paymentStatus]}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
            
            {order.paymentProof && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Payment Proof</p>
                <a 
                  href={order.paymentProof} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <img 
                    src={order.paymentProof} 
                    alt="Payment proof" 
                    className="max-w-xs rounded-lg border border-[#333] hover:border-cyan-500 transition-colors"
                  />
                </a>
              </div>
            )}
          </div>

          {/* Status Timeline */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Order Timeline</h2>
            
            {order.statusHistory && order.statusHistory.length > 0 ? (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-[#333]" />
                
                {/* Timeline items */}
                <div className="space-y-4">
                  {/* Current status */}
                  <div className="flex items-start gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${statusColors[order.status]}`}>
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">{order.status}</p>
                      <p className="text-sm text-gray-500">Current Status</p>
                      <p className="text-xs text-gray-400">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                  
                  {/* History items */}
                  {[...order.statusHistory].reverse().map((history, idx) => (
                    <div key={idx} className="flex items-start gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${statusColors[history.status as keyof typeof statusColors] || 'bg-gray-600'}`}>
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize">{history.status}</p>
                        {history.note && (
                          <p className="text-sm text-gray-400 mt-1">{history.note}</p>
                        )}
                        <p className="text-xs text-gray-500">{formatDate(history.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusColors[order.status]}`}>
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium capitalize">{order.status}</p>
                  <p className="text-sm text-gray-500">Order created</p>
                  <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Notes</h2>
            {order.notes && (
              <p className="text-gray-300 mb-4 p-3 bg-[#222] rounded-lg">{order.notes}</p>
            )}
            <div className="space-y-2">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note to this order..."
                className="bg-[#222] border-[#333] text-white"
                rows={3}
              />
              <Button 
                onClick={handleSaveNote}
                disabled={!note.trim() || savingNote}
                size="sm"
              >
                {savingNote ? 'Saving...' : 'Add Note'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Customer & Actions */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Customer</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-cyan-500">
                    {order.customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-white">{order.customer.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{order.customer.phone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Shipping Address</h2>
            <div className="flex items-start gap-3 text-gray-400">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
              <div>
                <p>{order.customer.address}</p>
                <p>{order.customer.city}, {order.customer.postalCode}</p>
              </div>
            </div>
          </div>

          {/* Order Actions */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Update Status</h2>
            <div className="space-y-2">
              {order.status === 'pending' && (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleStatusChange('paid')}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Mark as Paid
                </Button>
              )}
              
              {(order.status === 'pending' || order.status === 'paid') && (
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleStatusChange('processing')}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Start Processing
                </Button>
              )}
              
              {order.status === 'processing' && (
                <Button 
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                  onClick={() => handleStatusChange('shipped')}
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Mark as Shipped
                </Button>
              )}
              
              {order.status === 'shipped' && (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusChange('delivered')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Delivered
                </Button>
              )}
              
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <Button 
                  variant="outline"
                  className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
                  onClick={() => {
                    if (confirm('Cancel this order?')) {
                      handleStatusChange('cancelled')
                    }
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Order
                </Button>
              )}
            </div>
          </div>

          {/* Payment Actions */}
          {order.paymentStatus !== 'paid' && (
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Payment Actions</h2>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handlePaymentStatusChange('paid')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Payment
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => handlePaymentStatusChange('failed')}
                >
                  Mark Payment Failed
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
