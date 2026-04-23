"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useProducts } from "@/hooks/use-products"
import { useCategories } from "@/hooks/use-categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { ArrowLeft, Upload, X, Plus, Trash2, ImageIcon } from "lucide-react"
import type { Product, ProductVariant } from "@/types/shop"

export default function NewProductPage() {
  const router = useRouter()
  const { createProduct } = useProducts()
  const { categories } = useCategories()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [featuredImage, setFeaturedImage] = useState<string>("")
  
  const [formData, setFormData] = useState({
    name: "",
    itemCode: "",
    description: "",
    price: "",
    comparePrice: "",
    cost: "",
    quantity: "",
    lowStockThreshold: "5",
    status: "active" as Product['status'],
    categoryIds: [] as string[],
    weight: "",
    seoTitle: "",
    seoDescription: "",
  })
  
  const [variants, setVariants] = useState<ProductVariant[]>([])

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
    setLoading(true)

    try {
      const result = await createProduct({
        name: formData.name,
        itemCode: formData.itemCode,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        quantity: parseInt(formData.quantity) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
        status: formData.status,
        categoryIds: formData.categoryIds,
        images: images,
        featuredImage: featuredImage || images[0] || "",
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        variants: variants.length > 0 ? variants : undefined,
        seo: {
          title: formData.seoTitle || undefined,
          description: formData.seoDescription || undefined,
        },
      })

      if (result.success) {
        router.push("/admin/shop/products")
      } else {
        alert("Error creating product: " + result.error)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
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
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
                className="bg-[#222] border-[#333] text-white"
                placeholder="e.g., Premium Cleaning Service"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="itemCode">SKU / Item Code *</Label>
              <Input
                id="itemCode"
                value={formData.itemCode}
                onChange={(e) => updateField("itemCode", e.target.value)}
                required
                className="bg-[#222] border-[#333] text-white font-mono"
                placeholder="e.g., SKU-001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              className="bg-[#222] border-[#333] text-white"
              placeholder="Describe your product..."
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
                  value={formData.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  required
                  className="bg-[#222] border-[#333] text-white pl-8"
                  placeholder="0.00"
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
                  value={formData.comparePrice}
                  onChange={(e) => updateField("comparePrice", e.target.value)}
                  className="bg-[#222] border-[#333] text-white pl-8"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500">Original price for comparison</p>
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
                  value={formData.cost}
                  onChange={(e) => updateField("cost", e.target.value)}
                  className="bg-[#222] border-[#333] text-white pl-8"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500">For profit calculations</p>
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
                value={formData.quantity}
                onChange={(e) => updateField("quantity", e.target.value)}
                required
                className="bg-[#222] border-[#333] text-white"
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={(e) => updateField("lowStockThreshold", e.target.value)}
                className="bg-[#222] border-[#333] text-white"
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="w-full px-3 py-2 bg-[#222] border border-[#333] rounded-md text-white"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                min="0"
                value={formData.weight}
                onChange={(e) => updateField("weight", e.target.value)}
                className="bg-[#222] border-[#333] text-white"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500">For shipping calculations</p>
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
          
          <p className="text-sm text-gray-500">
            Click "Set Featured" to choose the main product image. First image is featured by default.
          </p>
        </div>

        {/* Variants */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Variants</h2>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const newVariant: ProductVariant = {
                  id: Date.now().toString(),
                  name: "",
                  options: []
                }
                setVariants([...variants, newVariant])
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Variant
            </Button>
          </div>
          
          {variants.length === 0 && (
            <p className="text-gray-500 text-sm">No variants. Add variants like Size, Color, etc.</p>
          )}
          
          <div className="space-y-4">
            {variants.map((variant, variantIndex) => (
              <div key={variant.id} className="bg-[#222] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Variant name (e.g., Size, Color)"
                    value={variant.name}
                    onChange={(e) => {
                      const updated = [...variants]
                      updated[variantIndex].name = e.target.value
                      setVariants(updated)
                    }}
                    className="bg-[#1a1a1a] border-[#333] text-white flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setVariants(variants.filter((_, i) => i !== variantIndex))
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {variant.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <Input
                        placeholder="Option value (e.g., Large, Red)"
                        value={option.value}
                        onChange={(e) => {
                          const updated = [...variants]
                          updated[variantIndex].options[optionIndex].value = e.target.value
                          setVariants(updated)
                        }}
                        className="bg-[#1a1a1a] border-[#333] text-white flex-1"
                      />
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Price adj"
                          value={option.priceAdjustment || ""}
                          onChange={(e) => {
                            const updated = [...variants]
                            updated[variantIndex].options[optionIndex].priceAdjustment = parseFloat(e.target.value) || 0
                            setVariants(updated)
                          }}
                          className="bg-[#1a1a1a] border-[#333] text-white pl-6 w-28"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = [...variants]
                          updated[variantIndex].options = variant.options.filter((_, i) => i !== optionIndex)
                          setVariants(updated)
                        }}
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      const updated = [...variants]
                      updated[variantIndex].options.push({ name: "", value: "", priceAdjustment: 0 })
                      setVariants(updated)
                    }}
                  >
                    <Plus className="w-3 h-3 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            ))}
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
                    formData.categoryIds.includes(category.id)
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
              value={formData.seoTitle}
              onChange={(e) => updateField("seoTitle", e.target.value)}
              className="bg-[#222] border-[#333] text-white"
              placeholder="Leave blank to use product name"
              maxLength={60}
            />
            <p className="text-xs text-gray-500">
              {formData.seoTitle.length}/60 characters. Search engines typically show 50-60 characters.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="seoDescription">Meta Description</Label>
            <Textarea
              id="seoDescription"
              value={formData.seoDescription}
              onChange={(e) => updateField("seoDescription", e.target.value)}
              className="bg-[#222] border-[#333] text-white"
              placeholder="Brief description for search results"
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-gray-500">
              {formData.seoDescription.length}/160 characters. Recommended length for search engines.
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !formData.name || !formData.itemCode}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Create Product
          </Button>
        </div>
      </form>
    </div>
  )
}
