"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, ShoppingBag, Phone } from "lucide-react"

export default function ShopRegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { register } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/shop"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (!agreeTerms) {
      setError("Please agree to the terms and conditions")
      setLoading(false)
      return
    }

    try {
      await register(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: "customer",
      })
      router.push(redirectTo)
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/shop" className="flex items-center gap-2 text-gray-900 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Shop</span>
          </Link>
          <Link href="/shop" className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-cyan-600" />
            <span className="text-xl font-bold">PKonstruct</span>
          </Link>
        </div>
      </header>

      {/* Register Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Sign up to start shopping and track your orders
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className="pl-10 pr-10"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  required
                />
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-none cursor-pointer">
                  I agree to the{" "}
                  <Link href="/terms" className="text-cyan-600 hover:text-cyan-700">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-cyan-600 hover:text-cyan-700">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <Link 
                href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
                className="text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
