"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Send, 
  User, 
  Mail, 
  MessageSquare, 
  Loader2, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Upload, 
  File,
  Sparkles,
  MessageCircle,
  Clock,
  Shield,
  X
} from "lucide-react"
import { useInquiries } from "@/hooks/use-inquiries"
import type { PageSection } from "./types"

interface ContactWidgetProps {
  section: PageSection
}

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'file' | 'address'
  required?: boolean
  placeholder?: string
}

export function ContactWidget({ section }: ContactWidgetProps) {
  const contentObj = typeof section.content === 'string' ? {} : section.content || {}
  const contentText = typeof section.content === 'string' ? section.content : contentObj?.text || ''
  
  // Parse configuration from admin (showName, showEmail, nameLabel, etc.)
  const config = {
    showName: contentObj?.showName !== false,
    showEmail: contentObj?.showEmail !== false,
    showPhone: contentObj?.showPhone !== false,
    showAddress: contentObj?.showAddress === true,
    showSubject: contentObj?.showSubject !== false,
    showMessage: contentObj?.showMessage !== false,
    showFileUpload: contentObj?.showFileUpload === true,
    nameLabel: contentObj?.nameLabel || 'Your Name',
    emailLabel: contentObj?.emailLabel || 'Email Address',
    phoneLabel: contentObj?.phoneLabel || 'Phone Number',
    addressLabel: contentObj?.addressLabel || 'Address',
    subjectLabel: contentObj?.subjectLabel || 'Subject',
    messageLabel: contentObj?.messageLabel || 'Your Message',
    buttonText: contentObj?.submitButtonText || contentObj?.buttonText || 'Send Message',
  }
  
  // Build form fields based on admin configuration
  const formFields: FormField[] = []
  if (config.showName) {
    formFields.push({ name: 'name', label: config.nameLabel, type: 'text', required: true, placeholder: 'John Doe' })
  }
  if (config.showEmail) {
    formFields.push({ name: 'email', label: config.emailLabel, type: 'email', required: true, placeholder: 'john@example.com' })
  }
  if (config.showSubject) {
    formFields.push({ name: 'subject', label: config.subjectLabel, type: 'text', required: true, placeholder: 'How can we help you?' })
  }
  if (config.showMessage) {
    formFields.push({ name: 'message', label: config.messageLabel, type: 'textarea', required: true, placeholder: 'Tell us about your project...' })
  }
  
  // Build initial form data based on fields
  const buildInitialFormData = () => {
    const initial: Record<string, string> = {}
    formFields.forEach(field => {
      initial[field.name] = ''
    })
    if (config.showPhone) initial.phone = ''
    if (config.showAddress) initial.address = ''
    return initial
  }
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>(buildInitialFormData())
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { createInquiry } = useInquiries()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const inquiryData: any = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Contact Form Submission',
        message: formData.message || formData.address || 'No message provided',
      }
      
      // Add optional fields if they exist
      if (formData.phone) inquiryData.phone = formData.phone
      if (formData.address) inquiryData.address = formData.address
      if (uploadedFiles.length > 0) {
        inquiryData.hasAttachments = true
        inquiryData.fileCount = uploadedFiles.length
      }
      
      await createInquiry(inquiryData)
      setIsSubmitted(true)
    } catch (err) {
      setSubmitError("Failed to send message. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files))
    }
  }

  const renderField = (field: FormField) => {
    const baseInputClass = "w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            required={field.required}
            rows={5}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`${baseInputClass} resize-none`}
          />
        )
      case 'email':
        return (
          <input
            type="email"
            required={field.required}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
          />
        )
      case 'tel':
        return (
          <input
            type="tel"
            required={field.required}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder || '+1 (555) 123-4567'}
            className={baseInputClass}
          />
        )
      default:
        return (
          <input
            type="text"
            required={field.required}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
          />
        )
    }
  }

  const getFieldIcon = (fieldName: string) => {
    const iconClass = "w-4 h-4 text-blue-600"
    switch (fieldName) {
      case 'name': return <User className={iconClass} />
      case 'email': return <Mail className={iconClass} />
      case 'phone': return <Phone className={iconClass} />
      case 'address': return <MapPin className={iconClass} />
      case 'message': return <MessageSquare className={iconClass} />
      default: return <MessageSquare className={iconClass} />
    }
  }

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        {/* Modern Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-4 py-2 mb-6">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-semibold">Get in Touch</span>
          </div>
          {section.title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
          )}
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6" />
          {contentText && (
            <p className="text-gray-600 text-lg max-w-xl mx-auto">{contentText}</p>
          )}
        </motion.div>

        {/* Contact Form - Modern Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
        >
          <div className="p-8 md:p-10">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                /* Success State */
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/25"
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Message Sent!</h3>
                  <p className="text-gray-500 mb-8">We'll get back to you within 24 hours.</p>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData(buildInitialFormData())
                      setUploadedFiles([])
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                /* Form */
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  {/* Dynamic Form Fields */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {formFields.map((field, index) => (
                      <motion.div 
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}
                      >
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          {getFieldIcon(field.name)}
                          {field.label}
                          {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {renderField(field)}
                      </motion.div>
                    ))}
                    
                    {/* Optional Phone Field */}
                    {config.showPhone && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: formFields.length * 0.05 }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          {config.phoneLabel}
                        </label>
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                        />
                      </motion.div>
                    )}
                    
                    {/* Optional Address Field */}
                    {config.showAddress && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (formFields.length + 1) * 0.05 }}
                        className={`space-y-2 ${config.showPhone ? 'md:col-span-2' : ''}`}
                      >
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          {config.addressLabel}
                        </label>
                        <textarea
                          value={formData.address || ''}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Your address..."
                          rows={3}
                          className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 resize-none hover:border-gray-300"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* File Upload */}
                  {config.showFileUpload && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-blue-600" />
                        Attachments
                      </label>
                      <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50/50 rounded-xl transition-all p-6 text-center">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer block">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Upload className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Click to upload files</p>
                          <p className="text-xs text-gray-400">PDF, Word, or Images up to 10MB</p>
                        </label>
                        {uploadedFiles.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <motion.div 
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm"
                              >
                                <File className="w-4 h-4 text-blue-500" />
                                <span className="flex-1 truncate">{file.name}</span>
                                <span className="text-gray-400 text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                <button
                                  type="button"
                                  onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Error Message */}
                  <AnimatePresence>
                    {submitError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
                      >
                        {submitError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.button 
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full py-4 text-base font-semibold bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {config.buttonText}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Trust indicators - Modern Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-wrap justify-center items-center gap-4"
        >
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-md shadow-gray-200/50 border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Reply within 24h</p>
              <p className="text-xs text-gray-500">Quick response guaranteed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-md shadow-gray-200/50 border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Secure & Confidential</p>
              <p className="text-xs text-gray-500">Your data is protected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-md shadow-gray-200/50 border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">No spam, ever</p>
              <p className="text-xs text-gray-500">We respect your privacy</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
