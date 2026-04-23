import { Timestamp } from "firebase/firestore"

export interface Job {
  id: string
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  description: string
  requirements: string[]
  responsibilities: string[]
  salary?: {
    min: number
    max: number
    currency: string
    visible: boolean
  }
  status: 'draft' | 'published' | 'closed' | 'archived'
  createdAt: Timestamp
  updatedAt: Timestamp
  postedAt?: Timestamp
  closesAt?: Timestamp
  maxApplications?: number
  applicationCount?: number
  customQuestions?: {
    id: string
    question: string
    required: boolean
    type: 'text' | 'textarea' | 'select'
    options?: string[]
  }[]
}

export interface Applicant {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  linkedin?: string
  portfolio?: string
}

export interface Application {
  id: string
  jobId: string
  jobTitle: string
  applicant: Applicant
  resumeUrl: string
  resumeFilename: string
  coverLetter: string
  answers?: {
    questionId: string
    question: string
    answer: string
  }[]
  status: ApplicationStatus
  statusHistory: StatusHistoryEntry[]
  appliedAt: Timestamp
  updatedAt: Timestamp
  rating?: number
  notes: ApplicationNote[]
  labels: string[]
}

export type ApplicationStatus = 
  | 'new' 
  | 'reviewed' 
  | 'phone-screen' 
  | 'interview' 
  | 'offer' 
  | 'hired' 
  | 'rejected' 
  | 'withdrawn'

export interface StatusHistoryEntry {
  status: ApplicationStatus
  changedAt: Timestamp
  changedBy: string
  note?: string
}

export interface ApplicationNote {
  id: string
  text: string
  createdAt: Timestamp
  createdBy: string
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  'new': 'New',
  'reviewed': 'Reviewed',
  'phone-screen': 'Phone Screen',
  'interview': 'Interview',
  'offer': 'Offer Sent',
  'hired': 'Hired',
  'rejected': 'Rejected',
  'withdrawn': 'Withdrawn'
}

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  'new': 'bg-blue-600',
  'reviewed': 'bg-purple-600',
  'phone-screen': 'bg-yellow-600',
  'interview': 'bg-orange-600',
  'offer': 'bg-pink-600',
  'hired': 'bg-green-600',
  'rejected': 'bg-red-600',
  'withdrawn': 'bg-gray-600'
}

export const JOB_TYPE_LABELS: Record<string, string> = {
  'full-time': 'Full Time',
  'part-time': 'Part Time',
  'contract': 'Contract',
  'internship': 'Internship'
}

export const DEPARTMENT_OPTIONS = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Customer Success',
  'Operations',
  'HR',
  'Finance',
  'Legal',
  'Product',
  'Other'
]

export const LOCATION_OPTIONS = [
  'Remote',
  'On-site',
  'Hybrid'
]
