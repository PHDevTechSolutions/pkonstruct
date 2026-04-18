"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/admin/image-upload"
import { ArrowLeft, Loader2, Plus } from "lucide-react"

export default function NewProjectPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    year: new Date().getFullYear().toString(),
    status: "In Progress",
    image: "",
    featured: false,
    gallery: [] as string[],
    client: "",
    challenge: "",
    solution: "",
    results: [] as string[],
    stats: { duration: "", size: "", team: "", completed: "" },
    features: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const now = new Date().toISOString()
      await addDoc(collection(db, "projects"), {
        ...formData,
        createdAt: now,
        updatedAt: now,
      })
      router.push("/admin/projects")
    } catch (err) {
      console.error("Error creating project:", err)
      alert("Failed to create project")
    } finally {
      setSaving(false)
    }
  }

  const addGalleryImage = (url: string) => {
    setFormData({ ...formData, gallery: [...formData.gallery, url] })
  }

  const removeGalleryImage = (index: number) => {
    setFormData({
      ...formData,
      gallery: formData.gallery.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-stone-900">New Project</h2>
          <p className="text-stone-500">Add a new portfolio project</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter project title"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description"
                rows={4}
                className="w-full px-3 py-2 border rounded-md text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm"
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
                <label className="text-sm font-medium">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  required
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, State"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Input
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2024"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Main Image</label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                folder="pkonstruct/projects"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gallery Images</label>
              <div className="grid grid-cols-4 gap-2">
                {formData.gallery.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt="" className="w-full h-24 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="border-2 border-dashed border-stone-300 rounded h-24 flex items-center justify-center">
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
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-stone-300"
              />
              <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                Featured project
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Project Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Name</label>
              <Input
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g. Private Developer, ABC Corp"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <Input
                  value={formData.stats.duration}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    stats: { ...formData.stats, duration: e.target.value }
                  })}
                  placeholder="e.g. 18 months"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <Input
                  value={formData.stats.size}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    stats: { ...formData.stats, size: e.target.value }
                  })}
                  placeholder="e.g. 45,000 sq ft"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Team Size</label>
                <Input
                  value={formData.stats.team}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    stats: { ...formData.stats, team: e.target.value }
                  })}
                  placeholder="e.g. 35 workers"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Completed</label>
                <Input
                  value={formData.stats.completed}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    stats: { ...formData.stats, completed: e.target.value }
                  })}
                  placeholder="e.g. 2024"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Content Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">The Challenge</label>
              <textarea
                value={formData.challenge}
                onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                placeholder="Describe the project challenges and obstacles..."
                rows={3}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Our Solution</label>
              <textarea
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                placeholder="Describe how you solved the challenges..."
                rows={3}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Features</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a feature"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const input = e.target as HTMLInputElement
                      if (input.value.trim()) {
                        setFormData({
                          ...formData,
                          features: [...formData.features, input.value.trim()]
                        })
                        input.value = ""
                      }
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 rounded-full text-sm"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        features: formData.features.filter((_, i) => i !== index)
                      })}
                      className="text-stone-500 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Results</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a result/achievement"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const input = e.target as HTMLInputElement
                      if (input.value.trim()) {
                        setFormData({
                          ...formData,
                          results: [...formData.results, input.value.trim()]
                        })
                        input.value = ""
                      }
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.results.map((result, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    ✓ {result}
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        results: formData.results.filter((_, i) => i !== index)
                      })}
                      className="text-green-600 hover:text-red-600"
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
          <Button type="submit" disabled={saving} className="bg-amber-600 hover:bg-amber-700">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
          <Link href="/admin/projects">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
