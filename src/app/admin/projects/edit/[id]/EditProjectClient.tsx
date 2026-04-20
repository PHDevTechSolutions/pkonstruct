"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/admin/image-upload"
import { ArrowLeft, Loader2, FolderKanban, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  title: string
  description: string
  category: string
  location: string
  year: string
  status: string
  image: string
  featured: boolean
  gallery: string[]
  client?: string
  challenge?: string
  solution?: string
  results?: string[]
  stats?: {
    duration?: string
    size?: string
    team?: string
    completed?: string
  }
  features?: string[]
}

export default function EditProjectClient({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Project | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, "projects", id)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data() as Project
          setFormData({ 
            ...data, 
            id: docSnap.id, 
            gallery: data.gallery || [],
            featured: data.featured ?? false,
            client: data.client || "",
            challenge: data.challenge || "",
            solution: data.solution || "",
            results: data.results || [],
            stats: data.stats || { duration: "", size: "", team: "", completed: "" },
            features: data.features || [],
          })
        } else {
          alert("Project not found")
          router.push("/admin/projects")
        }
      } catch (err) {
        console.error("Error fetching project:", err)
        alert("Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setSaving(true)
    try {
      const docRef = doc(db, "projects", id)
      const now = new Date().toISOString()
      await updateDoc(docRef, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        year: formData.year,
        status: formData.status,
        image: formData.image,
        featured: formData.featured,
        gallery: formData.gallery,
        client: formData.client,
        challenge: formData.challenge,
        solution: formData.solution,
        results: formData.results,
        stats: formData.stats,
        features: formData.features,
        updatedAt: now,
      })
      router.push("/admin/projects")
    } catch (err) {
      console.error("Error updating project:", err)
      alert("Failed to update project")
    } finally {
      setSaving(false)
    }
  }

  const addGalleryImage = (url: string) => {
    if (!formData) return
    setFormData({ ...formData, gallery: [...(formData.gallery || []), url] })
  }

  const removeGalleryImage = (index: number) => {
    if (!formData) return
    setFormData({
      ...formData,
      gallery: formData.gallery.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="p-6 bg-[#111111] border border-red-500/30 rounded-xl text-red-400 font-mono">
        <Terminal className="h-5 w-5 inline mr-2" />
        Error: Project not found
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#222222]">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
              <FolderKanban className="h-5 w-5 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Edit Project</h1>
          </div>
          <p className="text-gray-500 font-mono text-sm">// Update portfolio project</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-[#111111] border-[#222222]">
          <CardHeader>
            <CardTitle className="text-white">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Project Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter project title"
                required
                className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-purple-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description"
                rows={4}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Renovation">Renovation</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none"
                  required
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, State"
                  required
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-purple-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Year</label>
                <Input
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2024"
                  required
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-purple-500/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Main Image</label>
              <div className="p-4 bg-[#1a1a1a] border border-[#333333] rounded-lg">
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  folder="pkonstruct/projects"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Gallery Images</label>
              <div className="grid grid-cols-4 gap-2">
                {(formData.gallery || []).map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt="" className="w-full h-24 object-cover rounded-lg border border-[#333333]" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500/80 text-white rounded-full text-xs hover:bg-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="border-2 border-dashed border-[#333333] rounded-lg h-24 flex items-center justify-center hover:border-purple-500/50 hover:bg-[#1a1a1a] transition-colors">
                  <ImageUpload
                    value=""
                    onChange={addGalleryImage}
                    folder="pkonstruct/projects"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={!!formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-[#333333] bg-[#1a1a1a] text-purple-500 focus:ring-purple-500/20"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-300 cursor-pointer">
                Featured project
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Project Details Section */}
        <Card className="bg-[#111111] border-[#222222]">
          <CardHeader>
            <CardTitle className="text-white">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Client Name</label>
              <Input
                value={formData.client || ""}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g. Private Developer, ABC Corp"
                className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-purple-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Duration</label>
                <Input
                  value={formData.stats?.duration || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    stats: { ...formData.stats, duration: e.target.value }
                  })}
                  placeholder="e.g. 18 months"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-purple-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Size</label>
                <Input
                  value={formData.stats?.size || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    stats: { ...formData.stats, size: e.target.value }
                  })}
                  placeholder="e.g. 45,000 sq ft"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-purple-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Team Size</label>
                <Input
                  value={formData.stats?.team || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    stats: { ...formData.stats, team: e.target.value }
                  })}
                  placeholder="e.g. 35 workers"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-purple-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Completed</label>
                <Input
                  value={formData.stats?.completed || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    stats: { ...formData.stats, completed: e.target.value }
                  })}
                  placeholder="e.g. 2024"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-purple-500/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <Card className="bg-[#111111] border-[#222222]">
          <CardHeader>
            <CardTitle className="text-white">Content Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">The Challenge</label>
              <textarea
                value={formData.challenge || ""}
                onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                placeholder="Describe the project challenges and obstacles..."
                rows={3}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Our Solution</label>
              <textarea
                value={formData.solution || ""}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                placeholder="Describe how you solved the challenges..."
                rows={3}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Project Features</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a feature and press Enter"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const input = e.target as HTMLInputElement
                      if (input.value.trim()) {
                        setFormData({
                          ...formData,
                          features: [...(formData.features || []), input.value.trim()]
                        })
                        input.value = ""
                      }
                    }
                  }}
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-purple-500/50"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.features || []).map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-sm"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        features: formData.features?.filter((_, i) => i !== index) || []
                      })}
                      className="text-purple-400 hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 font-mono">Project Results</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a result/achievement and press Enter"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const input = e.target as HTMLInputElement
                      if (input.value.trim()) {
                        setFormData({
                          ...formData,
                          results: [...(formData.results || []), input.value.trim()]
                        })
                        input.value = ""
                      }
                    }
                  }}
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-purple-500/50"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.results || []).map((result, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-sm"
                  >
                    ✓ {result}
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        results: formData.results?.filter((_, i) => i !== index) || []
                      })}
                      className="text-emerald-400 hover:text-red-400 transition-colors"
                    >
                      ×
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
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Update Project"
            )}
          </Button>
          <Link href="/admin/projects">
            <Button variant="outline" type="button" className="border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222] hover:border-[#444444]">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
