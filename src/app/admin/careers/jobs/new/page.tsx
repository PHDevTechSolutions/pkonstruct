"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useJobs } from "@/hooks/use-jobs"
import { Button } from "@/components/ui/button"
import { JobForm } from "@/components/admin/careers/job-form"
import { ArrowLeft, Briefcase } from "lucide-react"
import Link from "next/link"

export default function NewJobPage() {
  const router = useRouter()
  const { createJob } = useJobs()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: any) => {
    setLoading(true)
    try {
      await createJob(data)
      router.push("/admin/careers")
    } catch (err) {
      console.error("Error creating job:", err)
      alert("Failed to create job posting. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/careers">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Careers
          </Button>
        </Link>
      </div>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Briefcase className="w-6 h-6 text-cyan-500" />
          <div>
            <h1 className="text-2xl font-bold text-white">Create Job Posting</h1>
            <p className="text-gray-400 text-sm">Post a new job opening to attract candidates</p>
          </div>
        </div>

        <JobForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/careers")}
          loading={loading}
        />
      </div>
    </div>
  )
}
