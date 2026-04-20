"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Plus, X, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NewServicePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "HardHat",
    order: 0,
    features: [] as string[],
  })
  const [newFeature, setNewFeature] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const now = new Date().toISOString()
      await addDoc(collection(db, "services"), {
        ...formData,
        createdAt: now,
        updatedAt: now,
      })
      router.push("/admin/services")
    } catch (err) {
      console.error("Error creating service:", err)
      alert("Failed to create service")
    } finally {
      setSaving(false)
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] })
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    })
  }

  return (
    <div className={cn("space-y-6 transition-all duration-500", mounted ? "opacity-100" : "opacity-0")}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/services">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#222222]">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30">
              <Briefcase className="h-5 w-5 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">New Service</h1>
          </div>
          <p className="text-gray-500 font-mono text-sm">// Add a new service offering</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-[#111111] border-[#222222]">
          <CardHeader>
            <CardTitle className="text-white">Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Residential Construction"
                required
                className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-amber-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Service description"
                rows={3}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-amber-500/50 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white focus:border-amber-500/50 focus:outline-none"
                  required
                >
                  <option value="HardHat">HardHat</option>
                  <option value="Building2">Building2</option>
                  <option value="Factory">Factory</option>
                  <option value="Paintbrush">Paintbrush</option>
                  <option value="Trees">Trees</option>
                  <option value="Wrench">Wrench</option>
                  <option value="Lightbulb">Lightbulb</option>
                </select>
                <p className="text-xs text-gray-600 font-mono">// Icon from Lucide</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Display Order</label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  required
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Features</label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature and press Enter"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-amber-500/50"
                />
                <Button 
                  type="button" 
                  onClick={addFeature} 
                  variant="outline"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-sm"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-amber-400 hover:text-red-400 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={saving} 
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-0 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Create Service"
            )}
          </Button>
          <Link href="/admin/services">
            <Button variant="outline" type="button" className="border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222] hover:border-[#444444]">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
