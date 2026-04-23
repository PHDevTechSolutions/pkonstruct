"use client"

import { useState } from "react"
import { useApplications, useApplication } from "@/hooks/use-applications"
import { useJobs } from "@/hooks/use-jobs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { StatusBadge } from "./status-badge"
import { 
  APPLICATION_STATUS_LABELS, 
  type Application, 
  type ApplicationStatus,
  APPLICATION_STATUS_COLORS
} from "@/types/careers"
import { 
  Search, 
  MoreVertical, 
  Star, 
  Eye, 
  FileText,
  Trash2,
  Download,
  Users,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  Send,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const PIPELINE_STATUSES: ApplicationStatus[] = [
  'new',
  'reviewed',
  'phone-screen',
  'interview',
  'offer',
  'hired'
]

export function ApplicationList() {
  const { applications, loading, updateApplicationStatus, addApplicationNote, updateApplicationRating, deleteApplication } = useApplications()
  const { jobs } = useJobs()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJob, setSelectedJob] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>("all")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [newNote, setNewNote] = useState("")

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.applicant.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesJob = selectedJob === "all" || app.jobId === selectedJob
    const matchesStatus = selectedStatus === "all" || app.status === selectedStatus
    
    return matchesSearch && matchesJob && matchesStatus
  })

  // Group by status for kanban view
  const applicationsByStatus = PIPELINE_STATUSES.reduce((acc, status) => {
    acc[status] = filteredApplications.filter(app => app.status === status)
    return acc
  }, {} as Record<ApplicationStatus, Application[]>)

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    await updateApplicationStatus(applicationId, newStatus)
  }

  const handleAddNote = async () => {
    if (!selectedApplication || !newNote.trim()) return
    await addApplicationNote(selectedApplication.id, newNote, 'admin')
    setNewNote("")
  }

  const handleRating = async (applicationId: string, rating: number) => {
    await updateApplicationRating(applicationId, rating)
  }

  const openDetail = (application: Application) => {
    setSelectedApplication(application)
    setIsDetailOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-[#333] text-white"
          />
        </div>

        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md text-white text-sm [&>option]:bg-[#1a1a1a] [&>option]:text-white"
        >
          <option value="all" className="bg-[#1a1a1a] text-white">All Jobs</option>
          {jobs.map(job => (
            <option key={job.id} value={job.id} className="bg-[#1a1a1a] text-white">{job.title}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus | 'all')}
          className="px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md text-white text-sm [&>option]:bg-[#1a1a1a] [&>option]:text-white"
        >
          <option value="all" className="bg-[#1a1a1a] text-white">All Status</option>
          {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value} className="bg-[#1a1a1a] text-white">{label}</option>
          ))}
        </select>
      </div>

      {/* Pipeline View */}
      <div className="grid grid-cols-6 gap-4">
        {PIPELINE_STATUSES.map(status => (
          <div key={status} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white">{APPLICATION_STATUS_LABELS[status]}</h3>
              <Badge variant="secondary" className="bg-[#333] text-gray-300">
                {applicationsByStatus[status]?.length || 0}
              </Badge>
            </div>
            <div className="space-y-2">
              {applicationsByStatus[status]?.map(application => (
                <div
                  key={application.id}
                  onClick={() => openDetail(application)}
                  className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 cursor-pointer hover:border-cyan-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-white text-sm">
                        {application.applicant.firstName} {application.applicant.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{application.jobTitle}</p>
                    </div>
                    {application.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs text-yellow-500">{application.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDistanceToNow(application.appliedAt.toDate(), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Applicant</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Job</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Rating</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Applied</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((application) => (
              <tr key={application.id} className="border-b border-[#333] hover:bg-[#222]">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">
                    {application.applicant.firstName} {application.applicant.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{application.applicant.email}</div>
                </td>
                <td className="px-4 py-3 text-gray-300">{application.jobTitle}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={application.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(application.id, star)}
                        className={`w-4 h-4 ${
                          star <= (application.rating || 0)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-600'
                        }`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 text-sm">
                  {formatDistanceToNow(application.appliedAt.toDate(), { addSuffix: true })}
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#333]">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#222] border-[#333] z-50 relative">
                      <DropdownMenuItem onClick={() => openDetail(application)} className="text-white hover:bg-[#333] focus:bg-[#333] focus:text-white">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(application.id, 'reviewed')}
                        className="text-white hover:bg-[#333] focus:bg-[#333] focus:text-white"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Mark Reviewed
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(application.id, 'interview')}
                        className="text-white hover:bg-[#333] focus:bg-[#333] focus:text-white"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Move to Interview
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-400 hover:bg-[#333] focus:bg-[#333]"
                        onClick={() => handleStatusChange(application.id, 'rejected')}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No applications found</p>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div>
                    {selectedApplication.applicant.firstName} {selectedApplication.applicant.lastName}
                  </div>
                  <StatusBadge status={selectedApplication.status} />
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Applicant Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedApplication.applicant.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedApplication.applicant.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{selectedApplication.applicant.location}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {selectedApplication.applicant.linkedin && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.14-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <a href={selectedApplication.applicant.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    {selectedApplication.applicant.portfolio && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a href={selectedApplication.applicant.portfolio} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                          Portfolio
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Applied {formatDistanceToNow(selectedApplication.appliedAt.toDate(), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                {/* Resume */}
                <div className="bg-[#222] rounded-lg p-4">
                  <h4 className="font-medium mb-2">Resume</h4>
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-cyan-500" />
                    <div className="flex-1">
                      <p className="text-sm">{selectedApplication.resumeFilename}</p>
                    </div>
                    <a 
                      href={selectedApplication.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="outline" className="border-[#444] text-white hover:bg-[#333]">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApplication.coverLetter && (
                  <div>
                    <h4 className="font-medium mb-2">Cover Letter</h4>
                    <p className="text-sm text-gray-300 bg-[#222] rounded-lg p-4 whitespace-pre-wrap">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                )}

                {/* Status History */}
                {selectedApplication.statusHistory.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Status History</h4>
                    <div className="space-y-2">
                      {selectedApplication.statusHistory.map((entry, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <StatusBadge status={entry.status} className="text-xs" />
                          <span className="text-gray-400">
                            {formatDistanceToNow(entry.changedAt.toDate(), { addSuffix: true })}
                          </span>
                          {entry.note && <span className="text-gray-500">- {entry.note}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  {selectedApplication.notes.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {selectedApplication.notes.map((note) => (
                        <div key={note.id} className="bg-[#222] rounded-lg p-3 text-sm">
                          <p className="text-gray-300">{note.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(note.createdAt.toDate(), { addSuffix: true })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note..."
                      className="bg-[#222] border-[#333] text-white flex-1"
                      rows={2}
                    />
                    <Button 
                      onClick={handleAddNote} 
                      disabled={!newNote.trim()}
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[#333]">
                  {Object.entries(APPLICATION_STATUS_LABELS).map(([status, label]) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedApplication.status === status ? "default" : "outline"}
                      onClick={() => handleStatusChange(selectedApplication.id, status as ApplicationStatus)}
                      className={selectedApplication.status === status ? APPLICATION_STATUS_COLORS[status as ApplicationStatus] : "border-[#444] text-white hover:bg-[#333]"}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
