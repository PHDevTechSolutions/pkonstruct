"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react"

interface ContentEditorProps {
  type: string
  content: string
  onChange: (content: string) => void
}

// Gallery Editor
function GalleryEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [images, setImages] = useState<string[]>([])
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "[]")
      setImages(Array.isArray(parsed) ? parsed : [])
    } catch {
      setImages([])
    }
  }, [content])
  
  const updateImages = (newImages: string[]) => {
    setImages(newImages)
    onChange(JSON.stringify(newImages, null, 2))
  }
  
  const addImage = () => {
    updateImages([...images, ""])
  }
  
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    updateImages(newImages)
  }
  
  const updateImage = (index: number, url: string) => {
    const newImages = images.map((img, i) => i === index ? url : img)
    updateImages(newImages)
  }
  
  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === images.length - 1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newImages = [...images]
    const [moved] = newImages.splice(index, 1)
    newImages.splice(newIndex, 0, moved)
    updateImages(newImages)
  }
  
  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-500 mb-2 font-mono">// Add image URLs for the gallery</div>
      {images.map((url, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex flex-col gap-0.5">
            <Button variant="ghost" size="sm" onClick={() => moveImage(index, 'up')} disabled={index === 0} className="h-5 w-5 p-0 text-gray-400 hover:text-white hover:bg-[#222222]">
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => moveImage(index, 'down')} disabled={index === images.length - 1} className="h-5 w-5 p-0 text-gray-400 hover:text-white hover:bg-[#222222]">
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
          <div className="w-12 h-12 bg-[#222222] rounded overflow-hidden flex-shrink-0 border border-[#333333]">
            {url && <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />}
          </div>
          <Input 
            value={url} 
            onChange={(e) => updateImage(index, e.target.value)} 
            placeholder={`Image ${index + 1} URL`}
            className="flex-1 h-9 text-sm bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
          />
          <Button variant="ghost" size="sm" onClick={() => removeImage(index)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button onClick={addImage} variant="outline" size="sm" className="w-full border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222] hover:border-[#444444]">
        <Plus className="h-4 w-4 mr-1" />
        Add Image
      </Button>
    </div>
  )
}

// Before/After Editor
function BeforeAfterEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [data, setData] = useState({
    title: "",
    description: "",
    beforeImage: "",
    afterImage: ""
  })
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "{}")
      setData({
        title: parsed.title || "",
        description: parsed.description || "",
        beforeImage: parsed.beforeImage || "",
        afterImage: parsed.afterImage || ""
      })
    } catch {
      // Keep defaults
    }
  }, [content])
  
  const updateField = (field: string, value: string) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    onChange(JSON.stringify(newData, null, 2))
  }
  
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-400 font-mono">Title</label>
        <Input value={data.title} onChange={(e) => updateField('title', e.target.value)} placeholder="e.g., Kitchen Renovation" className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-400 font-mono">Description</label>
        <Input value={data.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Brief description" className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 font-mono">Before Image URL</label>
          <Input value={data.beforeImage} onChange={(e) => updateField('beforeImage', e.target.value)} placeholder="https://..." className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono" />
          {data.beforeImage && (
            <div className="h-20 bg-[#222222] rounded overflow-hidden border border-[#333333]">
              <img src={data.beforeImage} alt="Before" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 font-mono">After Image URL</label>
          <Input value={data.afterImage} onChange={(e) => updateField('afterImage', e.target.value)} placeholder="https://..." className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono" />
          {data.afterImage && (
            <div className="h-20 bg-[#222222] rounded overflow-hidden border border-[#333333]">
              <img src={data.afterImage} alt="After" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Pricing Editor
function PricingEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [plans, setPlans] = useState<any[]>([])
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "[]")
      setPlans(Array.isArray(parsed) ? parsed : [])
    } catch {
      setPlans([
        { id: "1", name: "Basic", price: "₱50,000", period: "starting", description: "", features: ["Feature 1"], buttonText: "Get Started" },
        { id: "2", name: "Professional", price: "₱150,000", period: "starting", description: "", features: ["Feature 1", "Feature 2"], isPopular: true, buttonText: "Most Popular" }
      ])
    }
  }, [content])
  
  const updatePlans = (newPlans: any[]) => {
    setPlans(newPlans)
    onChange(JSON.stringify(newPlans, null, 2))
  }
  
  const addPlan = () => {
    const newPlan = { 
      id: Date.now().toString(), 
      name: "New Plan", 
      price: "", 
      period: "", 
      description: "", 
      features: [""], 
      buttonText: "Select" 
    }
    updatePlans([...plans, newPlan])
  }
  
  const removePlan = (index: number) => {
    updatePlans(plans.filter((_, i) => i !== index))
  }
  
  const updatePlan = (index: number, field: string, value: any) => {
    const newPlans = plans.map((plan, i) => i === index ? { ...plan, [field]: value } : plan)
    updatePlans(newPlans)
  }
  
  const addFeature = (planIndex: number) => {
    const newPlans = plans.map((plan, i) => 
      i === planIndex ? { ...plan, features: [...plan.features, ""] } : plan
    )
    updatePlans(newPlans)
  }
  
  const updateFeature = (planIndex: number, featureIndex: number, value: string) => {
    const newPlans = plans.map((plan, i) => 
      i === planIndex ? { 
        ...plan, 
        features: plan.features.map((f: string, fi: number) => fi === featureIndex ? value : f) 
      } : plan
    )
    updatePlans(newPlans)
  }
  
  const removeFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = plans.map((plan, i) => 
      i === planIndex ? { ...plan, features: plan.features.filter((_: string, fi: number) => fi !== featureIndex) } : plan
    )
    updatePlans(newPlans)
  }
  
  return (
    <div className="space-y-3">
      {plans.map((plan, planIndex) => (
        <div key={plan.id} className="border border-[#333333] rounded-lg p-3 bg-[#1a1a1a]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-300">Plan {planIndex + 1}</span>
            <Button variant="ghost" size="sm" onClick={() => removePlan(planIndex)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-6 w-6 p-0">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Input value={plan.name} onChange={(e) => updatePlan(planIndex, 'name', e.target.value)} placeholder="Plan Name" className="h-8 text-sm bg-[#222222] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50" />
            <Input value={plan.price} onChange={(e) => updatePlan(planIndex, 'price', e.target.value)} placeholder="Price (e.g., ₱50,000)" className="h-8 text-sm bg-[#222222] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50" />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Input value={plan.period} onChange={(e) => updatePlan(planIndex, 'period', e.target.value)} placeholder="Period (e.g., per month)" className="h-8 text-sm bg-[#222222] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50" />
            <Input value={plan.buttonText} onChange={(e) => updatePlan(planIndex, 'buttonText', e.target.value)} placeholder="Button Text" className="h-8 text-sm bg-[#222222] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-mono">Features:</span>
            {plan.features?.map((feature: string, featureIndex: number) => (
              <div key={featureIndex} className="flex items-center gap-1">
                <Input value={feature} onChange={(e) => updateFeature(planIndex, featureIndex, e.target.value)} placeholder={`Feature ${featureIndex + 1}`} className="h-7 text-sm flex-1 bg-[#222222] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50" />
                <Button variant="ghost" size="sm" onClick={() => removeFeature(planIndex, featureIndex)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-6 w-6 p-0">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button onClick={() => addFeature(planIndex)} variant="outline" size="sm" className="w-full h-7 text-xs border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222] hover:border-[#444444]">
              <Plus className="h-3 w-3 mr-1" /> Add Feature
            </Button>
          </div>
        </div>
      ))}
      <Button onClick={addPlan} variant="outline" size="sm" className="w-full border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222] hover:border-[#444444]">
        <Plus className="h-4 w-4 mr-1" /> Add Pricing Plan
      </Button>
    </div>
  )
}

// Process/Timeline Editor
function ProcessEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [steps, setSteps] = useState<any[]>([])
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "[]")
      setSteps(Array.isArray(parsed) ? parsed : [])
    } catch {
      setSteps([
        { id: "1", title: "Step 1", description: "", duration: "" },
        { id: "2", title: "Step 2", description: "", duration: "" },
        { id: "3", title: "Step 3", description: "", duration: "" }
      ])
    }
  }, [content])
  
  const updateSteps = (newSteps: any[]) => {
    setSteps(newSteps)
    onChange(JSON.stringify(newSteps, null, 2))
  }
  
  const addStep = () => {
    const newStep = { id: Date.now().toString(), title: "", description: "", duration: "" }
    updateSteps([...steps, newStep])
  }
  
  const removeStep = (index: number) => {
    updateSteps(steps.filter((_, i) => i !== index))
  }
  
  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = steps.map((step, i) => i === index ? { ...step, [field]: value } : step)
    updateSteps(newSteps)
  }
  
  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === steps.length - 1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newSteps = [...steps]
    const [moved] = newSteps.splice(index, 1)
    newSteps.splice(newIndex, 0, moved)
    updateSteps(newSteps)
  }
  
  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-500 mb-2 font-mono">// Process Steps</div>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start gap-2 border border-[#333333] rounded-lg p-2 bg-[#1a1a1a]">
          <div className="flex flex-col gap-0.5">
            <Button variant="ghost" size="sm" onClick={() => moveStep(index, 'up')} disabled={index === 0} className="h-5 w-5 p-0 text-gray-400 hover:text-white hover:bg-[#222222]">
              <ChevronUp className="h-3 w-3" />
            </Button>
            <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>
            <Button variant="ghost" size="sm" onClick={() => moveStep(index, 'down')} disabled={index === steps.length - 1} className="h-5 w-5 p-0 text-gray-400 hover:text-white hover:bg-[#222222]">
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex-1 space-y-1">
            <Input value={step.title} onChange={(e) => updateStep(index, 'title', e.target.value)} placeholder="Step Title" className="h-8 text-sm bg-[#222222] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50" />
            <Input value={step.description} onChange={(e) => updateStep(index, 'description', e.target.value)} placeholder="Description" className="h-8 text-sm bg-[#222222] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50" />
            <Input value={step.duration} onChange={(e) => updateStep(index, 'duration', e.target.value)} placeholder="Duration (e.g., 1-2 weeks)" className="h-8 text-sm bg-[#222222] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50" />
          </div>
          <Button variant="ghost" size="sm" onClick={() => removeStep(index)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-6 w-6 p-0">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button onClick={addStep} variant="outline" size="sm" className="w-full border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222] hover:border-[#444444]">
        <Plus className="h-4 w-4 mr-1" /> Add Step
      </Button>
    </div>
  )
}

