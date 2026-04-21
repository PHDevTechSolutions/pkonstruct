"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, User, Mail, MessageSquare, Loader2, CheckCircle, ArrowRight, MapPin, Phone, Upload, File } from "lucide-react"
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
    const baseInputClass = "w-full px-4 py-3 bg-white border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
    
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
    switch (fieldName) {
      case 'name': return <User className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      case 'address': return <MapPin className="w-4 h-4" />
      case 'message': return <MessageSquare className="w-4 h-4" />
      default: return <MessageSquare className="w-4 h-4" />
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Clean Header */}
        <div className="mb-12 text-center">
          {section.title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
          )}
          {section.title && <div className="w-20 h-1 bg-gray-900 rounded-full mx-auto mb-4" />}
          {contentText && (
            <p className="text-gray-600 max-w-xl mx-auto">{contentText}</p>
          )}
        </div>

        {/* Contact Form - Clean Card */}
        <div className="border border-gray-200 bg-white">
          <div className="p-8 md:p-10">
            {isSubmitted ? (
              /* Success State */
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-100">
                  <CheckCircle className="w-8 h-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Message Sent!</h3>
                <p className="text-gray-500 mb-6">We'll get back to you within 24 hours.</p>
                <button 
                  onClick={() => {
                    setIsSubmitted(false)
                    setFormData(buildInitialFormData())
                    setUploadedFiles([])
                  }}
                  className="px-6 py-3 border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all text-sm font-medium"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Dynamic Form Fields */}
                <div className="grid md:grid-cols-2 gap-5">
                  {formFields.map((field) => (
                    <div 
                      key={field.name} 
                      className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}
                    >
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {getFieldIcon(field.name)}
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}
                  
                  {/* Optional Phone Field */}
                  {config.showPhone && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  )}
                  
                  {/* Optional Address Field */}
                  {config.showAddress && (
                    <div className={`space-y-2 ${config.showPhone ? 'md:col-span-2' : ''}`}>
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Address
                      </label>
                      <textarea
                        value={formData.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Your address..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400 resize-none"
                      />
                    </div>
                  )}
                </div>

                {/* File Upload */}
                {config.showFileUpload && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Attachments
                    </label>
                    <div className="border-2 border-dashed border-gray-200 hover:border-gray-900 transition-colors p-6 text-center">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500 mb-1">Click to upload files</p>
                        <p className="text-xs text-gray-400">PDF, Word, or Images up to 10MB</p>
                      </label>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <File className="w-4 h-4" />
                              <span>{file.name}</span>
                              <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="p-4 border border-red-200 bg-red-50 text-red-600 text-sm">
                    {submitError}
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-base font-medium bg-gray-900 hover:bg-gray-800 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-gray-900" />
            <span>Reply within 24h</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-gray-900" />
            <span>Secure & Confidential</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-gray-900" />
            <span>No spam, ever</span>
          </div>
        </div>
      </div>
    </section>
  )
}
