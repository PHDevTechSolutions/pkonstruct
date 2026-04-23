"use client"

import { useState, useMemo } from "react"
import { useProducts } from "@/hooks/use-products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, 
  Package, 
  Search, 
  Download, 
  Plus, 
  Minus,
  RefreshCw,
  ArrowUpDown
} from "lucide-react"
import type { Product } from "@/types/shop"

export default function InventoryPage() {
  const { products, loading, updateProduct } = useProducts()
  const [searchQuery, setSearchQuery] = useState("")
  const [stockAdjustments, setStockAdjustments] = useState<Record<string, number>>({})
  const [filter, setFilter] = useState<"all" | "low" | "out">("all")

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.itemCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Stock filter
    if (filter === "low") {
      filtered = filtered.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold)
    } else if (filter === "out") {
      filtered = filtered.filter(p => p.quantity === 0)
    }
    
    return filtered
  }, [products, searchQuery, filter])

  // Stats
  const stats = useMemo(() => ({
    total: products.length,
    lowStock: products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold).length,
    outOfStock: products.filter(p => p.quantity === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.cost || 0) * p.quantity, 0)
  }), [products])

  // Handle stock adjustment input
  const handleAdjustmentChange = (productId: string, value: string) => {
    const num = parseInt(value) || 0
    setStockAdjustments(prev => ({ ...prev, [productId]: num }))
  }

  // Apply stock adjustment
  const applyAdjustment = async (product: Product) => {
    const adjustment = stockAdjustments[product.id]
    if (!adjustment || adjustment === 0) return
    
    const newQuantity = Math.max(0, product.quantity + adjustment)
    const result = await updateProduct(product.id, { quantity: newQuantity })
    
    if (result.success) {
      setStockAdjustments(prev => ({ ...prev, [product.id]: 0 }))
    }
  }

  // Quick adjust +/- 1
  const quickAdjust = async (product: Product, delta: number) => {
    const newQuantity = Math.max(0, product.quantity + delta)
    await updateProduct(product.id, { quantity: newQuantity })
  }

  // Export inventory
  const exportInventory = () => {
    const csv = [
      ["SKU", "Name", "Current Stock", "Low Threshold", "Status", "Unit Cost", "Total Value"].join(","),
      ...products.map(p => [
        p.itemCode,
        `"${p.name}"`,
        p.quantity,
        p.lowStockThreshold,
        p.quantity === 0 ? "Out of Stock" : p.quantity <= p.lowStockThreshold ? "Low Stock" : "OK",
        p.cost || 0,
        ((p.cost || 0) * p.quantity).toFixed(2)
      ].join(","))
    ].join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
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
          <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
          <p className="text-gray-400 mt-1">Track stock levels and manage inventory</p>
        </div>
        <Button onClick={exportInventory}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Products</div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.lowStock}</div>
              <div className="text-sm text-gray-400">Low Stock</div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Package className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.outOfStock}</div>
              <div className="text-sm text-gray-400">Out of Stock</div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <ArrowUpDown className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">${stats.totalValue.toFixed(0)}</div>
              <div className="text-sm text-gray-400">Inventory Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-[#333] text-white"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={filter === "all" ? "default" : "default"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={filter === "low" ? "default" : "default"}
            size="sm"
            onClick={() => setFilter("low")}
            className={filter === "low" ? "bg-yellow-600" : ""}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Low Stock
          </Button>
          <Button 
            variant={filter === "out" ? "default" : "default"}
            size="sm"
            onClick={() => setFilter("out")}
            className={filter === "out" ? "bg-red-600" : ""}
          >
            Out of Stock
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#222]">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Product</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">SKU</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-400">Current Stock</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-400">Threshold</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-400">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Quick Adjust</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Bulk Adjust</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const isLow = product.quantity > 0 && product.quantity <= product.lowStockThreshold
              const isOut = product.quantity === 0
              
              return (
                <tr key={product.id} className="border-t border-[#333]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.featuredImage ? (
                        <img 
                          src={product.featuredImage} 
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover bg-[#222]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-[#222] flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="text-white font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">${product.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-sm">{product.itemCode}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-lg font-semibold ${
                      isOut ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400">{product.lowStockThreshold}</td>
                  <td className="px-4 py-3 text-center">
                    {isOut ? (
                      <Badge variant="destructive">Out of Stock</Badge>
                    ) : isLow ? (
                      <Badge className="bg-yellow-600">Low Stock</Badge>
                    ) : (
                      <Badge className="bg-green-600">In Stock</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                      
                        onClick={() => quickAdjust(product, -1)}
                        disabled={product.quantity <= 0}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-12 text-center text-white">{product.quantity}</span>
                      <Button
                        size="sm"
                        
                        onClick={() => quickAdjust(product, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="+/- qty"
                        value={stockAdjustments[product.id] || ""}
                        onChange={(e) => handleAdjustmentChange(product.id, e.target.value)}
                        className="w-24 bg-[#333] border-[#333] text-white text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => applyAdjustment(product)}
                        disabled={!stockAdjustments[product.id]}
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}
