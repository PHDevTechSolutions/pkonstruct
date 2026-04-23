"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useJob } from "@/hooks/use-jobs"
import { useApplications } from "@/hooks/use-applications"
import { useResumeUpload, validateResumeFile } from "@/hooks/use-resume-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  JOB_TYPE_LABELS,
  type Job 
} from "@/types/careers"
import { 
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  CheckCircle,
  Upload,
  FileText,
  X,
  AlertCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

const STEPS = ['Personal Info', 'Resume', 'Cover Letter', 'Review']

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  const { job, loading: jobLoading } = useJob(jobId)
  const { createApplication } = useApplications()
  const { uploadResume, uploadState, resetUpload } = useResumeUpload()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    resumeFile: null as File | null,
    resumeUrl: "",
    coverLetter: "",
  })

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Job Not Found</h1>
          <p className="text-gray-400 mb-4">This position may have been filled or removed.</p>
          <Link href="/careers">
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              View All Jobs
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateResumeFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      return
    }

    setFormData(prev => ({ ...prev, resumeFile: file }))
    setError(null)
    resetUpload()

    try {
      const url = await uploadResume(file, jobId)
      setFormData(prev => ({ ...prev, resumeUrl: url }))
    } catch (err: any) {
      setError(err.message || "Failed to upload resume")
    }
  }

  const handleSubmit = async () => {
    if (!formData.resumeUrl) {
      setError("Please upload your resume")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await createApplication({
        jobId: job.id,
        jobTitle: job.title,
        applicant: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          linkedin: formData.linkedin,
          portfolio: formData.portfolio,
        },
        resumeUrl: formData.resumeUrl,
        resumeFilename: formData.resumeFile?.name || "resume",
        coverLetter: formData.coverLetter,
      })

      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to submit application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    // Validate current step
    if (currentStep === 0) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setError("Please fill in all required fields")
        return
      }
    }
    if (currentStep === 1 && !formData.resumeUrl) {
      setError("Please upload your resume")
      return
    }

    setError(null)
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
  }

  const prevStep = () => {
    setError(null)
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#111] py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Application Submitted!</h1>
            <p className="text-gray-400 mb-6">
              Thank you for applying to the <strong className="text-white">{job.title}</strong> position. 
              We&apos;ve received your application and will review it shortly. You&apos;ll hear back from us 
              within 5-7 business days.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/careers">
                <Button variant="outline" className="border-[#444] text-white hover:bg-[#222]">
                  View More Jobs
                </Button>
              </Link>
              <Link href="/">
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#111]">
      {/* Job Header */}
      <section className="bg-gradient-to-b from-[#1a1a1a] to-[#111] py-12 border-b border-[#222]">
        <div className="container mx-auto px-4">
          <Link href="/careers">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-4 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Careers
            </Button>
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-cyan-600/20 text-cyan-400 border-cyan-600/30">
                {job.department}
              </Badge>
              {job.salary?.visible && (
                <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{job.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-400">
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {job.location}
              </span>
              <span className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {JOB_TYPE_LABELS[job.type]}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Posted {job.postedAt ? format(job.postedAt.toDate(), 'MMM d, yyyy') : 'Recently'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Job Description */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">About the Role</h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>

              {job.requirements.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Requirements</h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-400">
                        <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.responsibilities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Responsibilities</h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-400">
                        <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Application Form */}
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-2">Apply for this Position</h2>
                <p className="text-gray-500 text-sm mb-6">Complete the application below to be considered.</p>

                {/* Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    {STEPS.map((step, i) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          i <= currentStep ? 'bg-cyan-600 text-white' : 'bg-[#333] text-gray-500'
                        }`}>
                          {i < currentStep ? <CheckCircle className="w-5 h-5" /> : i + 1}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`w-12 h-0.5 mx-1 ${
                            i < currentStep ? 'bg-cyan-600' : 'bg-[#333]'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-400">{STEPS[currentStep]}</p>
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 mb-6 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Step Content */}
                <div className="space-y-4">
                  {currentStep === 0 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            className="bg-[#222] border-[#333] text-white"
                            placeholder="John"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            className="bg-[#222] border-[#333] text-white"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-[#222] border-[#333] text-white"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-[#222] border-[#333] text-white"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          className="bg-[#222] border-[#333] text-white"
                          placeholder="City, Country"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn Profile (optional)</Label>
                        <Input
                          id="linkedin"
                          value={formData.linkedin}
                          onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                          className="bg-[#222] border-[#333] text-white"
                          placeholder="https://linkedin.com/in/johndoe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio/Website (optional)</Label>
                        <Input
                          id="portfolio"
                          value={formData.portfolio}
                          onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                          className="bg-[#222] border-[#333] text-white"
                          placeholder="https://johndoe.com"
                        />
                      </div>
                    </>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <Label>Resume/CV *</Label>
                      <p className="text-sm text-gray-500">Upload your resume (PDF, DOC, or DOCX, max 5MB)</p>
                      
                      {!formData.resumeUrl ? (
                        <div className="border-2 border-dashed border-[#333] rounded-lg p-8 text-center hover:border-cyan-600/50 transition-colors">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                            id="resume"
                          />
                          <label htmlFor="resume" className="cursor-pointer">
                            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-4" />
                            <p className="text-white font-medium mb-2">Click to upload resume</p>
                            <p className="text-gray-500 text-sm">or drag and drop</p>
                          </label>
                        </div>
                      ) : (
                        <div className="bg-[#222] rounded-lg p-4 flex items-center gap-3">
                          <FileText className="w-10 h-10 text-cyan-500" />
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{formData.resumeFile?.name}</p>
                            <p className="text-gray-500 text-xs">Successfully uploaded</p>
                          </div>
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, resumeFile: null, resumeUrl: "" }))}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}

                      {uploadState.status === 'uploading' && (
                        <div className="space-y-2">
                          <Progress value={uploadState.progress} className="h-2" />
                          <p className="text-sm text-gray-500 text-center">Uploading... {uploadState.progress}%</p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">Cover Letter</Label>
                      <p className="text-sm text-gray-500 mb-2">Tell us why you&apos;re interested in this position (optional)</p>
                      <Textarea
                        id="coverLetter"
                        value={formData.coverLetter}
                        onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                        className="bg-[#222] border-[#333] text-white min-h-[200px]"
                        placeholder="Dear Hiring Manager..."
                      />
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-white">Review Your Application</h3>
                      
                      <div className="bg-[#222] rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Name</p>
                            <p className="text-white">{formData.firstName} {formData.lastName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Email</p>
                            <p className="text-white">{formData.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="text-white">{formData.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Location</p>
                            <p className="text-white">{formData.location}</p>
                          </div>
                        </div>

                        {formData.resumeFile && (
                          <div className="flex items-center gap-2 pt-3 border-t border-[#333]">
                            <FileText className="w-4 h-4 text-cyan-500" />
                            <span className="text-sm text-white">{formData.resumeFile.name}</span>
                          </div>
                        )}

                        {formData.coverLetter && (
                          <div className="pt-3 border-t border-[#333]">
                            <p className="text-gray-500 text-sm mb-1">Cover Letter</p>
                            <p className="text-sm text-white line-clamp-3">{formData.coverLetter}</p>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-500">
                        By submitting, you confirm that all information provided is accurate and complete.
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="border-[#444] text-white hover:bg-[#333] disabled:opacity-50"
                  >
                    Back
                  </Button>
                  
                  {currentStep < STEPS.length - 1 ? (
                    <Button
                      onClick={nextStep}
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !formData.resumeUrl}
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
