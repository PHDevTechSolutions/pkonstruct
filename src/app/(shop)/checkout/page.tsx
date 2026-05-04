"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useCart } from "@/hooks/use-cart"
import { useOrders } from "@/hooks/use-orders"
import { ShopHeader } from "@/components/shop/shop-header"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { checkoutRateLimiter } from "@/lib/rate-limiter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Smartphone, Building2, Truck, Check, Upload, Package, Sparkles, ArrowLeft, ShoppingBag, Shield, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const PAYMENT_METHODS = [
  { id: "gcash", name: "GCash", icon: Smartphone, description: "Pay via GCash wallet transfer" },
  { id: "maya", name: "Maya", icon: CreditCard, description: "Pay via Maya wallet" },
  { id: "bank_transfer", name: "Bank Transfer", icon: Building2, description: "Direct bank deposit/transfer" },
  { id: "cod", name: "Cash on Delivery", icon: Truck, description: "Pay when you receive" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, totalItems, shippingFee, total, clearCart } = useCart()
  const { createOrder } = useOrders()
  
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping")
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "gcash",
    paymentProof: null as File | null,
    notes: "",
    agreeToTerms: false,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, paymentProof: file }))
  }

  const handleSubmit = async () => {
    if (items.length === 0) return
    
    // Check rate limit
    const rateCheck = checkoutRateLimiter.check(`checkout:${formData.email}`, 3, 5 * 60 * 1000)
    if (!rateCheck.allowed) {
      alert(`Too many order attempts. Please try again in ${rateCheck.retryAfter} seconds.`)
      return
    }
    
    setLoading(true)

    try {
      // Upload payment proof if exists
      let paymentProofUrl = ""
      if (formData.paymentProof) {
        const storageRef = ref(storage, `payment-proofs/${Date.now()}-${formData.paymentProof.name}`)
        await uploadBytes(storageRef, formData.paymentProof)
        paymentProofUrl = await getDownloadURL(storageRef)
      }

      // Clean items to remove undefined values (Firebase doesn't accept undefined)
      const cleanItems = items.map(item => {
        const cleanItem: any = {
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }
        // Only add optional fields if they exist
        if (item.image) cleanItem.image = item.image
        if (item.variant) cleanItem.variant = item.variant
        return cleanItem
      })

      // Create order
      const result = await createOrder({
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        items: cleanItems,
        subtotal,
        shippingFee,
        discount: 0,
        total,
        status: "pending",
        paymentMethod: formData.paymentMethod as any,
        paymentStatus: "pending",
        ...(paymentProofUrl ? { paymentProof: paymentProofUrl } : {}),
        notes: formData.notes || "",
      })

      if (result.success && result.id) {
        clearCart()
        // Redirect to order confirmation page
        router.push(`/order-confirmation/${result.id}`)
      } else {
        alert("Error creating order: " + result.error)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to complete checkout. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Redirect if cart is empty (and not complete)
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add some products before checking out</p>
          <Link href="/shop">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  // Order Complete
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/25">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-2">Thank you for your purchase</p>
          <p className="text-lg font-medium text-blue-600 mb-6">
            Order #{orderNumber}
          </p>
          
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 max-w-md w-full mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-gray-900">Payment Instructions</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              {formData.paymentMethod === "cod" 
                ? "Please prepare exact amount for cash on delivery."
                : "Please complete your payment to proceed with order processing."
              }
            </p>
            {formData.paymentMethod === "gcash" && (
              <div className="space-y-2 text-sm bg-blue-50 p-4 rounded-xl">
                <p className="font-semibold text-blue-900">GCash Details:</p>
                <p className="text-blue-700">Number: 09123456789</p>
                <p className="text-blue-700">Name: PKonstruct Store</p>
              </div>
            )}
            {formData.paymentMethod === "bank_transfer" && (
              <div className="space-y-2 text-sm bg-blue-50 p-4 rounded-xl">
                <p className="font-semibold text-blue-900">Bank Details:</p>
                <p className="text-blue-700">Bank: BDO</p>
                <p className="text-blue-700">Account: 1234567890</p>
                <p className="text-blue-700">Name: PKonstruct Inc.</p>
              </div>
            )}
          </div>
          
          <Link href="/shop">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 rounded-xl">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>
      
      {/* Header */}
      <ShopHeader />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Modern Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-4 py-2 mb-4">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-semibold">Secure Checkout</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Shipping Information</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 mt-1"
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="address" className="text-gray-700 font-medium">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 mt-1"
                      required
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city" className="text-gray-700 font-medium">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="postalCode" className="text-gray-700 font-medium">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 mt-1"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon
                    return (
                      <label
                        key={method.id}
                        className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.paymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10'
                            : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="mt-1.5 w-4 h-4 text-blue-600"
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            formData.paymentMethod === method.id
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                              : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              formData.paymentMethod === method.id ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{method.name}</p>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>

                {/* Payment Proof Upload (for non-COD) */}
                {formData.paymentMethod !== "cod" && (
                  <div className="mt-6">
                    <Label htmlFor="paymentProof" className="text-gray-700 font-medium">Payment Proof (Screenshot/Receipt)</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50/50 rounded-xl transition-all p-4">
                      <Input
                        id="paymentProof"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer border-0 bg-transparent"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Upload screenshot of your payment for faster verification
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Additional Notes */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6"
              >
                <Label htmlFor="notes" className="text-gray-700 font-medium">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Special instructions for delivery..."
                  className="bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 mt-2"
                  rows={3}
                />
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                </div>
                
                {/* Items */}
                <div className="space-y-3 mb-4 max-h-60 overflow-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-blue-600">
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-medium">₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium">{shippingFee === 0 ? "Free" : `₱${shippingFee.toFixed(2)}`}</span>
                  </div>
                  {shippingFee === 0 && subtotal > 0 && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                      <Sparkles className="w-4 h-4" />
                      <span>You got free shipping!</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-blue-600">₱{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Terms */}
                <div className="mt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                      }
                      className="mt-0.5 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the terms and conditions
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <Button
                  onClick={handleSubmit}
                  disabled={
                    loading || 
                    !formData.name || 
                    !formData.email || 
                    !formData.phone || 
                    !formData.address ||
                    !formData.agreeToTerms
                  }
                  className="w-full mt-4 h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 rounded-xl transition-all"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    `Place Order - ₱${total.toFixed(2)}`
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
