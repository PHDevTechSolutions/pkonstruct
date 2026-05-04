"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import { useCart } from "@/hooks/use-cart"
import { useAnalytics } from "@/hooks/use-analytics"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ShoppingCart, 
  ShoppingBag,
  Check, 
  ChevronLeft, 
  Minus, 
  Plus, 
  Package, 
  Share2, 
  ArrowLeft, 
  Heart, 
  Truck, 
  Shield,
  Zap,
  Clock,
  Store,
  Star,
  MessageCircle,
  ChevronRight
} from "lucide-react"
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-12 w-12 border-4 border-gray-900 border-t-transparent rounded-full" />
          <span className="text-gray-500">Loading product...</span>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/shop">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-sm px-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const isOutOfStock = product.quantity === 0 || product.status === "out_of_stock"
  const images = product.images || []
  const hasImages = images.length > 0 || product.featuredImage
  const displayImages = product.featuredImage 
    ? [product.featuredImage, ...images.filter(img => img !== product.featuredImage)]
    : images

  const discountPercent = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Black Theme Header */}
      <header className="bg-gray-900 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <Link href="/shop" className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>

            {/* Logo */}
            <Link href="/shop" className="flex items-center gap-2 text-white">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-gray-900" />
              </div>
              <span className="text-xl font-bold hidden sm:block">PKonstruct</span>
            </Link>

            {/* Product Name (truncated) */}
            <span className="text-white font-medium hidden md:block truncate max-w-md">
              {product.name}
            </span>
          </div>
        </div>
      </header>

      {/* Sale Banner */}
      {product.comparePrice && (
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="font-bold">Special Offer</span>
              <span className="text-sm bg-white/20 px-2 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>Limited Time</span>
            </div>
          </div>
        </div>
      )}

      {/* Product */}
      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/shop" className="hover:text-gray-900 transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 line-clamp-1">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Images - Shopee Style */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-sm p-4 shadow-sm"
          >
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 overflow-hidden relative mb-4">
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
              
              {/* Discount Badge */}
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded">
                  -{discountPercent}%
                </div>
              )}

              {/* Like Button */}
              <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
              </button>
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 flex-shrink-0 overflow-hidden border-2 transition-all ${
                      selectedImage === idx 
                        ? 'border-gray-900' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details - Shopee Style */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Title & SKU */}
            <div className="bg-white rounded-sm p-4 shadow-sm">
              <h1 className="text-lg font-medium text-gray-900 leading-snug">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 mt-2">SKU: {product.itemCode}</p>
            </div>

            {/* Price - Black Theme */}
            <div className="bg-white rounded-sm p-4 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-xs text-gray-900">₱</span>
                <span className="text-3xl font-bold text-gray-900">
                  {getFinalPrice().toLocaleString()}
                </span>
                {product.comparePrice && (
                  <span className="text-gray-400 line-through">
                    ₱{product.comparePrice.toLocaleString()}
                  </span>
                )}
              </div>
              
              {/* Shipping Info */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <Truck className="w-4 h-4" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Authentic Guarantee</span>
                </div>
              </div>
            </div>

            {/* Variants - Shopee Style */}
            {product.variants && product.variants.length > 0 && (
              <div className="bg-white rounded-sm p-4 shadow-sm space-y-4">
                {product.variants.map((variant) => (
                  <div key={variant.id}>
                    <label className="block text-sm text-gray-700 mb-2">
                      {variant.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option) => {
                        const isSelected = selectedVariants[variant.name] === option.value
                        
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleVariantChange(variant.name, option.value)}
                            className={`px-4 py-2 border text-sm rounded-sm transition-all ${
                              isSelected
                                ? 'border-gray-900 bg-gray-100 text-gray-900'
                                : 'border-gray-200 hover:border-gray-400 text-gray-700 bg-white'
                            }`}
                          >
                            {option.value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity - Shopee Style */}
            <div className="bg-white rounded-sm p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-sm">
                  <button
                    onClick={decrementQty}
                    disabled={quantity <= 1}
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQty}
                    disabled={quantity >= product.quantity}
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {!isOutOfStock && product.quantity <= product.lowStockThreshold && (
                <p className="text-xs text-gray-600 mt-2">
                  Only {product.quantity} left in stock
                </p>
              )}
            </div>

            {/* Add to Cart - Black Theme */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || added}
                className={`flex-1 h-12 text-base font-semibold rounded-sm transition-all ${
                  added 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added
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
              
              <Button
                variant="outline"
                className="h-12 px-4 rounded-sm border-2 border-gray-900 text-gray-900 hover:bg-gray-100"
              >
                <Heart className="w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                className="h-12 px-4 rounded-sm border-gray-300 hover:bg-gray-50"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Store Info - Black Theme */}
            <div className="bg-white rounded-sm p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Store className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">PKonstruct Official Store</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      4.9
                    </span>
                    <span>|</span>
                    <span>98% Response Rate</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-gray-900 border-gray-900 hover:bg-gray-100">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-sm p-4 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Product Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section - Black Theme */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 bg-white rounded-sm p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <h2 className="font-medium text-gray-900">Customer Reviews</h2>
            <span className="text-gray-900 font-semibold text-sm">(4.9)</span>
          </div>
          <Reviews productId={productId} />
        </motion.div>

        {/* Related Products - Black Theme */}
        {product && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-gray-900">You May Also Like</h2>
              <Link href="/shop" className="text-sm text-gray-900 font-semibold flex items-center gap-1">
                See All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <RelatedProducts 
              productId={productId}
              categoryIds={product.categoryIds}
            />
          </div>
        )}
      </main>
    </div>
  )
}
