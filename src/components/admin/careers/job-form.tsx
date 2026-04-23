"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  DEPARTMENT_OPTIONS, 
  LOCATION_OPTIONS, 
  JOB_TYPE_LABELS,
  type Job 
} from "@/types/careers"
import { Plus, Trash2, PlusCircle } from "lucide-react"

interface JobFormProps {
  initialData?: Partial<Job>
  onSubmit: (data: any) => void
  onCancel: () => void
  loading?: boolean
}

export function JobForm({ initialData, onSubmit, onCancel, loading }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    department: initialData?.department || "",
    location: initialData?.location || "Remote",
    type: initialData?.type || "full-time",
    description: initialData?.description || "",
    requirements: initialData?.requirements || [""],
    responsibilities: initialData?.responsibilities || [""],
    salary: initialData?.salary || { min: 0, max: 0, currency: "USD", visible: false },
    status: initialData?.status || "draft",
    maxApplications: initialData?.maxApplications || null,
  })

  const [showSalary, setShowSalary] = useState(initialData?.salary?.visible || false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Build submission data, filtering out undefined values
    const submissionData: any = {
      title: formData.title,
      department: formData.department,
      location: formData.location,
      type: formData.type,
      description: formData.description,
      requirements: formData.requirements.filter(r => r.trim()),
      responsibilities: formData.responsibilities.filter(r => r.trim()),
      salary: {
        ...formData.salary,
        visible: showSalary
      },
      status: formData.status,
    }
    
    // Only include maxApplications if it has a value
    if (formData.maxApplications !== undefined && formData.maxApplications !== null) {
      submissionData.maxApplications = formData.maxApplications
    }
    
    onSubmit(submissionData)
  }

  const addField = (field: 'requirements' | 'responsibilities') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeField = (field: 'requirements' | 'responsibilities', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const updateField = (field: 'requirements' | 'responsibilities', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Job Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g. Senior Software Engineer"
          required
          className="bg-[#222] border-[#333] text-white"
        />
      </div>

      {/* Department & Location */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <select
            id="department"
            value={formData.department}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            required
            className="w-full px-3 py-2 bg-[#222] border border-[#333] rounded-md text-white text-sm [&>option]:bg-[#222] [&>option]:text-white"
          >
            <option value="">Select Department</option>
            {DEPARTMENT_OPTIONS.map(dept => (
              <option key={dept} value={dept} className="bg-[#222] text-white">{dept}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <select
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            required
            className="w-full px-3 py-2 bg-[#222] border border-[#333] rounded-md text-white text-sm [&>option]:bg-[#222] [&>option]:text-white"
          >
            {LOCATION_OPTIONS.map(loc => (
              <option key={loc} value={loc} className="bg-[#222] text-white">{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Job Type */}
      <div className="space-y-2">
        <Label>Job Type *</Label>
        <div className="flex gap-4">
          {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value={value}
                checked={formData.type === value}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="accent-cyan-500"
              />
              <span className="text-white text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Job Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the role, responsibilities, and ideal candidate..."
          rows={6}
          required
          className="bg-[#222] border-[#333] text-white"
        />
      </div>

      {/* Requirements */}
      <div className="space-y-3">
        <Label>Requirements</Label>
        {formData.requirements.map((req, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={req}
              onChange={(e) => updateField('requirements', index, e.target.value)}
              placeholder={`Requirement ${index + 1}`}
              className="bg-[#222] border-[#333] text-white flex-1"
            />
            {formData.requirements.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeField('requirements', index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addField('requirements')}
          className="border-[#444] text-white hover:bg-[#333]"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Requirement
        </Button>
      </div>

      {/* Responsibilities */}
      <div className="space-y-3">
        <Label>Responsibilities</Label>
        {formData.responsibilities.map((resp, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={resp}
              onChange={(e) => updateField('responsibilities', index, e.target.value)}
              placeholder={`Responsibility ${index + 1}`}
              className="bg-[#222] border-[#333] text-white flex-1"
            />
            {formData.responsibilities.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeField('responsibilities', index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addField('responsibilities')}
          className="border-[#444] text-white hover:bg-[#333]"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Responsibility
        </Button>
      </div>

      {/* Salary Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Salary Range</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={showSalary}
              onCheckedChange={setShowSalary}
            />
            <span className="text-sm text-gray-400">Show on job posting</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-xs text-gray-400">Minimum</Label>
            <Input
              type="number"
              value={formData.salary.min}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                salary: { ...prev.salary, min: parseInt(e.target.value) || 0 }
              }))}
              className="bg-[#222] border-[#333] text-white"
              placeholder="0"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400">Maximum</Label>
            <Input
              type="number"
              value={formData.salary.max}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                salary: { ...prev.salary, max: parseInt(e.target.value) || 0 }
              }))}
              className="bg-[#222] border-[#333] text-white"
              placeholder="0"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400">Currency</Label>
            <select
              value={formData.salary.currency}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                salary: { ...prev.salary, currency: e.target.value }
              }))}
              className="w-full px-3 py-2 bg-[#222] border border-[#333] rounded-md text-white text-sm [&>option]:bg-[#222] [&>option]:text-white"
            >
              <option value="USD" className="bg-[#222] text-white">USD</option>
              <option value="PHP" className="bg-[#222] text-white">PHP</option>
              <option value="EUR" className="bg-[#222] text-white">EUR</option>
              <option value="GBP" className="bg-[#222] text-white">GBP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Max Applications */}
      <div className="space-y-2">
        <Label htmlFor="maxApplications">Maximum Applications (optional)</Label>
        <Input
          id="maxApplications"
          type="number"
          value={formData.maxApplications || ""}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            maxApplications: e.target.value ? parseInt(e.target.value) : null 
          }))}
          placeholder="Leave empty for unlimited"
          className="bg-[#222] border-[#333] text-white w-48"
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label>Status</Label>
        <div className="flex gap-4">
          {['draft', 'published', 'closed'].map((status) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={status}
                checked={formData.status === status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="accent-cyan-500"
              />
              <span className="text-white text-sm capitalize">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-[#333]">
        <Button type="button" variant="outline" onClick={onCancel} className="border-[#444] text-white hover:bg-[#333]">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-700">
          {loading ? "Saving..." : initialData?.id ? "Update Job" : "Create Job"}
        </Button>
      </div>
    </form>
  )
}