// Location Editor
function LocationEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [data, setData] = useState({
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    hours: "",
    mapUrl: "",
    directionsUrl: ""
  })
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "{}")
      setData({
        address: parsed.address || "",
        city: parsed.city || "",
        country: parsed.country || "",
        phone: parsed.phone || "",
        email: parsed.email || "",
        hours: parsed.hours || "",
        mapUrl: parsed.mapUrl || "",
        directionsUrl: parsed.directionsUrl || ""
      })
    } catch {
      // Keep defaults
    }
  }, [content])
  
  const updateField = (field: string, value: string) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    onChange(JSON.stringify(newData, null, 2))
  }
  
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Input value={data.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Street Address" className="h-9 text-sm" />
        <Input value={data.city} onChange={(e) => updateField('city', e.target.value)} placeholder="City" className="h-9 text-sm" />
      </div>
      <Input value={data.country} onChange={(e) => updateField('country', e.target.value)} placeholder="Country" className="h-9 text-sm" />
      <div className="grid grid-cols-2 gap-2">
        <Input value={data.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="Phone" className="h-9 text-sm" />
        <Input value={data.email} onChange={(e) => updateField('email', e.target.value)} placeholder="Email" className="h-9 text-sm" />
      </div>
      <Input value={data.hours} onChange={(e) => updateField('hours', e.target.value)} placeholder="Business Hours (e.g., Mon-Fri 9AM-6PM)" className="h-9 text-sm" />
      <div className="space-y-1">
        <label className="text-xs text-stone-500">Google Maps Embed URL (optional)</label>
        <Input value={data.mapUrl} onChange={(e) => updateField('mapUrl', e.target.value)} placeholder="https://www.google.com/maps/embed..." className="h-9 text-sm" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-stone-500">Directions URL (optional)</label>
        <Input value={data.directionsUrl} onChange={(e) => updateField('directionsUrl', e.target.value)} placeholder="https://maps.google.com/directions..." className="h-9 text-sm" />
      </div>
    </div>
  )
}

// Downloads Editor
function DownloadsEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [files, setFiles] = useState<any[]>([])
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "[]")
      setFiles(Array.isArray(parsed) ? parsed : [])
    } catch {
      setFiles([])
    }
  }, [content])
  
  const updateFiles = (newFiles: any[]) => {
    setFiles(newFiles)
    onChange(JSON.stringify(newFiles, null, 2))
  }
  
  const addFile = () => {
    const newFile = { id: Date.now().toString(), title: "", description: "", fileUrl: "", fileType: "pdf", fileSize: "" }
    updateFiles([...files, newFile])
  }
  
  const removeFile = (index: number) => {
    updateFiles(files.filter((_, i) => i !== index))
  }
  
  const updateFile = (index: number, field: string, value: string) => {
    const newFiles = files.map((file, i) => i === index ? { ...file, [field]: value } : file)
    updateFiles(newFiles)
  }
  
  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <div key={file.id} className="border rounded p-3 bg-stone-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">File {index + 1}</span>
            <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="text-red-500 h-6 w-6 p-0">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-2">
            <Input value={file.title} onChange={(e) => updateFile(index, 'title', e.target.value)} placeholder="File Title" className="h-8 text-sm" />
            <Input value={file.description} onChange={(e) => updateFile(index, 'description', e.target.value)} placeholder="Description" className="h-8 text-sm" />
            <Input value={file.fileUrl} onChange={(e) => updateFile(index, 'fileUrl', e.target.value)} placeholder="File URL (https://...)" className="h-8 text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <select 
                value={file.fileType} 
                onChange={(e) => updateFile(index, 'fileType', e.target.value)}
                className="h-8 text-sm border rounded px-2"
              >
                <option value="pdf">PDF</option>
                <option value="doc">Word</option>
                <option value="image">Image</option>
                <option value="spreadsheet">Spreadsheet</option>
              </select>
              <Input value={file.fileSize} onChange={(e) => updateFile(index, 'fileSize', e.target.value)} placeholder="Size (e.g., 2.5 MB)" className="h-8 text-sm" />
            </div>
          </div>
        </div>
      ))}
      <Button onClick={addFile} variant="outline" size="sm" className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Add File
      </Button>
    </div>
  )
}

// Social Links Editor
function SocialLinksEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [links, setLinks] = useState<any[]>([])
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "[]")
      setLinks(Array.isArray(parsed) ? parsed : [])
    } catch {
      setLinks([
        { id: "1", platform: "facebook", url: "#", label: "Facebook" },
        { id: "2", platform: "instagram", url: "#", label: "Instagram" },
        { id: "3", platform: "linkedin", url: "#", label: "LinkedIn" }
      ])
    }
  }, [content])
  
  const updateLinks = (newLinks: any[]) => {
    setLinks(newLinks)
    onChange(JSON.stringify(newLinks, null, 2))
  }
  
  const addLink = () => {
    const newLink = { id: Date.now().toString(), platform: "website", url: "", label: "Link" }
    updateLinks([...links, newLink])
  }
  
  const removeLink = (index: number) => {
    updateLinks(links.filter((_, i) => i !== index))
  }
  
  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = links.map((link, i) => i === index ? { ...link, [field]: value } : link)
    updateLinks(newLinks)
  }
  
  const platforms = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "youtube", label: "YouTube" },
    { value: "website", label: "Website" }
  ]
  
  return (
    <div className="space-y-2">
      {links.map((link, index) => (
        <div key={link.id} className="flex items-center gap-2">
          <select 
            value={link.platform} 
            onChange={(e) => updateLink(index, 'platform', e.target.value)}
            className="h-9 text-sm border rounded px-2 w-28"
          >
            {platforms.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <Input value={link.label} onChange={(e) => updateLink(index, 'label', e.target.value)} placeholder="Label" className="h-9 text-sm flex-1" />
          <Input value={link.url} onChange={(e) => updateLink(index, 'url', e.target.value)} placeholder="https://..." className="h-9 text-sm flex-1" />
          <Button variant="ghost" size="sm" onClick={() => removeLink(index)} className="text-red-500 h-8 w-8 p-0">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button onClick={addLink} variant="outline" size="sm" className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Add Social Link
      </Button>
    </div>
  )
}

// Awards Editor
function AwardsEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [awards, setAwards] = useState<any[]>([])
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "[]")
      setAwards(Array.isArray(parsed) ? parsed : [])
    } catch {
      setAwards([])
    }
  }, [content])
  
  const updateAwards = (newAwards: any[]) => {
    setAwards(newAwards)
    onChange(JSON.stringify(newAwards, null, 2))
  }
  
  const addAward = () => {
    const newAward = { id: Date.now().toString(), title: "", organization: "", year: "", description: "", icon: "trophy" }
    updateAwards([...awards, newAward])
  }
  
  const removeAward = (index: number) => {
    updateAwards(awards.filter((_, i) => i !== index))
  }
  
  const updateAward = (index: number, field: string, value: string) => {
    const newAwards = awards.map((award, i) => i === index ? { ...award, [field]: value } : award)
    updateAwards(newAwards)
  }
  
  const icons = [
    { value: "trophy", label: "🏆 Trophy" },
    { value: "award", label: "🎖️ Award" },
    { value: "star", label: "⭐ Star" },
    { value: "medal", label: "🥇 Medal" }
  ]
  
  return (
    <div className="space-y-2">
      {awards.map((award, index) => (
        <div key={award.id} className="border rounded p-3 bg-stone-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <select 
                value={award.icon} 
                onChange={(e) => updateAward(index, 'icon', e.target.value)}
                className="h-8 text-sm border rounded px-1"
              >
                {icons.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
              </select>
            </div>
            <Button variant="ghost" size="sm" onClick={() => removeAward(index)} className="text-red-500 h-6 w-6 p-0">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-2">
            <Input value={award.title} onChange={(e) => updateAward(index, 'title', e.target.value)} placeholder="Award Title" className="h-8 text-sm" />
            <Input value={award.organization} onChange={(e) => updateAward(index, 'organization', e.target.value)} placeholder="Organization" className="h-8 text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <Input value={award.year} onChange={(e) => updateAward(index, 'year', e.target.value)} placeholder="Year" className="h-8 text-sm" />
            </div>
            <Input value={award.description} onChange={(e) => updateAward(index, 'description', e.target.value)} placeholder="Description (optional)" className="h-8 text-sm" />
          </div>
        </div>
      ))}
      <Button onClick={addAward} variant="outline" size="sm" className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Add Award
      </Button>
    </div>
  )
}

