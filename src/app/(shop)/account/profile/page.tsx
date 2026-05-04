"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Mail, Phone, MapPin, Save, Sparkles, Home, Building, CheckCircle2 } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const { profile, updateProfile, addAddress, loading } = useUserProfile()
  
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    phone: profile?.phone || "",
  })

  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "",
    zipCode: "",
    isDefault: false,
  })

  const handleUpdateProfile = async () => {
    await updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    })
  }

  const handleAddAddress = async () => {
    await addAddress({
      label: newAddress.label || "Home",
      street: newAddress.street,
      city: newAddress.city,
      state: "",
      zipCode: newAddress.zipCode,
      country: "Philippines",
      isDefault: newAddress.isDefault,
    })
    setNewAddress({
      label: "",
      street: "",
      city: "",
      zipCode: "",
      isDefault: false,
    })
  }

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <User className="w-5 h-5 text-white" />
              </div>
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">First Name</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter first name"
                  className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Last Name</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter last name"
                  className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700 font-medium">
                <Mail className="w-4 h-4 text-blue-500" />
                Email
              </Label>
              <Input 
                value={user?.email || ""} 
                disabled 
                className="h-12 bg-gray-100 border-gray-200 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700 font-medium">
                <Phone className="w-4 h-4 text-blue-500" />
                Phone Number
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
                className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <Button 
              onClick={handleUpdateProfile} 
              disabled={loading}
              className="h-12 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 rounded-xl font-semibold"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Addresses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              Saved Addresses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {/* Existing Addresses */}
            {profile?.addresses?.map((address, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {address.label?.toLowerCase().includes('home') ? (
                      <Home className="w-4 h-4 text-blue-500" />
                    ) : address.label?.toLowerCase().includes('office') ? (
                      <Building className="w-4 h-4 text-purple-500" />
                    ) : (
                      <MapPin className="w-4 h-4 text-green-500" />
                    )}
                    <span className="font-bold text-gray-900">{address.label}</span>
                  </div>
                  {address.isDefault && (
                    <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-medium">{address.street}</p>
                <p className="text-sm text-gray-500">
                  {address.city}, {address.zipCode}
                </p>
              </motion.div>
            ))}

            {/* Add New Address */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Add New Address
              </h3>
              <div className="space-y-3">
                <Input
                  placeholder="Address Label (e.g., Home, Office)"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                />
                <Input
                  placeholder="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Input
                    placeholder="ZIP Code"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Set as default address</span>
                </label>
                <Button 
                  onClick={handleAddAddress} 
                  disabled={loading || !newAddress.street || !newAddress.city}
                  variant="outline"
                  className="w-full h-12 border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl font-semibold transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <MapPin className="w-5 h-5 mr-2" />
                  )}
                  Add Address
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
