"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Mail, Phone, MapPin, Save } from "lucide-react"

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
    postalCode: "",
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
      postalCode: newAddress.postalCode,
      isDefault: newAddress.isDefault,
    })
    setNewAddress({
      label: "",
      street: "",
      city: "",
      postalCode: "",
      isDefault: false,
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input value={user?.email || ""} disabled />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>

          <Button 
            onClick={handleUpdateProfile} 
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Saved Addresses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Addresses */}
          {profile?.addresses?.map((address, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{address.label}</span>
                {address.isDefault && (
                  <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{address.street}</p>
              <p className="text-sm text-gray-600">
                {address.city}, {address.postalCode}
              </p>
            </div>
          ))}

          {/* Add New Address */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Add New Address</h3>
            <div className="space-y-3">
              <Input
                placeholder="Address Label (e.g., Home, Office)"
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
              />
              <Input
                placeholder="Street Address"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                />
                <Input
                  placeholder="Postal Code"
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Set as default address</span>
              </label>
              <Button 
                onClick={handleAddAddress} 
                disabled={loading || !newAddress.street || !newAddress.city}
                variant="outline"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <MapPin className="w-4 h-4 mr-2" />
                )}
                Add Address
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
