"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Truck, Package, DollarSign, MapPin } from "lucide-react"
import type { ShippingSettings } from "@/types/shop"

const DEFAULT_SETTINGS: ShippingSettings = {
  freeShippingThreshold: 50,
  defaultShippingFee: 10,
  expressShippingFee: 20,
  calculateByWeight: false,
  weightRates: [
    { maxWeight: 1, rate: 5 },
    { maxWeight: 5, rate: 10 },
    { maxWeight: 10, rate: 15 },
  ],
}

export default function ShopSettingsPage() {
  const [settings, setSettings] = useState<ShippingSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      const docRef = doc(db, "shop_settings", "shipping")
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() })
      }
      setLoading(false)
    }
    loadSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, "shop_settings", "shipping"), {
        ...settings,
        updatedAt: serverTimestamp(),
      })
      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const updateField = <K extends keyof ShippingSettings>(field: K, value: ShippingSettings[K]) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Shop Settings</h1>
        <p className="text-gray-400 mt-1">Configure shipping rates and shop policies</p>
      </div>

      {/* Shipping Settings */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Truck className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Shipping Settings</h2>
        </div>

        {/* Free Shipping Threshold */}
        <div className="space-y-2">
          <Label htmlFor="freeShipping" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Free Shipping Threshold
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <Input
              id="freeShipping"
              type="number"
              min="0"
              step="0.01"
              value={settings.freeShippingThreshold}
              onChange={(e) => updateField("freeShippingThreshold", parseFloat(e.target.value) || 0)}
              className="bg-[#222] border-[#333] text-white pl-8"
            />
          </div>
          <p className="text-sm text-gray-500">
            Orders above this amount get free shipping. Set to 0 to disable free shipping.
          </p>
        </div>

        {/* Default Shipping Fee */}
        <div className="space-y-2">
          <Label htmlFor="defaultShipping" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Default Shipping Fee
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <Input
              id="defaultShipping"
              type="number"
              min="0"
              step="0.01"
              value={settings.defaultShippingFee}
              onChange={(e) => updateField("defaultShippingFee", parseFloat(e.target.value) || 0)}
              className="bg-[#222] border-[#333] text-white pl-8"
            />
          </div>
        </div>

        {/* Express Shipping */}
        <div className="space-y-2">
          <Label htmlFor="expressShipping" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Express Shipping Fee
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <Input
              id="expressShipping"
              type="number"
              min="0"
              step="0.01"
              value={settings.expressShippingFee || ""}
              onChange={(e) => updateField("expressShippingFee", e.target.value ? parseFloat(e.target.value) : undefined)}
              className="bg-[#222] border-[#333] text-white pl-8"
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Weight-Based Shipping */}
        <div className="pt-4 border-t border-[#333]">
          <div className="flex items-center justify-between mb-4">
            <Label className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Calculate by Weight
            </Label>
            <Switch
              checked={settings.calculateByWeight || false}
              onCheckedChange={(checked) => updateField("calculateByWeight", checked)}
            />
          </div>

          {settings.calculateByWeight && (
            <div className="space-y-3 pl-6">
              <p className="text-sm text-gray-500 mb-2">Weight-based rates (kg)</p>
              {settings.weightRates?.map((rate, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">Up to</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={rate.maxWeight}
                    onChange={(e) => {
                      const updated = [...(settings.weightRates || [])]
                      updated[index].maxWeight = parseFloat(e.target.value) || 0
                      updateField("weightRates", updated)
                    }}
                    className="w-24 bg-[#222] border-[#333] text-white"
                  />
                  <span className="text-gray-400 text-sm">kg = $</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={rate.rate}
                    onChange={(e) => {
                      const updated = [...(settings.weightRates || [])]
                      updated[index].rate = parseFloat(e.target.value) || 0
                      updateField("weightRates", updated)
                    }}
                    className="w-24 bg-[#222] border-[#333] text-white"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updated = (settings.weightRates || []).filter((_, i) => i !== index)
                      updateField("weightRates", updated)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const updated = [...(settings.weightRates || [])]
                  updated.push({ maxWeight: 1, rate: 5 })
                  updateField("weightRates", updated)
                }}
              >
                Add Weight Tier
              </Button>
            </div>
          )}
        </div>

        {/* Shipping Zones */}
        <div className="pt-4 border-t border-[#333]">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4" />
            <Label>Shipping Zones</Label>
          </div>
          
          <div className="space-y-3">
            {settings.zones?.map((zone, index) => (
              <div key={index} className="bg-[#222] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Zone name (e.g., Metro Manila)"
                    value={zone.name}
                    onChange={(e) => {
                      const updated = [...(settings.zones || [])]
                      updated[index].name = e.target.value
                      updateField("zones", updated)
                    }}
                    className="flex-1 bg-[#1a1a1a] border-[#333] text-white"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Rate"
                      value={zone.rate}
                      onChange={(e) => {
                        const updated = [...(settings.zones || [])]
                        updated[index].rate = parseFloat(e.target.value) || 0
                        updateField("zones", updated)
                      }}
                      className="w-28 bg-[#1a1a1a] border-[#333] text-white pl-8"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updated = (settings.zones || []).filter((_, i) => i !== index)
                      updateField("zones", updated)
                    }}
                  >
                    Remove
                  </Button>
                </div>
                <Input
                  placeholder="Cities/Regions (comma separated)"
                  value={zone.regions.join(", ")}
                  onChange={(e) => {
                    const updated = [...(settings.zones || [])]
                    updated[index].regions = e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    updateField("zones", updated)
                  }}
                  className="bg-[#1a1a1a] border-[#333] text-white"
                />
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const updated = [...(settings.zones || [])]
                updated.push({ name: "", regions: [], rate: 0 })
                updateField("zones", updated)
              }}
            >
              Add Shipping Zone
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          {saving ? (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Settings
        </Button>
      </div>
    </div>
  )
}
