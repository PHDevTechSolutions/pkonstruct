"use client"

import { useMemo } from "react"
import { useProducts } from "@/hooks/use-products"
import { useOrders } from "@/hooks/use-orders"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, AlertTriangle, Package, TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react"

export default function ReportsPage() {
  const { products } = useProducts()
  const { orders } = useOrders()

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = products.length
    const activeProducts = products.filter(p => p.status === "active").length
    const lowStockProducts = products.filter(p => 
      p.quantity <= p.lowStockThreshold && p.quantity > 0
    ).length
    const outOfStockProducts = products.filter(p => p.quantity === 0).length
    
    const totalInventoryValue = products.reduce((sum, p) => 
      sum + (p.cost || 0) * p.quantity, 0
    )
    
    const totalRevenue = orders
      .filter(o => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.total, 0)
    
    const totalOrders = orders.length
    const pendingOrders = orders.filter(o => o.status === "pending").length

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      totalInventoryValue,
      totalRevenue,
      totalOrders,
      pendingOrders,
    }
  }, [products, orders])


  // Export to CSV
  const exportInventory = () => {
    const csv = [
      ["Name", "SKU", "Stock", "Status", "Value"].join(","),
      ...products.map(p => [
        `"${p.name}"`,
        p.itemCode,
        p.quantity,
        p.status,
        ((p.cost || 0) * p.quantity).toFixed(2)
      ].join(","))
    ].join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "inventory-report.csv"
    a.click()
  }

  const exportOrders = () => {
    const csv = [
      ["Order #", "Customer", "Date", "Total", "Status"].join(","),
      ...orders.map(o => [
        o.orderNumber,
        o.customer.name,
        new Date(o.createdAt).toISOString(),
        o.total.toFixed(2),
        o.status
      ].join(","))
    ].join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "orders-report.csv"
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Shop Reports</h1>
          <p className="text-gray-400 mt-1">Analytics and inventory reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportInventory}>
            <Download className="w-4 h-4 mr-2" />
            Export Inventory
          </Button>
          <Button variant="outline" size="sm" onClick={exportOrders}>
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-cyan-400" />
            <Badge variant="outline" className="text-xs">
              {stats.activeProducts} active
            </Badge>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
          <div className="text-sm text-gray-400">Total Products</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            ${stats.totalRevenue.toFixed(0)}
          </div>
          <div className="text-sm text-gray-400">Total Revenue</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <Badge variant="outline" className="text-xs">
              {stats.pendingOrders} pending
            </Badge>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
          <div className="text-sm text-gray-400">Total Orders</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            {stats.outOfStockProducts > 0 && (
              <Badge variant="destructive" className="text-xs">
                {stats.outOfStockProducts} out
              </Badge>
            )}
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.lowStockProducts}
          </div>
          <div className="text-sm text-gray-400">Low Stock Items</div>
        </div>
      </div>

      {/* Sales Summary */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Sales Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-[#333]">
              <span className="text-gray-400">Total Revenue</span>
              <span className="text-white font-medium">${stats.totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#333]">
              <span className="text-gray-400">Paid Orders</span>
              <span className="text-white font-medium">
                {orders.filter(o => o.paymentStatus === "paid").length}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#333]">
              <span className="text-gray-400">Pending Orders</span>
              <span className="text-yellow-400 font-medium">{stats.pendingOrders}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Average Order Value</span>
              <span className="text-white font-medium">
                ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : "0.00"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
          <div className="space-y-3 max-h-64 overflow-auto">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between py-2 border-b border-[#333]">
                <div>
                  <span className="text-white">{order.orderNumber || 'N/A'}</span>
                  <p className="text-xs text-gray-500">{order.customer.name}</p>
                </div>
                <span className="text-cyan-400 font-medium">${order.total.toFixed(2)}</span>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockProducts > 0 && (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">Low Stock Alert</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="text-left py-2 text-sm font-medium text-gray-400">Product</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-400">SKU</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-400">Current Stock</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-400">Threshold</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter(p => p.quantity <= p.lowStockThreshold)
                  .map(product => (
                    <tr key={product.id} className="border-b border-[#333]">
                      <td className="py-3 text-white">{product.name}</td>
                      <td className="py-3 text-gray-400 font-mono">{product.itemCode}</td>
                      <td className="py-3">
                        <span className={product.quantity === 0 ? 'text-red-400' : 'text-yellow-400'}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">{product.lowStockThreshold}</td>
                      <td className="py-3">
                        {product.quantity === 0 ? (
                          <Badge variant="destructive">Out of Stock</Badge>
                        ) : (
                          <Badge className="bg-yellow-600">Low Stock</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Value */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Inventory Value</h2>
            <p className="text-gray-400 text-sm">Total value at cost</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              ${stats.totalInventoryValue.toFixed(2)}
            </div>
            <p className="text-sm text-gray-400">
              Across {stats.totalProducts} products
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