// Partners Editor
function PartnersEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [partners, setPartners] = useState<any[]>([])
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "[]")
      setPartners(Array.isArray(parsed) ? parsed : [])
    } catch {
      setPartners([])
    }
  }, [content])
  
  const updatePartners = (newPartners: any[]) => {
    setPartners(newPartners)
    onChange(JSON.stringify(newPartners, null, 2))
  }
  
  const addPartner = () => {
    const newPartner = { id: Date.now().toString(), name: "", category: "Materials", logo: "", website: "" }
    updatePartners([...partners, newPartner])
  }
  
  const removePartner = (index: number) => {
    updatePartners(partners.filter((_, i) => i !== index))
  }
  
  const updatePartner = (index: number, field: string, value: string) => {
    const newPartners = partners.map((partner, i) => i === index ? { ...partner, [field]: value } : partner)
    updatePartners(newPartners)
  }
  
  const categories = ["Materials", "Utilities", "Development", "Finance", "Real Estate", "Suppliers", "Technology"]
  
  return (
    <div className="space-y-2">
      {partners.map((partner, index) => (
        <div key={partner.id} className="border rounded p-3 bg-stone-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">Partner {index + 1}</span>
            <Button variant="ghost" size="sm" onClick={() => removePartner(index)} className="text-red-500 h-6 w-6 p-0">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-2">
            <Input value={partner.name} onChange={(e) => updatePartner(index, 'name', e.target.value)} placeholder="Partner Name" className="h-8 text-sm" />
            <select 
              value={partner.category} 
              onChange={(e) => updatePartner(index, 'category', e.target.value)}
              className="h-8 text-sm border rounded px-2 w-full"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Input value={partner.logo} onChange={(e) => updatePartner(index, 'logo', e.target.value)} placeholder="Logo URL (optional)" className="h-8 text-sm" />
            <Input value={partner.website} onChange={(e) => updatePartner(index, 'website', e.target.value)} placeholder="Website URL (optional)" className="h-8 text-sm" />
          </div>
        </div>
      ))}
      <Button onClick={addPartner} variant="outline" size="sm" className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Add Partner
      </Button>
    </div>
  )
}

// Newsletter Editor
function NewsletterEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  // Newsletter typically just needs title and description
  return (
    <div className="p-3 bg-amber-50 rounded border border-amber-200">
      <div className="text-sm text-amber-800 font-medium mb-1">Newsletter Subscribe</div>
      <div className="text-xs text-amber-600">
        This widget shows a newsletter signup form. Uses the Section Title and Content for the heading and description.
      </div>
    </div>
  )
}

// CTA Editor
function CTAEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  return (
    <div className="p-3 bg-amber-50 rounded border border-amber-200">
      <div className="text-sm text-amber-800 font-medium mb-1">Call to Action</div>
      <div className="text-xs text-amber-600">
        This widget shows a CTA section. Uses the Section Title and Content for the heading and description. You can also add an Image URL for a background image.
      </div>
    </div>
  )
}

// Contact Form Editor
function ContactEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [data, setData] = useState({
    title: "",
    subtitle: "",
    submitButtonText: "Send Message",
    successMessage: "Thank you! We'll get back to you soon.",
    showName: true,
    showEmail: true,
    showPhone: true,
    showSubject: true,
    showMessage: true,
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    phoneLabel: "Phone Number",
    subjectLabel: "Subject",
    messageLabel: "Your Message",
    recipientEmail: ""
  })
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "{}")
      setData({
        title: parsed.title || "",
        subtitle: parsed.subtitle || "",
        submitButtonText: parsed.submitButtonText || "Send Message",
        successMessage: parsed.successMessage || "Thank you! We'll get back to you soon.",
        showName: parsed.showName !== false,
        showEmail: parsed.showEmail !== false,
        showPhone: parsed.showPhone !== false,
        showSubject: parsed.showSubject !== false,
        showMessage: parsed.showMessage !== false,
        nameLabel: parsed.nameLabel || "Full Name",
        emailLabel: parsed.emailLabel || "Email Address",
        phoneLabel: parsed.phoneLabel || "Phone Number",
        subjectLabel: parsed.subjectLabel || "Subject",
        messageLabel: parsed.messageLabel || "Your Message",
        recipientEmail: parsed.recipientEmail || ""
      })
    } catch {
      // Keep defaults
    }
  }, [content])
  
  const updateField = (field: string, value: any) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    onChange(JSON.stringify(newData, null, 2))
  }
  
  const toggleField = (field: string) => {
    updateField(field, !data[field as keyof typeof data])
  }
  
  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 rounded border border-blue-200">
        <div className="text-sm text-blue-800 font-medium mb-1">Contact Form Settings</div>
        <div className="text-xs text-blue-600">Customize form fields and labels</div>
      </div>
      
      <div className="space-y-3">
        <Input value={data.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Form Title (e.g., Get in Touch)" className="h-9 text-sm" />
        <Input value={data.subtitle} onChange={(e) => updateField('subtitle', e.target.value)} placeholder="Subtitle" className="h-9 text-sm" />
        <Input value={data.submitButtonText} onChange={(e) => updateField('submitButtonText', e.target.value)} placeholder="Submit Button Text" className="h-9 text-sm" />
        <Input value={data.successMessage} onChange={(e) => updateField('successMessage', e.target.value)} placeholder="Success Message" className="h-9 text-sm" />
        <Input value={data.recipientEmail} onChange={(e) => updateField('recipientEmail', e.target.value)} placeholder="Recipient Email (where to send messages)" className="h-9 text-sm" />
      </div>
      
      <div className="border-t pt-3">
        <div className="text-sm font-medium text-stone-700 mb-2">Form Fields</div>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={data.showName} onChange={() => toggleField('showName')} className="rounded" />
            <Input value={data.nameLabel} onChange={(e) => updateField('nameLabel', e.target.value)} placeholder="Name Label" className="h-8 text-sm flex-1" disabled={!data.showName} />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={data.showEmail} onChange={() => toggleField('showEmail')} className="rounded" />
            <Input value={data.emailLabel} onChange={(e) => updateField('emailLabel', e.target.value)} placeholder="Email Label" className="h-8 text-sm flex-1" disabled={!data.showEmail} />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={data.showPhone} onChange={() => toggleField('showPhone')} className="rounded" />
            <Input value={data.phoneLabel} onChange={(e) => updateField('phoneLabel', e.target.value)} placeholder="Phone Label" className="h-8 text-sm flex-1" disabled={!data.showPhone} />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={data.showSubject} onChange={() => toggleField('showSubject')} className="rounded" />
            <Input value={data.subjectLabel} onChange={(e) => updateField('subjectLabel', e.target.value)} placeholder="Subject Label" className="h-8 text-sm flex-1" disabled={!data.showSubject} />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={data.showMessage} onChange={() => toggleField('showMessage')} className="rounded" />
            <Input value={data.messageLabel} onChange={(e) => updateField('messageLabel', e.target.value)} placeholder="Message Label" className="h-8 text-sm flex-1" disabled={!data.showMessage} />
          </label>
        </div>
      </div>
    </div>
  )
}

