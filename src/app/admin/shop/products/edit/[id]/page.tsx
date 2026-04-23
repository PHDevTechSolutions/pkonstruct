"use client"

import { useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useProduct, useProducts } from "@/hooks/use-products"
import { useCategories } from "@/hooks/use-categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { ArrowLeft, Upload, X, Plus, Trash2, Save } from "lucide-react"
import type { Product } from "@/types/shop"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const { product, loading: productLoading } = useProduct(productId)
  const { updateProduct, deleteProduct } = useProducts()
  const { categories } = useCategories()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  
  // Local state for form
  const [formData, setFormData] = useState<Partial<Product>>({})
  const [images, setImages] = useState<string[]>([])
  const [featuredImage, setFeaturedImage] = useState<string>("")

  // Sync with product data when loaded
  if (product && !formData.name && Object.keys(formData).length === 0) {
    setFormData({ ...product })
    setImages(product.images || [])
    setFeaturedImage(product.featuredImage || product.images?.[0] || "")
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)
    const newImages: string[] = []

    try {
      for (const file of Array.from(files)) {
        const storageRef = ref(storage, `products/${Date.now()}-${file.name}`)
        await uploadBytes(storageRef, file)
        const url = await getDownloadURL(storageRef)
        newImages.push(url)
      }
      
      setImages(prev => [...prev, ...newImages])
      if (!featuredImage && newImages.length > 0) {
        setFeaturedImage(newImages[0])
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      alert("Failed to upload images")
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (url: string) => {
    setImages(prev => prev.filter(i => i !== url))
    if (featuredImage === url) {
      setFeaturedImage(images.find(i => i !== url) || "")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId) return
    
    setSaving(true)

    try {
      const result = await updateProduct(productId, {
        name: formData.name,
        itemCode: formData.itemCode,
        description: formData.description,
        price: formData.price,
        comparePrice: formData.comparePrice,
        cost: formData.cost,
        quantity: formData.quantity,
        lowStockThreshold: formData.lowStockThreshold,
        status: formData.status,
        categoryIds: formData.categoryIds,
        images: images,
        featuredImage: featuredImage || images[0] || "",
      })

      if (result.success) {
        router.push("/admin/shop/products")
      } else {
        alert("Error updating product: " + result.error)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to update product")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    const result = await deleteProduct(productId)
    if (result.success) {
      router.push("/admin/shop/products")
    } else {
      alert("Error deleting product: " + result.error)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleCategory = (categoryId: string) => {
    const currentIds = formData.categoryIds || []
    updateField("categoryIds", 
      currentIds.includes(categoryId)
        ? currentIds.filter(id => id !== categoryId)
        : [...currentIds, categoryId]
    )
  }

  if (productLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>Product not found</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">Edit Product</h1>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => updateField("name", e.target.value)}
                required
                className="bg-[#222] border-[#333] text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="itemCode">SKU / Item Code *</Label>
              <Input
                id="itemCode"
                value={formData.itemCode || ""}
                onChange={(e) => updateField("itemCode", e.target.value)}
                required
                className="bg-[#222] border-[#333] text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              className="bg-[#222] border-[#333] text-white"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Pricing</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || ""}
                  onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
                  required
                  className="bg-[#222] border-[#333] text-white pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comparePrice">Compare at Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.comparePrice || ""}
                  onChange={(e) => updateField("comparePrice", e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="bg-[#222] border-[#333] text-white pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cost">Cost per item</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost || ""}
                  onChange={(e) => updateField("cost", e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="bg-[#222] border-[#333] text-white pl-8"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Inventory</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity || ""}
                onChange={(e) => updateField("quantity", parseInt(e.target.value) || 0)}
                required
                className="bg-[#222] border-[#333] text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold || ""}
                onChange={(e) => updateField("lowStockThreshold", parseInt(e.target.value) || 5)}
                className="bg-[#222] border-[#333] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status || "active"}
                onChange={(e) => updateField("status", e.target.value as Product['status'])}
                className="w-full px-3 py-2 bg-[#222] border border-[#333] rounded-md text-white"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Images</h2>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <div className="grid grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div 
                key={url} 
                className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                  featuredImage === url ? 'border-cyan-500' : 'border-[#333]'
                }`}
              >
                <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
                {featuredImage === url && (
                  <div className="absolute bottom-0 left-0 right-0 bg-cyan-500 text-white text-xs text-center py-1">
                    Featured
                  </div>
                )}
                {featuredImage !== url && (
                  <button
                    type="button"
                    onClick={() => setFeaturedImage(url)}
                    className="absolute bottom-0 left-0 right-0 bg-[#333] text-white text-xs text-center py-1 hover:bg-[#444]"
                  >
                    Set Featured
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImages}
              className="aspect-square rounded-lg border-2 border-dashed border-[#444] hover:border-[#666] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              {uploadingImages ? (
                <div className="animate-spin h-6 w-6 border-2 border-cyan-500 border-t-transparent rounded-full" />
              ) : (
                <>
                  <Upload className="w-6 h-6" />
                  <span className="text-xs">Upload Images</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    formData.categoryIds?.includes(category.id)
                      ? 'bg-cyan-600 text-white'
                      : 'bg-[#222] text-gray-400 hover:bg-[#333]'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SEO */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">SEO Settings</h2>
          
          <div className="space-y-2">
            <Label htmlFor="seoTitle">Meta Title</Label>
            <Input
              id="seoTitle"
              value={formData.seo?.title || ""}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                seo: { ...prev.seo, title: e.target.value }
              }))}
              className="bg-[#222] border-[#333] text-white"
              placeholder="Leave blank to use product name"
              maxLength={60}
            />
            <p className="text-xs text-gray-500">
              {(formData.seo?.title || "").length}/60 characters
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="seoDescription">Meta Description</Label>
            <Textarea
              id="seoDescription"
              value={formData.seo?.description || ""}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                seo: { ...prev.seo, description: e.target.value }
              }))}
              className="bg-[#222] border-[#333] text-white"
              placeholder="Brief description for search results"
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-gray-500">
              {(formData.seo?.description || "").length}/160 characters
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {saving ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
