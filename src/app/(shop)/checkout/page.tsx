"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { CreditCard, Smartphone, Building2, Truck, Check, Upload, Package } from "lucide-react"
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
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        shippingFee,
        discount: 0,
        total,
        status: "pending",
        paymentMethod: formData.paymentMethod as any,
        paymentStatus: "pending",
        ...(paymentProofUrl ? { paymentProof: paymentProofUrl } : {}),
        notes: formData.notes,
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-4">Add some products before checking out</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  // Order Complete
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-2">Thank you for your purchase</p>
        <p className="text-lg font-medium text-gray-900 mb-6">
          Order #{orderNumber}
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 max-w-md w-full mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Payment Instructions</h3>
          <p className="text-gray-600 text-sm mb-4">
            {formData.paymentMethod === "cod" 
              ? "Please prepare exact amount for cash on delivery."
              : "Please complete your payment to proceed with order processing."
            }
          </p>
          {formData.paymentMethod === "gcash" && (
            <div className="space-y-2 text-sm">
              <p className="font-medium">GCash Details:</p>
              <p>Number: 09123456789</p>
              <p>Name: PKonstruct Store</p>
            </div>
          )}
          {formData.paymentMethod === "bank_transfer" && (
            <div className="space-y-2 text-sm">
              <p className="font-medium">Bank Details:</p>
              <p>Bank: BDO</p>
              <p>Account: 1234567890</p>
              <p>Name: PKonstruct Inc.</p>
            </div>
          )}
        </div>
        
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ShopHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      required
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon
                    return (
                      <label
                        key={method.id}
                        className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.paymentMethod === method.id
                            ? 'border-cyan-500 bg-cyan-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="mt-1"
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{method.name}</p>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>

                {/* Payment Proof Upload (for non-COD) */}
                {formData.paymentMethod !== "cod" && (
                  <div className="mt-4">
                    <Label htmlFor="paymentProof">Payment Proof (Screenshot/Receipt)</Label>
                    <div className="mt-2">
                      <Input
                        id="paymentProof"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Upload screenshot of your payment for faster verification
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Special instructions for delivery..."
                  rows={3}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-3 mb-4 max-h-60 overflow-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400 absolute inset-0 m-auto" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Terms */}
                <div className="mt-4">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                      }
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
                  className="w-full mt-4 h-12 text-lg"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    `Place Order - $${total.toFixed(2)}`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