// Video Embed Editor
function VideoEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [data, setData] = useState({
    videoUrl: "",
    title: "",
    autoplay: false,
    loop: false,
    muted: true,
    aspectRatio: "16:9"
  })
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "{}")
      setData({
        videoUrl: parsed.videoUrl || "",
        title: parsed.title || "",
        autoplay: parsed.autoplay || false,
        loop: parsed.loop || false,
        muted: parsed.muted !== false,
        aspectRatio: parsed.aspectRatio || "16:9"
      })
    } catch {
      // Keep defaults
    }
  }, [content])
  
  const updateField = (field: string, value: any) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    onChange(JSON.stringify(newData, null, 2))
  }
  
  const extractVideoId = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
    if (youtubeMatch) return { platform: 'youtube', id: youtubeMatch[1] }
    
    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/)
    if (vimeoMatch) return { platform: 'vimeo', id: vimeoMatch[1] }
    
    return null
  }
  
  const videoInfo = extractVideoId(data.videoUrl)
  
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-stone-600">Video URL</label>
        <Input 
          value={data.videoUrl} 
          onChange={(e) => updateField('videoUrl', e.target.value)} 
          placeholder="Paste YouTube or Vimeo URL (e.g., https://youtube.com/watch?v=...)"
          className="h-9 text-sm"
        />
        <div className="text-xs text-stone-400">Supports: YouTube, Vimeo, or direct video file URLs</div>
      </div>
      
      {videoInfo && (
        <div className="p-2 bg-green-50 rounded border border-green-200 text-xs text-green-700">
          ✓ Detected: {videoInfo.platform === 'youtube' ? 'YouTube' : 'Vimeo'} video
        </div>
      )}
      
      <Input value={data.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Video Title (optional)" className="h-9 text-sm" />
      
      <div className="border-t pt-3">
        <div className="text-sm font-medium text-stone-700 mb-2">Video Options</div>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={data.autoplay} onChange={() => updateField('autoplay', !data.autoplay)} className="rounded" />
            Autoplay
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={data.loop} onChange={() => updateField('loop', !data.loop)} className="rounded" />
            Loop
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={data.muted} onChange={() => updateField('muted', !data.muted)} className="rounded" />
            Muted (for autoplay)
          </label>
        </div>
        <div className="mt-2">
          <label className="text-xs text-stone-500">Aspect Ratio</label>
          <select 
            value={data.aspectRatio} 
            onChange={(e) => updateField('aspectRatio', e.target.value)}
            className="w-full h-8 text-sm border rounded px-2 mt-1"
          >
            <option value="16:9">16:9 (Widescreen)</option>
            <option value="4:3">4:3 (Standard)</option>
            <option value="1:1">1:1 (Square)</option>
            <option value="9:16">9:16 (Vertical)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

// Stats Editor
function StatsEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [stats, setStats] = useState<any[]>([])
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "[]")
      setStats(Array.isArray(parsed) ? parsed : [])
    } catch {
      setStats([
        { id: "1", value: "100+", label: "Projects Completed", suffix: "+" },
        { id: "2", value: "50", label: "Happy Clients", suffix: "" },
        { id: "3", value: "10", label: "Years Experience", suffix: "+" },
        { id: "4", value: "99", label: "Satisfaction Rate", suffix: "%" }
      ])
    }
  }, [content])
  
  const updateStats = (newStats: any[]) => {
    setStats(newStats)
    onChange(JSON.stringify(newStats, null, 2))
  }
  
  const addStat = () => {
    const newStat = { id: Date.now().toString(), value: "", label: "", suffix: "" }
    updateStats([...stats, newStat])
  }
  
  const removeStat = (index: number) => {
    updateStats(stats.filter((_, i) => i !== index))
  }
  
  const updateStat = (index: number, field: string, value: string) => {
    const newStats = stats.map((stat, i) => i === index ? { ...stat, [field]: value } : stat)
    updateStats(newStats)
  }
  
  const moveStat = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === stats.length - 1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newStats = [...stats]
    const [moved] = newStats.splice(index, 1)
    newStats.splice(newIndex, 0, moved)
    updateStats(newStats)
  }
  
  return (
    <div className="space-y-3">
      <div className="text-xs text-stone-500 mb-2">Statistics/Numbers</div>
      {stats.map((stat, index) => (
        <div key={stat.id} className="flex items-start gap-2 border rounded p-2 bg-stone-50">
          <div className="flex flex-col gap-0.5">
            <Button variant="ghost" size="sm" onClick={() => moveStat(index, 'up')} disabled={index === 0} className="h-5 w-5 p-0">
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => moveStat(index, 'down')} disabled={index === stats.length - 1} className="h-5 w-5 p-0">
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-2">
            <Input value={stat.value} onChange={(e) => updateStat(index, 'value', e.target.value)} placeholder="Value (e.g., 100)" className="h-8 text-sm" />
            <Input value={stat.suffix} onChange={(e) => updateStat(index, 'suffix', e.target.value)} placeholder="Suffix (+, %, K)" className="h-8 text-sm" />
            <Input value={stat.label} onChange={(e) => updateStat(index, 'label', e.target.value)} placeholder="Label" className="h-8 text-sm" />
          </div>
          <Button variant="ghost" size="sm" onClick={() => removeStat(index)} className="text-red-500 h-6 w-6 p-0">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button onClick={addStat} variant="outline" size="sm" className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Add Statistic
      </Button>
    </div>
  )
}

// Features Editor
function FeaturesEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [features, setFeatures] = useState<any[]>([])
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "[]")
      setFeatures(Array.isArray(parsed) ? parsed : [])
    } catch {
      setFeatures([
        { id: "1", icon: "✓", title: "Quality Materials", description: "We use only premium materials" },
        { id: "2", icon: "✓", title: "Expert Team", description: "Over 10 years of experience" },
        { id: "3", icon: "✓", title: "On Time Delivery", description: "We stick to deadlines" }
      ])
    }
  }, [content])
  
  const updateFeatures = (newFeatures: any[]) => {
    setFeatures(newFeatures)
    onChange(JSON.stringify(newFeatures, null, 2))
  }
  
  const addFeature = () => {
    const newFeature = { id: Date.now().toString(), icon: "✓", title: "", description: "" }
    updateFeatures([...features, newFeature])
  }
  
  const removeFeature = (index: number) => {
    updateFeatures(features.filter((_, i) => i !== index))
  }
  
  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = features.map((f, i) => i === index ? { ...f, [field]: value } : f)
    updateFeatures(newFeatures)
  }
  
  const moveFeature = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === features.length - 1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newFeatures = [...features]
    const [moved] = newFeatures.splice(index, 1)
    newFeatures.splice(newIndex, 0, moved)
    updateFeatures(newFeatures)
  }
  
  return (
    <div className="space-y-3">
      <div className="text-xs text-stone-500 mb-2">Feature Items</div>
      {features.map((feature, index) => (
        <div key={feature.id} className="flex items-start gap-2 border rounded p-2 bg-stone-50">
          <div className="flex flex-col gap-0.5">
            <Button variant="ghost" size="sm" onClick={() => moveFeature(index, 'up')} disabled={index === 0} className="h-5 w-5 p-0">
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => moveFeature(index, 'down')} disabled={index === features.length - 1} className="h-5 w-5 p-0">
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Input value={feature.icon} onChange={(e) => updateFeature(index, 'icon', e.target.value)} placeholder="Icon (emoji or text)" className="h-8 text-sm w-16 text-center" />
              <Input value={feature.title} onChange={(e) => updateFeature(index, 'title', e.target.value)} placeholder="Feature Title" className="h-8 text-sm flex-1" />
            </div>
            <Input value={feature.description} onChange={(e) => updateFeature(index, 'description', e.target.value)} placeholder="Description" className="h-8 text-sm" />
          </div>
          <Button variant="ghost" size="sm" onClick={() => removeFeature(index)} className="text-red-500 h-6 w-6 p-0">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button onClick={addFeature} variant="outline" size="sm" className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Add Feature
      </Button>
    </div>
  )
}

// FAQ Editor
function FAQEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [faqs, setFaqs] = useState<any[]>([])
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "[]")
      setFaqs(Array.isArray(parsed) ? parsed : [])
    } catch {
      setFaqs([
        { id: "1", question: "How long does a typical project take?", answer: "Project duration varies depending on size and complexity..." },
        { id: "2", question: "Do you offer free consultations?", answer: "Yes, we provide free initial consultations..." }
      ])
    }
  }, [content])
  
  const updateFaqs = (newFaqs: any[]) => {
    setFaqs(newFaqs)
    onChange(JSON.stringify(newFaqs, null, 2))
  }
  
  const addFaq = () => {
    const newFaq = { id: Date.now().toString(), question: "", answer: "" }
    updateFaqs([...faqs, newFaq])
  }
  
  const removeFaq = (index: number) => {
    updateFaqs(faqs.filter((_, i) => i !== index))
  }
  
  const updateFaq = (index: number, field: string, value: string) => {
    const newFaqs = faqs.map((f, i) => i === index ? { ...f, [field]: value } : f)
    updateFaqs(newFaqs)
  }
  
  const moveFaq = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === faqs.length - 1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newFaqs = [...faqs]
    const [moved] = newFaqs.splice(index, 1)
    newFaqs.splice(newIndex, 0, moved)
    updateFaqs(newFaqs)
  }
  
  return (
    <div className="space-y-3">
      <div className="text-xs text-stone-500 mb-2">FAQ Items</div>
      {faqs.map((faq, index) => (
        <div key={faq.id} className="border rounded p-2 bg-stone-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex flex-col gap-0.5">
              <Button variant="ghost" size="sm" onClick={() => moveFaq(index, 'up')} disabled={index === 0} className="h-5 w-5 p-0">
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => moveFaq(index, 'down')} disabled={index === faqs.length - 1} className="h-5 w-5 p-0">
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex-1 text-sm font-medium text-stone-600">Q{index + 1}</div>
            <Button variant="ghost" size="sm" onClick={() => removeFaq(index)} className="text-red-500 h-6 w-6 p-0">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-2 pl-7">
            <Input value={faq.question} onChange={(e) => updateFaq(index, 'question', e.target.value)} placeholder="Question" className="h-8 text-sm" />
            <textarea 
              value={faq.answer} 
              onChange={(e) => updateFaq(index, 'answer', e.target.value)} 
              placeholder="Answer" 
              rows={2}
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
        </div>
      ))}
      <Button onClick={addFaq} variant="outline" size="sm" className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Add FAQ
      </Button>
    </div>
  )
}

