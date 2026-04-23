"use client"

import { useState } from "react"
import { useCategories } from "@/hooks/use-categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreVertical, Edit, Trash2, Tag, ImageIcon } from "lucide-react"
import type { Category } from "@/types/shop"

export default function CategoriesPage() {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    sortOrder: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const data = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
    }

    if (editingCategory) {
      const result = await updateCategory(editingCategory.id, data)
      if (result.success) {
        setIsDialogOpen(false)
        setEditingCategory(null)
        resetForm()
      } else {
        alert("Error updating category: " + result.error)
      }
    } else {
      const result = await createCategory(data)
      if (result.success) {
        setIsDialogOpen(false)
        resetForm()
      } else {
        alert("Error creating category: " + result.error)
      }
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: category.image || "",
      sortOrder: category.sortOrder,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return
    const result = await deleteCategory(id)
    if (!result.success) {
      alert("Error deleting category: " + result.error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
      sortOrder: categories.length,
    })
  }

  const openNewDialog = () => {
    setEditingCategory(null)
    resetForm()
    setFormData(prev => ({ ...prev, sortOrder: categories.length }))
    setIsDialogOpen(true)
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
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 mt-1">Organize your products into categories</p>
        </div>
        <Button onClick={openNewDialog} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <div 
            key={category.id} 
            className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 hover:border-[#444] transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#222] rounded-lg flex items-center justify-center">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Tag className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#222] border-[#333]">
                  <DropdownMenuItem onClick={() => handleEdit(category)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-400"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <h3 className="font-semibold text-white mb-1">{category.name}</h3>
            <p className="text-sm text-gray-500 font-mono mb-2">/{category.slug}</p>
            {category.description && (
              <p className="text-sm text-gray-400 line-clamp-2">{category.description}</p>
            )}
            
            <div className="mt-4 pt-4 border-t border-[#333]">
              <span className="text-xs text-gray-500">Order: {category.sortOrder}</span>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-[#1a1a1a] border border-[#333] rounded-lg">
          <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No categories yet</p>
          <Button onClick={openNewDialog} variant="outline" className="mt-4">
            Create your first category
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-white">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="bg-[#222] border-[#333] text-white"
                placeholder="e.g., Cleaning Services"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="bg-[#222] border-[#333] text-white font-mono"
                placeholder="auto-generated-from-name"
              />
              <p className="text-xs text-gray-500">
                Leave empty to auto-generate from name
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-[#222] border-[#333] text-white"
                placeholder="Brief description..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="bg-[#222] border-[#333] text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                min="0"
                value={formData.sortOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                className="bg-[#222] border-[#333] text-white"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
