"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { JobList } from "@/components/admin/careers/job-list"
import { ApplicationList } from "@/components/admin/careers/application-list"
import { Briefcase, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

type Tab = 'jobs' | 'applications'

export default function CareersAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('jobs')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Careers</h1>
            <p className="text-gray-400 mt-1">Manage job postings and applications</p>
          </div>
        </div>
        {activeTab === 'jobs' && (
          <Link href="/admin/careers/jobs/new">
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Briefcase className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'jobs'
              ? 'bg-[#222] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Jobs
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'applications'
              ? 'bg-[#222] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Applications
        </button>
      </div>

      {/* Content */}
      {activeTab === 'jobs' ? (
        <JobList />
      ) : (
        <ApplicationList />
      )}
    </div>
  )
}