// Comparison Editor
function ComparisonEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [data, setData] = useState({
    title: "",
    subtitle: "",
    option1Name: "Option A",
    option2Name: "Option B",
    features: [] as any[]
  })
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "{}")
      setData({
        title: parsed.title || "",
        subtitle: parsed.subtitle || "",
        option1Name: parsed.option1Name || "Option A",
        option2Name: parsed.option2Name || "Option B",
        features: parsed.features || [
          { id: "1", name: "Feature 1", option1: true, option2: true },
          { id: "2", name: "Feature 2", option1: true, option2: false }
        ]
      })
    } catch {
      // Keep defaults
    }
  }, [content])
  
  const updateData = (newData: typeof data) => {
    setData(newData)
    onChange(JSON.stringify(newData, null, 2))
  }
  
  const updateField = (field: string, value: any) => {
    const newData = { ...data, [field]: value }
    updateData(newData)
  }
  
  const addFeature = () => {
    const newFeature = { id: Date.now().toString(), name: "", option1: false, option2: false }
    updateField('features', [...data.features, newFeature])
  }
  
  const removeFeature = (index: number) => {
    updateField('features', data.features.filter((_, i) => i !== index))
  }
  
  const updateFeature = (index: number, field: string, value: any) => {
    const newFeatures = data.features.map((f, i) => i === index ? { ...f, [field]: value } : f)
    updateField('features', newFeatures)
  }
  
  const moveFeature = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === data.features.length - 1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newFeatures = [...data.features]
    const [moved] = newFeatures.splice(index, 1)
    newFeatures.splice(newIndex, 0, moved)
    updateField('features', newFeatures)
  }
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input value={data.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Comparison Title" className="h-9 text-sm" />
        <Input value={data.subtitle} onChange={(e) => updateField('subtitle', e.target.value)} placeholder="Subtitle (optional)" className="h-9 text-sm" />
      </div>
      
      <div className="grid grid-cols-2 gap-2 border-t pt-2">
        <Input value={data.option1Name} onChange={(e) => updateField('option1Name', e.target.value)} placeholder="Option 1 Name" className="h-9 text-sm" />
        <Input value={data.option2Name} onChange={(e) => updateField('option2Name', e.target.value)} placeholder="Option 2 Name" className="h-9 text-sm" />
      </div>
      
      <div className="space-y-2">
        <div className="text-xs text-stone-500">Features to Compare</div>
        {data.features.map((feature, index) => (
          <div key={feature.id} className="flex items-center gap-2 border rounded p-2 bg-stone-50">
            <div className="flex flex-col gap-0.5">
              <Button variant="ghost" size="sm" onClick={() => moveFeature(index, 'up')} disabled={index === 0} className="h-5 w-5 p-0">
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => moveFeature(index, 'down')} disabled={index === data.features.length - 1} className="h-5 w-5 p-0">
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
            <Input value={feature.name} onChange={(e) => updateFeature(index, 'name', e.target.value)} placeholder="Feature name" className="h-8 text-sm flex-1" />
            <label className="flex items-center gap-1 text-xs whitespace-nowrap">
              <input type="checkbox" checked={feature.option1} onChange={(e) => updateFeature(index, 'option1', e.target.checked)} className="rounded" />
              {data.option1Name.slice(0, 8)}...
            </label>
            <label className="flex items-center gap-1 text-xs whitespace-nowrap">
              <input type="checkbox" checked={feature.option2} onChange={(e) => updateFeature(index, 'option2', e.target.checked)} className="rounded" />
              {data.option2Name.slice(0, 8)}...
            </label>
            <Button variant="ghost" size="sm" onClick={() => removeFeature(index)} className="text-red-500 h-6 w-6 p-0">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button onClick={addFeature} variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-1" /> Add Feature
        </Button>
      </div>
    </div>
  )
}

// Hero Editor
function HeroEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [data, setData] = useState({
    subtitle: "",
    buttonText: "Get Started",
    buttonLink: "#contact",
    secondaryButtonText: "",
    secondaryButtonLink: "",
    showScrollIndicator: true,
    overlayOpacity: 50
  })
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "{}")
      setData({
        subtitle: parsed.subtitle || "",
        buttonText: parsed.buttonText || "Get Started",
        buttonLink: parsed.buttonLink || "#contact",
        secondaryButtonText: parsed.secondaryButtonText || "",
        secondaryButtonLink: parsed.secondaryButtonLink || "",
        showScrollIndicator: parsed.showScrollIndicator !== false,
        overlayOpacity: parsed.overlayOpacity || 50
      })
    } catch {
      // Keep defaults
    }
  }, [content])
  
  const updateField = (field: string, value: any) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    onChange(JSON.stringify(newData, null, 2))
  }
  
  return (
    <div className="space-y-4">
      <div className="p-3 bg-amber-50 rounded border border-amber-200">
        <div className="text-sm text-amber-800 font-medium mb-1">Hero Banner Settings</div>
        <div className="text-xs text-amber-600">Uses Section Title as main heading. Set Image URL below.</div>
      </div>
      
      <div className="space-y-2">
        <Input value={data.subtitle} onChange={(e) => updateField('subtitle', e.target.value)} placeholder="Subtitle (optional)" className="h-9 text-sm" />
        
        <div className="grid grid-cols-2 gap-2">
          <Input value={data.buttonText} onChange={(e) => updateField('buttonText', e.target.value)} placeholder="Primary Button Text" className="h-9 text-sm" />
          <Input value={data.buttonLink} onChange={(e) => updateField('buttonLink', e.target.value)} placeholder="Button Link (e.g., #contact)" className="h-9 text-sm" />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Input value={data.secondaryButtonText} onChange={(e) => updateField('secondaryButtonText', e.target.value)} placeholder="Secondary Button Text (optional)" className="h-9 text-sm" />
          <Input value={data.secondaryButtonLink} onChange={(e) => updateField('secondaryButtonLink', e.target.value)} placeholder="Secondary Button Link" className="h-9 text-sm" />
        </div>
        
        <div className="space-y-2 pt-2 border-t">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={data.showScrollIndicator} onChange={() => updateField('showScrollIndicator', !data.showScrollIndicator)} className="rounded" />
            Show scroll down indicator
          </label>
          <div>
            <label className="text-xs text-stone-500">Overlay Opacity: {data.overlayOpacity}%</label>
            <input 
              type="range" 
              min="0" 
              max="80" 
              value={data.overlayOpacity} 
              onChange={(e) => updateField('overlayOpacity', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Hero Slider Editor (Advanced)
function HeroSliderEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [data, setData] = useState({
    sliderType: "fade", // fade, slide, cube, flip
    autoPlay: true,
    autoPlayDelay: 5,
    showDots: true,
    showArrows: true,
    slides: [] as any[]
  })
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "{}")
      setData({
        sliderType: parsed.sliderType || "fade",
        autoPlay: parsed.autoPlay !== false,
        autoPlayDelay: parsed.autoPlayDelay || 5,
        showDots: parsed.showDots !== false,
        showArrows: parsed.showArrows !== false,
        slides: parsed.slides || [
          { id: "1", image: "", title: "", description: "", buttonText: "Learn More", buttonLink: "#", buttonPosition: "center" }
        ]
      })
    } catch {
      // Keep defaults
    }
  }, [content])
  
  const updateData = (newData: typeof data) => {
    setData(newData)
    onChange(JSON.stringify(newData, null, 2))
  }
  
  const updateField = (field: string, value: any) => {
    const newData = { ...data, [field]: value }
    updateData(newData)
  }
  
  const addSlide = () => {
    const newSlide = { 
      id: Date.now().toString(), 
      image: "", 
      title: "", 
      description: "", 
      buttonText: "Learn More", 
      buttonLink: "#", 
      buttonPosition: "center" 
    }
    updateField('slides', [...data.slides, newSlide])
  }
  
  const removeSlide = (index: number) => {
    updateField('slides', data.slides.filter((_, i) => i !== index))
  }
  
  const updateSlide = (index: number, field: string, value: any) => {
    const newSlides = data.slides.map((slide, i) => i === index ? { ...slide, [field]: value } : slide)
    updateField('slides', newSlides)
  }
  
  const moveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === data.slides.length - 1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newSlides = [...data.slides]
    const [moved] = newSlides.splice(index, 1)
    newSlides.splice(newIndex, 0, moved)
    updateField('slides', newSlides)
  }
  
  const buttonPositions = [
    { value: "top-left", label: "↖️ Top Left" },
    { value: "top-center", label: "⬆️ Top Center" },
    { value: "top-right", label: "↗️ Top Right" },
    { value: "center-left", label: "⬅️ Center Left" },
    { value: "center", label: "⏺️ Center" },
    { value: "center-right", label: "➡️ Center Right" },
    { value: "bottom-left", label: "↙️ Bottom Left" },
    { value: "bottom-center", label: "⬇️ Bottom Center" },
    { value: "bottom-right", label: "↘️ Bottom Right" }
  ]
  
  const sliderTypes = [
    { value: "fade", label: "Fade" },
    { value: "slide", label: "Slide" },
    { value: "cube", label: "Cube" },
    { value: "flip", label: "Flip" },
    { value: "cards", label: "Cards" }
  ]
  
  return (
    <div className="space-y-4">
      <div className="p-3 bg-amber-50 rounded border border-amber-200">
        <div className="text-sm text-amber-800 font-medium mb-1">Hero Slider Settings</div>
        <div className="text-xs text-amber-600">Multiple slides with customizable content and animations</div>
      </div>
      
      {/* Slider Settings */}
      <div className="space-y-3 border-b pb-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-stone-500">Animation Type</label>
            <select 
              value={data.sliderType} 
              onChange={(e) => updateField('sliderType', e.target.value)}
              className="w-full h-8 text-sm border rounded px-2"
            >
              {sliderTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-stone-500">Auto-play Delay (seconds)</label>
            <Input 
              type="number" 
              value={data.autoPlayDelay} 
              onChange={(e) => updateField('autoPlayDelay', parseInt(e.target.value) || 5)} 
              className="h-8 text-sm"
              min={1}
              max={30}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={data.autoPlay} onChange={() => updateField('autoPlay', !data.autoPlay)} className="rounded" />
            Auto-play
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={data.showDots} onChange={() => updateField('showDots', !data.showDots)} className="rounded" />
            Show dots
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={data.showArrows} onChange={() => updateField('showArrows', !data.showArrows)} className="rounded" />
            Show arrows
          </label>
        </div>
      </div>
      
      {/* Slides */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-stone-700">Slides ({data.slides.length})</div>
        {data.slides.map((slide, index) => (
          <div key={slide.id} className="border rounded p-3 bg-stone-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => moveSlide(index, 'up')} disabled={index === 0} className="h-5 w-5 p-0">
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium">Slide {index + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => moveSlide(index, 'down')} disabled={index === data.slides.length - 1} className="h-5 w-5 p-0">
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeSlide(index)} className="text-red-500 h-6 w-6 p-0">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Input 
                value={slide.image} 
                onChange={(e) => updateSlide(index, 'image', e.target.value)} 
                placeholder="Background Image URL" 
                className="h-8 text-sm"
              />
              {slide.image && (
                <div className="h-16 bg-stone-200 rounded overflow-hidden">
                  <img src={slide.image} alt="" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                </div>
              )}
              <Input value={slide.title} onChange={(e) => updateSlide(index, 'title', e.target.value)} placeholder="Slide Title (optional, uses section title)" className="h-8 text-sm" />
              <Input value={slide.description} onChange={(e) => updateSlide(index, 'description', e.target.value)} placeholder="Description" className="h-8 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <Input value={slide.buttonText} onChange={(e) => updateSlide(index, 'buttonText', e.target.value)} placeholder="Button Text" className="h-8 text-sm" />
                <Input value={slide.buttonLink} onChange={(e) => updateSlide(index, 'buttonLink', e.target.value)} placeholder="Button Link" className="h-8 text-sm" />
              </div>
              <div>
                <label className="text-xs text-stone-500">Button Position</label>
                <select 
                  value={slide.buttonPosition} 
                  onChange={(e) => updateSlide(index, 'buttonPosition', e.target.value)}
                  className="w-full h-8 text-sm border rounded px-2"
                >
                  {buttonPositions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
        <Button onClick={addSlide} variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-1" /> Add Slide
        </Button>
      </div>
    </div>
  )
}

// Video Collection Editor
function VideoCollectionEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [data, setData] = useState({
    layout: "grid", // grid, slider, list
    columns: 2, // for grid
    videos: [] as any[]
  })
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "{}")
      setData({
        layout: parsed.layout || "grid",
        columns: parsed.columns || 2,
        videos: parsed.videos || []
      })
    } catch {
      setData({
        layout: "grid",
        columns: 2,
        videos: []
      })
    }
  }, [content])
  
  const updateData = (newData: typeof data) => {
    setData(newData)
    onChange(JSON.stringify(newData, null, 2))
  }
  
  const updateField = (field: string, value: any) => {
    const newData = { ...data, [field]: value }
    updateData(newData)
  }
  
  const addVideo = () => {
    const newVideo = { 
      id: Date.now().toString(), 
      url: "", 
      title: "", 
      thumbnail: "",
      description: ""
    }
    updateField('videos', [...data.videos, newVideo])
  }
  
  const removeVideo = (index: number) => {
    updateField('videos', data.videos.filter((_, i) => i !== index))
  }
  
  const updateVideo = (index: number, field: string, value: string) => {
    const newVideos = data.videos.map((video, i) => i === index ? { ...video, [field]: value } : video)
    updateField('videos', newVideos)
  }
  
  const moveVideo = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === data.videos.length - 1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newVideos = [...data.videos]
    const [moved] = newVideos.splice(index, 1)
    newVideos.splice(newIndex, 0, moved)
    updateField('videos', newVideos)
  }
  
  const layouts = [
    { value: "grid", label: "⊞ Grid" },
    { value: "slider", label: "◀▶ Slider" },
    { value: "list", label: "☰ List" }
  ]
  
  return (
    <div className="space-y-4">
      {/* Layout Settings */}
      <div className="space-y-2 border-b pb-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-stone-700">Layout:</label>
          <select 
            value={data.layout} 
            onChange={(e) => updateField('layout', e.target.value)}
            className="h-8 text-sm border rounded px-2"
          >
            {layouts.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
        
        {data.layout === "grid" && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-stone-500">Columns:</label>
            <select 
              value={data.columns} 
              onChange={(e) => updateField('columns', parseInt(e.target.value))}
              className="h-7 text-sm border rounded px-2"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
        )}
      </div>
      
      {/* Videos */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-stone-700">Videos ({data.videos.length})</div>
        {data.videos.map((video, index) => (
          <div key={video.id} className="border rounded p-2 bg-stone-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => moveVideo(index, 'up')} disabled={index === 0} className="h-5 w-5 p-0">
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <span className="text-xs font-medium">Video {index + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => moveVideo(index, 'down')} disabled={index === data.videos.length - 1} className="h-5 w-5 p-0">
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeVideo(index)} className="text-red-500 h-6 w-6 p-0">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-1.5">
              <Input value={video.url} onChange={(e) => updateVideo(index, 'url', e.target.value)} placeholder="Video URL (YouTube/Vimeo)" className="h-8 text-sm" />
              <Input value={video.title} onChange={(e) => updateVideo(index, 'title', e.target.value)} placeholder="Video Title" className="h-8 text-sm" />
              <Input value={video.thumbnail} onChange={(e) => updateVideo(index, 'thumbnail', e.target.value)} placeholder="Custom Thumbnail URL (optional)" className="h-8 text-sm" />
            </div>
          </div>
        ))}
        <Button onClick={addVideo} variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-1" /> Add Video
        </Button>
      </div>
    </div>
  )
}

