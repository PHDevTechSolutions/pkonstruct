"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import { useCart } from "@/hooks/use-cart"
import { useAnalytics } from "@/hooks/use-analytics"
import { ShopHeader } from "@/components/shop/shop-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Check, ChevronLeft, Minus, Plus, Package, Share2 } from "lucide-react"
import { Reviews } from "@/components/shop/reviews"
import { WishlistButton } from "@/components/shop/wishlist-button"
import { RelatedProducts } from "@/components/shop/related-products"
import Image from "next/image"
import Link from "next/link"
import type { Product, ProductVariant } from "@/types/shop"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { addItem } = useCart()
  const { trackProductView } = useAnalytics()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})

  // Subscribe to product
  useEffect(() => {
    if (!productId) return

    setLoading(true)
    const unsubscribe = onSnapshot(
      doc(db, "products", productId),
      (docSnap) => {
        if (docSnap.exists()) {
          const productData = {
            id: docSnap.id,
            ...docSnap.data(),
          } as Product
          setProduct(productData)
          
          // Track product view
          trackProductView(
            productData.id,
            productData.name,
            productData.itemCode || productData.id,
            "direct"
          )
          
          // Update meta tags for SEO
          document.title = productData.seo?.title || productData.name
          
          // Update meta description
          let metaDescription = document.querySelector('meta[name="description"]')
          if (!metaDescription) {
            metaDescription = document.createElement('meta')
            metaDescription.setAttribute('name', 'description')
            document.head.appendChild(metaDescription)
          }
          metaDescription.setAttribute('content', 
            productData.seo?.description || productData.description || productData.name
          )
          
          // Add JSON-LD structured data for product
          const existingScript = document.querySelector('script[data-jsonld="product"]')
          if (existingScript) {
            existingScript.remove()
          }
          
          const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: productData.name,
            description: productData.description || productData.name,
            sku: productData.itemCode,
            image: productData.featuredImage || productData.images?.[0],
            offers: {
              '@type': 'Offer',
              price: productData.price,
              priceCurrency: 'USD',
              availability: productData.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
          }
          
          const script = document.createElement('script')
          script.setAttribute('type', 'application/ld+json')
          script.setAttribute('data-jsonld', 'product')
          script.textContent = JSON.stringify(jsonLd)
          document.head.appendChild(script)
        } else {
          setProduct(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching product:", err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [productId])

  // Calculate price with variant adjustments
  const getFinalPrice = () => {
    if (!product) return 0
    let price = product.price
    
    // Apply variant price adjustments
    product.variants?.forEach(variant => {
      const selectedOption = variant.options.find(o => o.value === selectedVariants[variant.name])
      if (selectedOption?.priceAdjustment) {
        price += selectedOption.priceAdjustment
      }
    })
    
    return Math.max(0, price)
  }

  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: value }))
  }

  const handleAddToCart = () => {
    if (!product) return

    const finalPrice = getFinalPrice()
    const variantName = Object.entries(selectedVariants)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ")

    addItem({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      quantity,
      image: product.featuredImage || product.images?.[0] || "",
      maxStock: product.quantity,
      variant: variantName || undefined,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const incrementQty = () => {
    if (product && quantity < product.quantity) {
      setQuantity(q => q + 1)
    }
  }

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
        <p className="text-gray-500 mb-4">The product you're looking for doesn't exist.</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  const isOutOfStock = product.quantity === 0 || product.status === "out_of_stock"
  const images = product.images || []
  const hasImages = images.length > 0 || product.featuredImage
  const displayImages = product.featuredImage 
    ? [product.featuredImage, ...images.filter(img => img !== product.featuredImage)]
    : images

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <ShopHeader />

      {/* Product */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
              {displayImages[selectedImage] ? (
                <Image
                  src={displayImages[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-300" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.comparePrice && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded">
                    Sale
                  </span>
                )}
                {isOutOfStock && (
                  <span className="px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-gray-900' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-sm text-gray-500 mt-1">SKU: {product.itemCode}</p>
              
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${getFinalPrice().toFixed(2)}
                </span>
                {product.comparePrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.comparePrice.toFixed(2)}
                  </span>
                )}
                {product.comparePrice && (
                  <span className="text-sm text-green-600 font-medium">
                    Save ${(product.comparePrice - getFinalPrice()).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none text-gray-600">
              <p>{product.description}</p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {product.variants.map((variant) => (
                  <div key={variant.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {variant.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option) => {
                        const isSelected = selectedVariants[variant.name] === option.value
                        const priceDisplay = option.priceAdjustment 
                          ? option.priceAdjustment > 0 
                            ? `+$${option.priceAdjustment.toFixed(2)}`
                            : `-$${Math.abs(option.priceAdjustment).toFixed(2)}`
                          : ""
                        
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleVariantChange(variant.name, option.value)}
                            className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                              isSelected
                                ? 'border-gray-900 bg-gray-900 text-white'
                                : 'border-gray-300 hover:border-gray-400 text-gray-700'
                            }`}
                          >
                            {option.value}
                            {priceDisplay && (
                              <span className={`ml-1 text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                                {priceDisplay}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stock Status */}
            {!isOutOfStock && product.quantity <= product.lowStockThreshold && (
              <div className="text-yellow-600 font-medium">
                Only {product.quantity} left in stock - order soon!
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQty}
                    disabled={quantity <= 1}
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <Input
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
                    className="w-16 text-center border-0 focus-visible:ring-0"
                  />
                  <button
                    onClick={incrementQty}
                    disabled={quantity >= product.quantity}
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || added}
                  className="flex-1 h-14 text-lg"
                  size="lg"
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Added to Cart
                    </>
                  ) : isOutOfStock ? (
                    "Out of Stock"
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                
                <WishlistButton 
                  productId={productId}
                  variant="outline"
                  size="lg"
                  className="h-14 w-14"
                />
                
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 w-14"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Free shipping over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>In stock & ready to ship</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          <Reviews productId={productId} />
        </div>

        {/* Related Products */}
        {product && (
          <RelatedProducts 
            productId={productId}
            categoryIds={product.categoryIds}
          />
        )}
      </main>
    </div>
  )
}
