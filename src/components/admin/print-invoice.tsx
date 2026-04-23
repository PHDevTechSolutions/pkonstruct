"use client"

import { useEffect } from "react"
import type { Order } from "@/types/shop"

interface PrintInvoiceProps {
  order: Order
  storeName?: string
  storeAddress?: string
  storePhone?: string
  storeEmail?: string
}

export function PrintInvoice({ 
  order, 
  storeName = "Your Store",
  storeAddress = "123 Main Street, City, Country",
  storePhone = "+1 234 567 890",
  storeEmail = "orders@yourstore.com"
}: PrintInvoiceProps) {
  
  useEffect(() => {
    // Auto-trigger print when component mounts
    const timer = setTimeout(() => {
      window.print()
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  return (
    <div className="print-invoice">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          
          body * {
            visibility: hidden;
          }
          
          .print-invoice,
          .print-invoice * {
            visibility: visible;
          }
          
          .print-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
          }
          
          .no-print {
            display: none !important;
          }
        }
        
        .print-invoice {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1a1a1a;
          background: white;
        }
      `}</style>

      {/* Invoice Content */}
      <div className="print-invoice-content">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-8 border-b-2 border-gray-900">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{storeName}</h1>
            <p className="text-gray-600 text-sm">{storeAddress}</p>
            <p className="text-gray-600 text-sm">{storePhone}</p>
            <p className="text-gray-600 text-sm">{storeEmail}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
            <p className="text-gray-600 mt-1">
              <span className="font-semibold">Order #:</span> {order.orderNumber || order.id.slice(-8).toUpperCase()}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Date:</span> {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-semibold text-gray-900">{order.customer.name}</p>
            <p className="text-gray-600">{order.customer.email}</p>
            <p className="text-gray-600">{order.customer.phone}</p>
            <p className="text-gray-600 mt-2">{order.customer.address}</p>
            <p className="text-gray-600">{order.customer.city}, {order.customer.postalCode}</p>
          </div>
        </div>

        {/* Order Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="text-left py-3 px-4 font-semibold">Item</th>
              <th className="text-center py-3 px-4 font-semibold">Qty</th>
              <th className="text-right py-3 px-4 font-semibold">Price</th>
              <th className="text-right py-3 px-4 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  {item.variant && (
                    <p className="text-sm text-gray-500">{item.variant}</p>
                  )}
                </td>
                <td className="text-center py-3 px-4 text-gray-700">{item.quantity}</td>
                <td className="text-right py-3 px-4 text-gray-700">
                  {formatCurrency(item.price)}
                </td>
                <td className="text-right py-3 px-4 font-medium text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-gray-900">
                {order.shippingFee === 0 ? 'Free' : formatCurrency(order.shippingFee)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-gray-900">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <p className="font-semibold text-gray-900 capitalize">{order.paymentMethod}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-500 mb-1">Payment Status</p>
              <p className="font-semibold text-gray-900 capitalize">{order.paymentStatus}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Status</h3>
          <div className="inline-block bg-gray-100 px-4 py-2 rounded">
            <span className="font-semibold text-gray-900 capitalize">{order.status}</span>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Notes</h3>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
              <p className="text-gray-700">{order.notes}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-2">Thank you for your business!</p>
          <p className="text-sm text-gray-500">
            If you have any questions, please contact us at {storeEmail} or {storePhone}
          </p>
        </div>

        {/* Print Button (hidden when printing) */}
        <div className="no-print mt-8 text-center">
          <button
            onClick={() => window.print()}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Print Invoice
          </button>
          <button
            onClick={() => window.close()}
            className="ml-4 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