// Layout Selector Component (for blog, projects, services, gallery, clients)
interface LayoutSelectorProps {
  content: string
  onChange: (content: string) => void
  itemType: string // "posts", "projects", "services", "images", "logos"
  showItemCount?: boolean
}

function LayoutSelector({ content, onChange, itemType, showItemCount = true }: LayoutSelectorProps) {
  const [data, setData] = useState({
    layout: "grid",
    columns: 3,
    itemsPerPage: 6,
    showFilters: false,
    masonryColumns: 3,
    listStyle: "compact" // compact, detailed
  })
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "{}")
      setData({
        layout: parsed.layout || "grid",
        columns: parsed.columns || 3,
        itemsPerPage: parsed.itemsPerPage || 6,
        showFilters: parsed.showFilters || false,
        masonryColumns: parsed.masonryColumns || 3,
        listStyle: parsed.listStyle || "compact"
      })
    } catch {
      // Keep defaults
    }
  }, [content])
  
  const updateData = (newData: typeof data) => {
    setData(newData)
    onChange(JSON.stringify(newData, null, 2))
  }
  
  const updateField = (field: string, value: any) => {
    const newData = { ...data, [field]: value }
    updateData(newData)
  }
  
  const layouts = [
    { value: "grid", label: "⊞ Grid", icon: "⊞" },
    { value: "masonry", label: "▤ Masonry", icon: "▤" },
    { value: "list", label: "☰ List", icon: "☰" },
    { value: "slider", label: "◀▶ Slider", icon: "◀▶" }
  ]
  
  return (
    <div className="space-y-4">
      {/* Layout Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700">Display Layout</label>
        <div className="grid grid-cols-4 gap-2">
          {layouts.map((layout) => (
            <button
              key={layout.value}
              onClick={() => updateField('layout', layout.value)}
              className={`p-2 rounded border text-xs font-medium transition-colors ${
                data.layout === layout.value 
                  ? "bg-amber-100 border-amber-500 text-amber-800" 
                  : "bg-white border-stone-200 text-stone-600 hover:border-amber-300"
              }`}
            >
              <div className="text-lg mb-1">{layout.icon}</div>
              {layout.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Layout-specific options */}
      <div className="space-y-3 border-t pt-3">
        {(data.layout === "grid" || data.layout === "masonry") && (
          <div className="flex items-center gap-3">
            <label className="text-xs text-stone-500 w-24">Columns:</label>
            <select 
              value={data.columns} 
              onChange={(e) => updateField('columns', parseInt(e.target.value))}
              className="h-8 text-sm border rounded px-2 flex-1"
            >
              <option value={1}>1 Column</option>
              <option value={2}>2 Columns</option>
              <option value={3}>3 Columns</option>
              <option value={4}>4 Columns</option>
              <option value={5}>5 Columns</option>
            </select>
          </div>
        )}
        
        {showItemCount && (
          <div className="flex items-center gap-3">
            <label className="text-xs text-stone-500 w-24">Items per page:</label>
            <Input 
              type="number" 
              value={data.itemsPerPage} 
              onChange={(e) => updateField('itemsPerPage', parseInt(e.target.value) || 6)} 
              className="h-8 text-sm flex-1"
              min={1}
              max={50}
            />
          </div>
        )}
        
        {(itemType === "posts" || itemType === "projects" || itemType === "services") && (
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={data.showFilters} 
              onChange={() => updateField('showFilters', !data.showFilters)} 
              className="rounded" 
            />
            Show category filters
          </label>
        )}
      </div>
      
      {/* Preview description */}
      <div className="p-2 bg-stone-100 rounded text-xs text-stone-600">
        {data.layout === "grid" && `Display ${itemType} in a ${data.columns}-column grid layout`}
        {data.layout === "masonry" && `Display ${itemType} in a Pinterest-style masonry layout`}
        {data.layout === "list" && `Display ${itemType} as a vertical list`}
        {data.layout === "slider" && `Display ${itemType} in a horizontal slider/carousel`}
      </div>
    </div>
  )
}

