"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useJob } from "@/hooks/use-jobs"
import { useApplications } from "@/hooks/use-applications"
import { useCloudinaryUpload, validateResumeFile } from "@/hooks/use-cloudinary-upload"
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
  ArrowRight,
  Sparkles,
  Loader2,
  ChevronLeft,
  Tag,
  Building2
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { format } from "date-fns"

const STEPS = ['Personal Info', 'Resume', 'Cover Letter', 'Review']

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  const { job, loading: jobLoading } = useJob(jobId)
  const { createApplication } = useApplications()
  const { uploadToCloudinary, uploadState, resetUpload } = useCloudinaryUpload()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadTimeout, setUploadTimeout] = useState<NodeJS.Timeout | null>(null)
  
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-blue-600" />
        </motion.div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
          <p className="text-gray-600 mb-6">This position may have been filled or removed.</p>
          <Link href="/careers">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full px-8">
              View All Jobs
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log("Selected file:", file.name, file.size, file.type)

    const validation = validateResumeFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      return
    }

    setFormData(prev => ({ ...prev, resumeFile: file }))
    setError(null)
    resetUpload()

    // Set a 30-second timeout to auto-reset if upload hangs
    const timeout = setTimeout(() => {
      if (uploadState.status === 'uploading') {
        console.log("Upload timeout - resetting")
        setError("Upload is taking too long. Please try again with a smaller file or check your connection.")
        resetUpload()
        setFormData(prev => ({ ...prev, resumeFile: null }))
      }
    }, 30000) // 30 seconds
    setUploadTimeout(timeout)

    try {
      console.log("Starting Cloudinary upload...")
      const url = await uploadToCloudinary(file)
      console.log("Upload complete:", url)
      setFormData(prev => ({ ...prev, resumeUrl: url }))
      // Clear timeout on success
      if (timeout) clearTimeout(timeout)
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message || "Failed to upload resume. Please try again or use a smaller file.")
      // Reset file on error so user can retry
      setFormData(prev => ({ ...prev, resumeFile: null }))
      // Clear timeout on error
      if (timeout) clearTimeout(timeout)
    }
  }

  const handleCancelUpload = () => {
    if (uploadTimeout) clearTimeout(uploadTimeout)
    resetUpload()
    setFormData(prev => ({ ...prev, resumeFile: null }))
    setError("Upload cancelled")
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-36 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Thank you for applying to the <strong className="text-blue-600">{job.title}</strong> position. 
              We&apos;ve received your application and will review it shortly. You&apos;ll hear back from us 
              within 5-7 business days.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/careers">
                <Button variant="outline" className="border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 rounded-full px-6">
                  View More Jobs
                </Button>
              </Link>
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full px-6 shadow-lg">
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Modern Job Header */}
      <section className="pt-40 pb-24 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/careers">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-6 -ml-4 rounded-full backdrop-blur-sm border border-white/20">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Careers
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <Tag className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm font-medium">{job.department}</span>
              </div>
              {job.salary?.visible && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 backdrop-blur-sm">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">{job.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
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
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Job Description */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  About the Role
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </motion.div>

              {job.requirements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {job.responsibilities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Application Form */}
            <div className="lg:sticky lg:top-8 h-fit">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Apply for this Position</h2>
                </div>
                <p className="text-gray-500 text-sm mb-6">Complete the application below to be considered.</p>

                {/* Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    {STEPS.map((step, i) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          i <= currentStep ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {i < currentStep ? <CheckCircle className="w-5 h-5" /> : i + 1}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`w-12 h-0.5 mx-1 ${
                            i < currentStep ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-500 font-medium">{STEPS[currentStep]}</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Step Content */}
                <div className="space-y-4">
                  {currentStep === 0 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-gray-700">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            className="bg-white border-2 border-gray-200 text-gray-900 focus:border-blue-500 rounded-xl"
                            placeholder="John"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-gray-700">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            className="bg-white border-2 border-gray-200 text-gray-900 focus:border-blue-500 rounded-xl"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-white border-2 border-gray-200 text-gray-900 focus:border-blue-500 rounded-xl"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-white border-2 border-gray-200 text-gray-900 focus:border-blue-500 rounded-xl"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-gray-700">Location *</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          className="bg-white border-2 border-gray-200 text-gray-900 focus:border-blue-500 rounded-xl"
                          placeholder="City, Country"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="text-gray-700">LinkedIn Profile (optional)</Label>
                        <Input
                          id="linkedin"
                          value={formData.linkedin}
                          onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                          className="bg-white border-2 border-gray-200 text-gray-900 focus:border-blue-500 rounded-xl"
                          placeholder="https://linkedin.com/in/johndoe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="portfolio" className="text-gray-700">Portfolio/Website (optional)</Label>
                        <Input
                          id="portfolio"
                          value={formData.portfolio}
                          onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                          className="bg-white border-2 border-gray-200 text-gray-900 focus:border-blue-500 rounded-xl"
                          placeholder="https://johndoe.com"
                        />
                      </div>
                    </>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <Label className="text-gray-700">Resume/CV *</Label>
                      <p className="text-sm text-gray-500">Upload your resume (PDF, DOC, or DOCX, max 5MB)</p>
                      
                      {/* Show loading state */}
                      {uploadState.status === 'uploading' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                          <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
                          <p className="text-gray-900 font-medium mb-2">Uploading...</p>
                          <Progress value={uploadState.progress} className="h-2 mb-2" />
                          <p className="text-sm text-gray-500">{uploadState.progress}% complete</p>
                          <p className="text-xs text-gray-400 mt-2 mb-4">{formData.resumeFile?.name}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelUpload}
                            className="rounded-full border-2 border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500"
                          >
                            Cancel Upload
                          </Button>
                          <p className="text-xs text-gray-400 mt-2">Auto-cancels after 30 seconds</p>
                        </div>
                      )}

                      {/* Show error state with retry */}
                      {uploadState.status === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                          <p className="text-red-600 font-medium mb-2">Upload failed</p>
                          <p className="text-sm text-gray-600 mb-4">{uploadState.error || "Something went wrong"}</p>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                            id="resume-retry"
                          />
                          <label htmlFor="resume-retry">
                            <Button variant="outline" size="sm" className="rounded-full border-2 border-red-300 text-red-600 hover:bg-red-50">
                              <Upload className="w-4 h-4 mr-2" />
                              Try Again
                            </Button>
                          </label>
                        </div>
                      )}

                      {/* Show upload area only when not uploading and no success */}
                      {!formData.resumeUrl && uploadState.status !== 'uploading' && uploadState.status !== 'error' && (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-gray-50">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                            id="resume"
                          />
                          <label htmlFor="resume" className="cursor-pointer">
                            <Upload className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                            <p className="text-gray-900 font-medium mb-2">Click to upload resume</p>
                            <p className="text-gray-500 text-sm">or drag and drop</p>
                            <p className="text-xs text-gray-400 mt-2">Max file size: 5MB</p>
                          </label>
                        </div>
                      )}

                      {/* Show success state */}
                      {formData.resumeUrl && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                          <FileText className="w-10 h-10 text-green-600" />
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 text-sm font-medium truncate">{formData.resumeFile?.name}</p>
                            <p className="text-green-600 text-xs flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Successfully uploaded
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setFormData(prev => ({ ...prev, resumeFile: null, resumeUrl: "" }))
                              resetUpload()
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter" className="text-gray-700">Cover Letter</Label>
                      <p className="text-sm text-gray-500 mb-2">Tell us why you&apos;re interested in this position (optional)</p>
                      <Textarea
                        id="coverLetter"
                        value={formData.coverLetter}
                        onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                        className="bg-white border-2 border-gray-200 text-gray-900 focus:border-blue-500 rounded-xl min-h-[200px]"
                        placeholder="Dear Hiring Manager..."
                      />
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Review Your Application</h3>
                      
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Name</p>
                            <p className="text-gray-900 font-medium">{formData.firstName} {formData.lastName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Email</p>
                            <p className="text-gray-900 font-medium">{formData.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="text-gray-900 font-medium">{formData.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Location</p>
                            <p className="text-gray-900 font-medium">{formData.location}</p>
                          </div>
                        </div>

                        {formData.resumeFile && (
                          <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-900">{formData.resumeFile.name}</span>
                          </div>
                        )}

                        {formData.coverLetter && (
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-gray-500 text-sm mb-1">Cover Letter</p>
                            <p className="text-sm text-gray-900 line-clamp-3">{formData.coverLetter}</p>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-600">
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
                    className="border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 rounded-full disabled:opacity-50"
                  >
                    Back
                  </Button>
                  
                  {currentStep < STEPS.length - 1 ? (
                    <Button
                      onClick={nextStep}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !formData.resumeUrl}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
