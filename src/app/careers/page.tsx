"use client"

import { useState } from "react"
import { usePublishedJobs } from "@/hooks/use-jobs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DEPARTMENT_OPTIONS, 
  LOCATION_OPTIONS, 
  JOB_TYPE_LABELS,
  type Job 
} from "@/types/careers"
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  ArrowRight,
  Building2,
  Users,
  Globe
} from "lucide-react"
import Link from "next/link"

export default function CareersPage() {
  const { jobs, loading } = usePublishedJobs()
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter
    const matchesLocation = locationFilter === "all" || job.location === locationFilter
    const matchesType = typeFilter === "all" || job.type === typeFilter
    
    return matchesSearch && matchesDepartment && matchesLocation && matchesType
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#111]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1a1a1a] to-[#111] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-cyan-600/20 text-cyan-400 border-cyan-600/30 mb-6">
              We&apos;re Hiring
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              We&apos;re always looking for talented individuals who are passionate about 
              construction, innovation, and building the future. Explore our open positions 
              and find your next career opportunity.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{jobs.length}</div>
                <div className="text-sm text-gray-500">Open Positions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{DEPARTMENT_OPTIONS.length}</div>
                <div className="text-sm text-gray-500">Departments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Remote</div>
                <div className="text-sm text-gray-500">Friendly</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-[#222] py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-600"
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm [&>option]:bg-[#1a1a1a] [&>option]:text-white"
            >
              <option value="all" className="bg-[#1a1a1a] text-white">All Departments</option>
              {DEPARTMENT_OPTIONS.map(dept => (
                <option key={dept} value={dept} className="bg-[#1a1a1a] text-white">{dept}</option>
              ))}
            </select>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm [&>option]:bg-[#1a1a1a] [&>option]:text-white"
            >
              <option value="all" className="bg-[#1a1a1a] text-white">All Locations</option>
              {LOCATION_OPTIONS.map(loc => (
                <option key={loc} value={loc} className="bg-[#1a1a1a] text-white">{loc}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm [&>option]:bg-[#1a1a1a] [&>option]:text-white"
            >
              <option value="all" className="bg-[#1a1a1a] text-white">All Types</option>
              {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value} className="bg-[#1a1a1a] text-white">{label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-medium text-white mb-2">No open positions</h3>
              <p className="text-gray-500">
                {searchQuery || departmentFilter !== "all" || locationFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Check back later for new opportunities."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 max-w-4xl mx-auto">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Why Join Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-cyan-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Modern Workspace</h3>
                <p className="text-gray-400 text-sm">State-of-the-art facilities and tools to help you do your best work.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-cyan-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Great Team</h3>
                <p className="text-gray-400 text-sm">Work alongside talented professionals who are passionate about what they do.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-cyan-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Remote Friendly</h3>
                <p className="text-gray-400 text-sm">Flexible work arrangements to support your lifestyle and productivity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 hover:border-cyan-600/50 transition-colors group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
              {job.title}
            </h3>
            {job.salary?.visible && (
              <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30">
                <DollarSign className="w-3 h-3 mr-1" />
                {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {job.department}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {JOB_TYPE_LABELS[job.type]}
            </span>
          </div>

          <p className="text-gray-500 text-sm line-clamp-2">{job.description}</p>
        </div>

        <Link href={`/careers/${job.id}`}>
          <Button className="bg-cyan-600 hover:bg-cyan-700 group/btn">
            View Details
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