// Advanced Gallery Editor
function AdvancedGalleryEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [data, setData] = useState({
    layout: "grid",
    columns: 3,
    gap: 4,
    lightbox: true,
    images: [] as any[]
  })
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "{}")
      setData({
        layout: parsed.layout || "grid",
        columns: parsed.columns || 3,
        gap: parsed.gap || 4,
        lightbox: parsed.lightbox !== false,
        images: parsed.images || []
      })
    } catch {
      setData({
        layout: "grid",
        columns: 3,
        gap: 4,
        lightbox: true,
        images: []
      })
    }
  }, [content])
  
  const updateData = (newData: typeof data) => {
    setData(newData)
    onChange(JSON.stringify(newData, null, 2))
  }
  
  const updateField = (field: string, value: any) => {
    const newData = { ...data, [field]: value }
    updateData(newData)
  }
  
  const addImage = () => {
    const newImage = { 
      id: Date.now().toString(), 
      url: "", 
      title: "", 
      alt: "",
      caption: ""
    }
    updateField('images', [...data.images, newImage])
  }
  
  const removeImage = (index: number) => {
    updateField('images', data.images.filter((_, i) => i !== index))
  }
  
  const updateImage = (index: number, field: string, value: string) => {
    const newImages = data.images.map((img, i) => i === index ? { ...img, [field]: value } : img)
    updateField('images', newImages)
  }
  
  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === data.images.length - 1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newImages = [...data.images]
    const [moved] = newImages.splice(index, 1)
    newImages.splice(newIndex, 0, moved)
    updateField('images', newImages)
  }
  
  const layouts = [
    { value: "grid", label: "Grid", icon: "⊞" },
    { value: "masonry", label: "Masonry", icon: "▤" },
    { value: "slider", label: "Slider", icon: "◀▶" },
    { value: "list", label: "List", icon: "☰" }
  ]
  
  return (
    <div className="space-y-4">
      {/* Layout & Settings */}
      <div className="space-y-3 border-b pb-3">
        <div className="grid grid-cols-4 gap-2">
          {layouts.map((layout) => (
            <button
              key={layout.value}
              onClick={() => updateField('layout', layout.value)}
              className={`p-2 rounded border text-xs font-medium transition-colors ${
                data.layout === layout.value 
                  ? "bg-amber-100 border-amber-500 text-amber-800" 
                  : "bg-white border-stone-200 text-stone-600 hover:border-amber-300"
              }`}
            >
              <div className="text-lg mb-1">{layout.icon}</div>
              {layout.label}
            </button>
          ))}
        </div>
        
        {(data.layout === "grid" || data.layout === "masonry") && (
          <div className="flex items-center gap-3">
            <label className="text-xs text-stone-500">Columns:</label>
            <select 
              value={data.columns} 
              onChange={(e) => updateField('columns', parseInt(e.target.value))}
              className="h-7 text-sm border rounded px-2"
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
        )}
        
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={data.lightbox} onChange={() => updateField('lightbox', !data.lightbox)} className="rounded" />
          Enable lightbox (click to enlarge)
        </label>
      </div>
      
      {/* Images */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-stone-700">Images ({data.images.length})</div>
        <div className="grid grid-cols-3 gap-1">
          {data.images.map((image, index) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square bg-stone-100 rounded overflow-hidden">
                {image.url ? (
                  <img src={image.url} alt="" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => moveImage(index, 'up')} disabled={index === 0} className="h-6 w-6 p-0 text-white">
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => moveImage(index, 'down')} disabled={index === data.images.length - 1} className="h-6 w-6 p-0 text-white">
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeImage(index)} className="h-6 w-6 p-0 text-red-400">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          <button 
            onClick={addImage}
            className="aspect-square border-2 border-dashed border-stone-300 rounded flex flex-col items-center justify-center text-stone-400 hover:border-amber-500 hover:text-amber-600 transition-colors"
          >
            <Plus className="h-5 w-5 mb-1" />
            <span className="text-xs">Add Image</span>
          </button>
        </div>
        
        {/* Edit selected image details */}
        {data.images.length > 0 && (
          <div className="space-y-2 mt-3">
            <div className="text-xs font-medium text-stone-600">Edit Image Details:</div>
            {data.images.map((image, index) => (
              <div key={`edit-${image.id}`} className="flex items-center gap-2 text-sm">
                <span className="text-xs text-stone-400 w-6">#{index + 1}</span>
                <Input 
                  value={image.url} 
                  onChange={(e) => updateImage(index, 'url', e.target.value)} 
                  placeholder="Image URL" 
                  className="h-7 text-xs flex-1"
                />
                <Input 
                  value={image.caption} 
                  onChange={(e) => updateImage(index, 'caption', e.target.value)} 
                  placeholder="Caption" 
                  className="h-7 text-xs w-24"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Client Logos Editor
function ClientLogosEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const [data, setData] = useState({
    layout: "grid",
    columns: 5,
    grayscale: true,
    logos: [] as any[]
  })
  
  useEffect(() => {
    try {
      const parsed = JSON.parse(content || "{}")
      setData({
        layout: parsed.layout || "grid",
        columns: parsed.columns || 5,
        grayscale: parsed.grayscale !== false,
        logos: parsed.logos || []
      })
    } catch {
      setData({
        layout: "grid",
        columns: 5,
        grayscale: true,
        logos: []
      })
    }
  }, [content])
  
  const updateData = (newData: typeof data) => {
    setData(newData)
    onChange(JSON.stringify(newData, null, 2))
  }
  
  const updateField = (field: string, value: any) => {
    const newData = { ...data, [field]: value }
    updateData(newData)
  }
  
  const addLogo = () => {
    const newLogo = { 
      id: Date.now().toString(), 
      url: "", 
      name: "", 
      website: ""
    }
    updateField('logos', [...data.logos, newLogo])
  }
  
  const removeLogo = (index: number) => {
    updateField('logos', data.logos.filter((_, i) => i !== index))
  }
  
  const updateLogo = (index: number, field: string, value: string) => {
    const newLogos = data.logos.map((logo, i) => i === index ? { ...logo, [field]: value } : logo)
    updateField('logos', newLogos)
  }
  
  const moveLogo = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === data.logos.length - 1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newLogos = [...data.logos]
    const [moved] = newLogos.splice(index, 1)
    newLogos.splice(newIndex, 0, moved)
    updateField('logos', newLogos)
  }
  
  const layouts = [
    { value: "grid", label: "⊞ Grid" },
    { value: "slider", label: "◀▶ Slider" },
    { value: "list", label: "☰ List" }
  ]
  
  return (
    <div className="space-y-4">
      {/* Layout Settings */}
      <div className="space-y-3 border-b pb-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-stone-700">Layout:</label>
          <select 
            value={data.layout} 
            onChange={(e) => updateField('layout', e.target.value)}
            className="h-8 text-sm border rounded px-2"
          >
            {layouts.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
        
        {data.layout === "grid" && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-stone-500">Columns:</label>
            <select 
              value={data.columns} 
              onChange={(e) => updateField('columns', parseInt(e.target.value))}
              className="h-7 text-sm border rounded px-2"
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
          </div>
        )}
        
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={data.grayscale} onChange={() => updateField('grayscale', !data.grayscale)} className="rounded" />
          Grayscale logos (color on hover)
        </label>
      </div>
      
      {/* Logos */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-stone-700">Client Logos ({data.logos.length})</div>
        <div className="grid grid-cols-4 gap-2">
          {data.logos.map((logo, index) => (
            <div key={logo.id} className="relative group border rounded p-2 bg-white">
              <div className="aspect-[3/2] bg-stone-50 rounded overflow-hidden flex items-center justify-center">
                {logo.url ? (
                  <img 
                    src={logo.url} 
                    alt={logo.name} 
                    className={`max-w-full max-h-full object-contain ${data.grayscale ? 'grayscale' : ''}`} 
                    onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
                  />
                ) : (
                  <span className="text-stone-300 text-xs">No logo</span>
                )}
              </div>
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => removeLogo(index)} className="text-red-500 h-5 w-5 p-0 bg-white">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="mt-1 text-xs text-center truncate">{logo.name || `Logo ${index + 1}`}</div>
            </div>
          ))}
          <button 
            onClick={addLogo}
            className="aspect-[3/2] border-2 border-dashed border-stone-300 rounded flex flex-col items-center justify-center text-stone-400 hover:border-amber-500 hover:text-amber-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        
        {/* Edit logo details */}
        {data.logos.length > 0 && (
          <div className="space-y-2 mt-3">
            <div className="text-xs font-medium text-stone-600">Edit Logo Details:</div>
            {data.logos.map((logo, index) => (
              <div key={`edit-${logo.id}`} className="grid grid-cols-3 gap-2 text-sm">
                <Input 
                  value={logo.url} 
                  onChange={(e) => updateLogo(index, 'url', e.target.value)} 
                  placeholder="Logo URL" 
                  className="h-7 text-xs"
                />
                <Input 
                  value={logo.name} 
                  onChange={(e) => updateLogo(index, 'name', e.target.value)} 
                  placeholder="Client Name" 
                  className="h-7 text-xs"
                />
                <Input 
                  value={logo.website} 
                  onChange={(e) => updateLogo(index, 'website', e.target.value)} 
                  placeholder="Website (optional)" 
                  className="h-7 text-xs"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Text Editor (simple rich text)
function TextEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  return (
    <div className="space-y-2">
      <div className="text-xs text-stone-500">Text Content (supports basic HTML)</div>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        className="w-full px-3 py-2 border rounded-md text-sm bg-stone-50 focus:bg-white transition-colors"
        placeholder="Enter your text content here...&#10;&#10;You can use basic formatting like:&#10;- <strong>bold</strong>&#10;- <em>italic</em>&#10;- <br/> for line breaks&#10;- <a href='...'>links</a>"
      />
      <div className="text-xs text-stone-400">Tip: Use HTML tags for formatting. Text widgets display content directly.</div>
    </div>
  )
}

// Main Content Editor Component
export function ContentEditor({ type, content, onChange }: ContentEditorProps) {
  switch (type) {
    case "gallery":
      return <AdvancedGalleryEditor content={content} onChange={onChange} />
    
    case "before-after":
      return <BeforeAfterEditor content={content} onChange={onChange} />
    
    case "pricing":
      return <PricingEditor content={content} onChange={onChange} />
    
    case "process":
      return <ProcessEditor content={content} onChange={onChange} />
    
    case "location":
      return <LocationEditor content={content} onChange={onChange} />
    
    case "downloads":
      return <DownloadsEditor content={content} onChange={onChange} />
    
    case "social-links":
      return <SocialLinksEditor content={content} onChange={onChange} />
    
    case "awards":
      return <AwardsEditor content={content} onChange={onChange} />
    
    case "partners":
      return <PartnersEditor content={content} onChange={onChange} />
    
    case "newsletter":
      return <NewsletterEditor content={content} onChange={onChange} />
    
    case "cta":
      return <CTAEditor content={content} onChange={onChange} />
    
    case "contact":
      return <ContactEditor content={content} onChange={onChange} />
    
    case "video":
      return <VideoCollectionEditor content={content} onChange={onChange} />
    
    case "stats":
      return <StatsEditor content={content} onChange={onChange} />
    
    case "features":
      return <FeaturesEditor content={content} onChange={onChange} />
    
    case "faq":
      return <FAQEditor content={content} onChange={onChange} />
    
    case "comparison":
      return <ComparisonEditor content={content} onChange={onChange} />
    
    case "hero":
      return <HeroSliderEditor content={content} onChange={onChange} />
    
    case "text":
      return <TextEditor content={content} onChange={onChange} />
    
    // Dynamic content widgets with layout options
    case "projects":
      return <LayoutSelector content={content} onChange={onChange} itemType="projects" />
    
    case "services":
      return <LayoutSelector content={content} onChange={onChange} itemType="services" />
    
    case "blog":
      return <LayoutSelector content={content} onChange={onChange} itemType="posts" />
    
    case "clients":
      return <ClientLogosEditor content={content} onChange={onChange} />
    
    default:
      // Default textarea editor for other types
      return (
        <div className="space-y-2">
          <div className="text-xs text-stone-500">
            Content Data (JSON format)
          </div>
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border rounded-md text-sm font-mono bg-stone-50 focus:bg-white transition-colors"
            placeholder="Enter widget content data..."
          />
        </div>
      )
  }
}
