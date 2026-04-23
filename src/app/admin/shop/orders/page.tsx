"use client"

import { useState } from "react"
import { useOrders } from "@/hooks/use-orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreVertical,
  Eye,
  Trash2,
  ListOrdered,
  Download,
  CreditCard,
  Package,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
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

export default function OrdersPage() {
  const { orders, loading, updateOrderStatus, updatePaymentStatus, deleteOrder } = useOrders()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter
    
    return matchesSearch && matchesStatus && matchesPayment
  })
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  // Select all
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredOrders.map(o => o.id))
    }
  }

  // Handle bulk status update
  const handleBulkStatusUpdate = async (status: Order['status']) => {
    for (const id of selectedIds) {
      await updateOrderStatus(id, status)
    }
    setSelectedIds([])
  }

  // Export to CSV
  const handleExport = () => {
    const csv = [
      ["Order #", "Customer", "Date", "Total", "Status", "Payment"].join(","),
      ...filteredOrders.map(o => [
        o.orderNumber,
        o.customer.name,
        o.createdAt.toISOString(),
        o.total,
        o.status,
        o.paymentStatus
      ].join(","))
    ].join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "orders.csv"
    a.click()
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Format currency
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-gray-400 mt-1">Manage customer orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="border-[#444] text-white hover:bg-[#222] hover:text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{orders.length}</div>
          <div className="text-sm text-gray-400">Total Orders</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-500">
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-400">Pending</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-500">
            {orders.filter(o => o.status === 'paid').length}
          </div>
          <div className="text-sm text-gray-400">Paid</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-500">
            {orders.filter(o => o.status === 'processing').length}
          </div>
          <div className="text-sm text-gray-400">Processing</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-bold text-green-500">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
          <div className="text-sm text-gray-400">Delivered</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search by order #, customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-[#333] text-white"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md text-white text-sm [&>option]:bg-[#1a1a1a] [&>option]:text-white"
        >
          <option value="all" className="bg-[#1a1a1a] text-white">All Status</option>
          <option value="pending" className="bg-[#1a1a1a] text-white">Pending</option>
          <option value="paid" className="bg-[#1a1a1a] text-white">Paid</option>
          <option value="processing" className="bg-[#1a1a1a] text-white">Processing</option>
          <option value="shipped" className="bg-[#1a1a1a] text-white">Shipped</option>
          <option value="delivered" className="bg-[#1a1a1a] text-white">Delivered</option>
          <option value="cancelled" className="bg-[#1a1a1a] text-white">Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md text-white text-sm [&>option]:bg-[#1a1a1a] [&>option]:text-white"
        >
          <option value="all" className="bg-[#1a1a1a] text-white">All Payments</option>
          <option value="pending" className="bg-[#1a1a1a] text-white">Pending</option>
          <option value="paid" className="bg-[#1a1a1a] text-white">Paid</option>
          <option value="failed" className="bg-[#1a1a1a] text-white">Failed</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] rounded-lg p-3">
          <span className="text-sm text-gray-400">{selectedIds.length} selected:</span>
          <Button size="sm" variant="outline" onClick={() => handleBulkStatusUpdate('processing')} className="border-[#444] text-white hover:bg-[#222] hover:text-white">
            Mark Processing
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkStatusUpdate('shipped')} className="border-[#444] text-white hover:bg-[#222] hover:text-white">
            Mark Shipped
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkStatusUpdate('delivered')} className="border-[#444] text-white hover:bg-[#222] hover:text-white">
            Mark Delivered
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="px-4 py-3 text-left w-10">
                <Checkbox
                  checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Order</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Payment</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id} className="border-b border-[#333] hover:bg-[#222]">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedIds.includes(order.id)}
                    onCheckedChange={() => toggleSelect(order.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{order.orderNumber || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{order.items.length} items</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-white">{order.customer.name}</div>
                  <div className="text-xs text-gray-500">{order.customer.email}</div>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3 text-white font-medium">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3 h-3 text-gray-500" />
                    <Badge 
                      className={paymentStatusColors[order.paymentStatus] || "bg-gray-600"}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">
                    {order.paymentMethod.replace('_', ' ')}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={statusColors[order.status] || "bg-gray-600"}>
                    {order.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#333]">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#222] border-[#333] z-50 relative">
                      <DropdownMenuItem onClick={() => window.location.href = `/admin/shop/orders/${order.id}`} className="text-white hover:bg-[#333] focus:bg-[#333] focus:text-white">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => updatePaymentStatus(order.id, 'paid')} className="text-white hover:bg-[#333] focus:bg-[#333] focus:text-white">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Paid
                      </DropdownMenuItem>
                      
                      {order.status === 'pending' && (
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'processing')} className="text-white hover:bg-[#333] focus:bg-[#333] focus:text-white">
                          <Package className="w-4 h-4 mr-2" />
                          Start Processing
                        </DropdownMenuItem>
                      )}
                      
                      {order.status === 'processing' && (
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'shipped')} className="text-white hover:bg-[#333] focus:bg-[#333] focus:text-white">
                          <Truck className="w-4 h-4 mr-2" />
                          Mark Shipped
                        </DropdownMenuItem>
                      )}
                      
                      {order.status === 'shipped' && (
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'delivered')} className="text-white hover:bg-[#333] focus:bg-[#333] focus:text-white">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Delivered
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem 
                        className="text-red-400 hover:bg-[#333] focus:bg-[#333]"
                        onClick={() => {
                          if (confirm('Cancel this order?')) {
                            updateOrderStatus(order.id, 'cancelled')
                          }
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel Order
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        className="text-red-400"
                        onClick={() => {
                          if (confirm('Delete this order?')) {
                            deleteOrder(order.id, order.items)
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <ListOrdered className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No orders found</p>
            {searchQuery && <p className="text-sm mt-1">Try adjusting your search</p>}
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-[#333]">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-2 py-1 bg-[#222] border border-[#333] rounded text-sm text-white [&>option]:bg-[#222] [&>option]:text-white"
              >
                <option value={10} className="bg-[#222] text-white">10 per page</option>
                <option value={25} className="bg-[#222] text-white">25 per page</option>
                <option value={50} className="bg-[#222] text-white">50 per page</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="border-[#444] text-white hover:bg-[#222] hover:text-white disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-sm text-gray-400 px-2">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="border-[#444] text-white hover:bg-[#222] hover:text-white disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
