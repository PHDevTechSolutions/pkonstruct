"use client"

import { useState } from "react"
import Link from "next/link"
import { useProducts } from "@/hooks/use-products"
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
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  Package,
  Filter,
  Download,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import type { Product } from "@/types/shop"

export default function ProductsPage() {
  const { products, loading, deleteProduct, bulkDelete, updateProduct } = useProducts()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.itemCode.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    
    const matchesStock = stockFilter === "all" || 
      (stockFilter === "low" && product.quantity <= product.lowStockThreshold) ||
      (stockFilter === "out" && product.quantity === 0) ||
      (stockFilter === "in" && product.quantity > product.lowStockThreshold)
    
    return matchesSearch && matchesStatus && matchesStock
  })

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  // Reset to page 1 when filters change
  const handleFilterChange = (setter: (value: string) => void, value: string) => {
    setter(value)
    setCurrentPage(1)
  }
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  // Select all
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredProducts.map(p => p.id))
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} products?`)) return
    await bulkDelete(selectedIds)
    setSelectedIds([])
  }

  // Handle status change
  const handleStatusChange = async (id: string, status: Product['status']) => {
    await updateProduct(id, { status })
  }

  // Export to CSV
  const handleExport = () => {
    const csv = [
      ["Name", "SKU", "Price", "Stock", "Status"].join(","),
      ...filteredProducts.map(p => [
        `"${p.name}"`,
        p.itemCode,
        p.price,
        p.quantity,
        p.status
      ].join(","))
    ].join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "products.csv"
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
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">Manage your product inventory</p>
        </div>
        <Link href="/admin/shop/products/new">
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-[#333] text-white"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
          className="px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md text-white text-sm [&>option]:bg-[#1a1a1a] [&>option]:text-white"
        >
          <option value="all" className="bg-[#1a1a1a] text-white">All Status</option>
          <option value="active" className="bg-[#1a1a1a] text-white">Active</option>
          <option value="draft" className="bg-[#1a1a1a] text-white">Draft</option>
          <option value="out_of_stock" className="bg-[#1a1a1a] text-white">Out of Stock</option>
        </select>

        <select
          value={stockFilter}
          onChange={(e) => handleFilterChange(setStockFilter, e.target.value)}
          className="px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md text-white text-sm [&>option]:bg-[#1a1a1a] [&>option]:text-white"
        >
          <option value="all" className="bg-[#1a1a1a] text-white">All Stock</option>
          <option value="in" className="bg-[#1a1a1a] text-white">In Stock</option>
          <option value="low" className="bg-[#1a1a1a] text-white">Low Stock</option>
          <option value="out" className="bg-[#1a1a1a] text-white">Out of Stock</option>
        </select>

        {selectedIds.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete ({selectedIds.length})
          </Button>
        )}

        <Button variant="outline" size="sm" onClick={handleExport} className="border-[#444] text-white hover:bg-[#222] bg-[#222] hover:text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{products.length}</div>
          <div className="text-sm text-gray-400">Total Products</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-bold text-green-500">
            {products.filter(p => p.status === 'active').length}
          </div>
          <div className="text-sm text-gray-400">Active</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-500">
            {products.filter(p => p.quantity <= p.lowStockThreshold && p.quantity > 0).length}
          </div>
          <div className="text-sm text-gray-400">Low Stock</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-bold text-red-500">
            {products.filter(p => p.quantity === 0).length}
          </div>
          <div className="text-sm text-gray-400">Out of Stock</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Product</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">SKU</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="border-b border-[#333] hover:bg-[#222]">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={() => toggleSelect(product.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#222] rounded-lg overflow-hidden relative">
                      {product.featuredImage ? (
                        <Image
                          src={product.featuredImage}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-500 absolute inset-0 m-auto" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">{product.name}</div>
                      {product.quantity <= product.lowStockThreshold && product.quantity > 0 && (
                        <div className="flex items-center gap-1 text-xs text-yellow-500">
                          <AlertCircle className="w-3 h-3" />
                          Low stock
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 font-mono text-sm">
                  {product.itemCode}
                </td>
                <td className="px-4 py-3 text-white">
                  ${product.price.toFixed(2)}
                  {product.comparePrice && (
                    <span className="text-gray-500 line-through ml-2 text-sm">
                      ${product.comparePrice.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {product.quantity}
                </td>
                <td className="px-4 py-3">
                  <Badge 
                    variant={product.status === 'active' ? 'default' : 'secondary'}
                    className={
                      product.status === 'active' ? 'bg-green-600' :
                      product.status === 'draft' ? 'bg-gray-600' :
                      'bg-red-600'
                    }
                  >
                    {product.status}
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
                      <DropdownMenuItem onClick={() => window.location.href = `/admin/shop/products/edit/${product.id}`} className="text-white hover:bg-[#333] focus:bg-[#333] focus:text-white">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(product.id, product.status === 'active' ? 'draft' : 'active')}
                        className="text-white hover:bg-[#333] focus:bg-[#333] focus:text-white"
                      >
                        {product.status === 'active' ? 'Set to Draft' : 'Set to Active'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-400 hover:bg-[#333] focus:bg-[#333]"
                        onClick={() => {
                          if (confirm('Delete this product?')) {
                            deleteProduct(product.id)
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No products found</p>
            {searchQuery && <p className="text-sm mt-1">Try adjusting your search</p>}
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-[#333]">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-2 py-1 bg-[#222] border border-[#333] rounded text-sm text-white [&>option]:bg-[#222] [&>option]:text-white"
              >
                <option value={10} className="bg-[#222] text-white">10</option>
                <option value={25} className="bg-[#222] text-white">25</option>
                <option value={50} className="bg-[#222] text-white">50</option>
                <option value={100} className="bg-[#222] text-white">100</option>
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
