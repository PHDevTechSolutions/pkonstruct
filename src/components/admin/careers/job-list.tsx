"use client"

import { useState } from "react"
import { useJobs } from "@/hooks/use-jobs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { JobForm } from "./job-form"
import type { Job, ApplicationStatus } from "@/types/careers"
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Play,
  Archive,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Globe
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useJobApplications } from "@/hooks/use-applications"
import { StatusBadge } from "./status-badge"

interface JobListProps {
  onEdit?: (job: Job) => void
}

export function JobList({ onEdit }: JobListProps) {
  const { jobs, loading, deleteJob, publishJob, closeJob, updateJob } = useJobs()
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const handleEdit = (job: Job) => {
    setSelectedJob(job)
    setIsEditOpen(true)
  }

  const handleView = (job: Job) => {
    setSelectedJob(job)
    setIsViewOpen(true)
  }

  const handleUpdateJob = async (data: any) => {
    if (!selectedJob) return
    await updateJob(selectedJob.id, data)
    setIsEditOpen(false)
    setSelectedJob(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-600'
      case 'draft': return 'bg-gray-600'
      case 'closed': return 'bg-red-600'
      case 'archived': return 'bg-yellow-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{jobs.length}</div>
          <div className="text-sm text-gray-400">Total Jobs</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-bold text-green-500">
            {jobs.filter(j => j.status === 'published').length}
          </div>
          <div className="text-sm text-gray-400">Published</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-500">
            {jobs.filter(j => j.status === 'draft').length}
          </div>
          <div className="text-sm text-gray-400">Drafts</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-bold text-cyan-500">
            {jobs.reduce((acc, j) => acc + (j.applicationCount || 0), 0)}
          </div>
          <div className="text-sm text-gray-400">Total Applications</div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Job</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Department</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Location</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Applications</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Posted</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-[#333] hover:bg-[#222]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-cyan-500" />
                    <div>
                      <div className="font-medium text-white">{job.title}</div>
                      <div className="text-xs text-gray-500">{JOB_TYPE_LABELS[job.type]}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300">{job.department}</td>
                <td className="px-4 py-3 text-gray-300">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-gray-300">
                    <Users className="w-4 h-4" />
                    {job.applicationCount || 0}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 text-sm">
                  {job.postedAt 
                    ? formatDistanceToNow(job.postedAt.toDate(), { addSuffix: true })
                    : 'Not posted'
                  }
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#333]">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#222] border-[#333] z-50 relative">
                      <DropdownMenuItem onClick={() => handleView(job)} className="text-white hover:bg-[#333] focus:bg-[#333] focus:text-white">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(job)} className="text-white hover:bg-[#333] focus:bg-[#333] focus:text-white">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {job.status === 'draft' && (
                        <DropdownMenuItem onClick={() => publishJob(job.id)} className="text-white hover:bg-[#333] focus:bg-[#333] focus:text-white">
                          <Play className="w-4 h-4 mr-2" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {job.status === 'published' && (
                        <DropdownMenuItem onClick={() => closeJob(job.id)} className="text-white hover:bg-[#333] focus:bg-[#333] focus:text-white">
                          <Archive className="w-4 h-4 mr-2" />
                          Close Job
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => {
                          if (confirm('Delete this job posting?')) {
                            deleteJob(job.id)
                          }
                        }}
                        className="text-red-400 hover:bg-[#333] focus:bg-[#333]"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {jobs.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No job postings yet</p>
            <p className="text-sm mt-1">Create your first job posting</p>
          </div>
        )}
      </div>

      {/* View Job Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedJob.title}
                  <Badge className={getStatusColor(selectedJob.status)}>
                    {selectedJob.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Job Info */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Briefcase className="w-4 h-4" />
                    {selectedJob.department}
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {selectedJob.location}
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    {JOB_TYPE_LABELS[selectedJob.type]}
                  </div>
                  {selectedJob.salary?.visible && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      {selectedJob.salary.currency} {selectedJob.salary.min.toLocaleString()} - {selectedJob.salary.max.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{selectedJob.description}</p>
                </div>

                {/* Requirements */}
                {selectedJob.requirements.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Responsibilities */}
                {selectedJob.responsibilities.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Responsibilities</h4>
                    <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                      {selectedJob.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Applications Preview */}
                <JobApplicationsPreview jobId={selectedJob.id} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Job Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Posting</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <JobForm
              initialData={selectedJob}
              onSubmit={handleUpdateJob}
              onCancel={() => setIsEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function JobApplicationsPreview({ jobId }: { jobId: string }) {
  const { applications } = useJobApplications(jobId)

  if (applications.length === 0) {
    return (
      <div className="bg-[#222] rounded-lg p-4">
        <h4 className="font-medium mb-2">Applications</h4>
        <p className="text-sm text-gray-500">No applications yet</p>
      </div>
    )
  }

  return (
    <div className="bg-[#222] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">Applications</h4>
        <Badge className="bg-cyan-600">{applications.length}</Badge>
      </div>
      <div className="space-y-2">
        {applications.slice(0, 5).map((app) => (
          <div key={app.id} className="flex items-center justify-between text-sm">
            <span className="text-white">{app.applicant.firstName} {app.applicant.lastName}</span>
            <StatusBadge status={app.status} className="text-xs" />
          </div>
        ))}
        {applications.length > 5 && (
          <p className="text-xs text-gray-500 text-center">
            +{applications.length - 5} more applications
          </p>
        )}
      </div>
    </div>
  )
}

const JOB_TYPE_LABELS: Record<string, string> = {
  'full-time': 'Full Time',
  'part-time': 'Part Time',
  'contract': 'Contract',
  'internship': 'Internship'
}
