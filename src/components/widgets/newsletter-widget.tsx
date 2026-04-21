"use client"

import { useState } from "react"
import { Mail, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { PageSection } from "./types"

interface NewsletterWidgetProps {
  section: PageSection
}

export function NewsletterWidget({ section }: NewsletterWidgetProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  // Parse content data from admin
  const contentData = typeof section.content === 'string' 
    ? {} 
    : section.content || {}
  
  const contentText = typeof section.content === 'string' 
    ? section.content 
    : contentData?.text || ''
  
  // Customization options
  const buttonText = contentData?.buttonText || "Subscribe"
  const placeholder = contentData?.placeholder || "Enter your email"
  const backgroundColor = contentData?.backgroundColor || "#111827"
  const textColor = contentData?.textColor || "#ffffff"
  const buttonColor = contentData?.buttonColor || "#ffffff"
  const buttonTextColor = contentData?.buttonTextColor || "#111827"
  const successMessage = contentData?.successMessage || "Thank you for subscribing!"
  const showPrivacyText = contentData?.showPrivacyText !== false
  const privacyText = contentData?.privacyText || "We respect your privacy. Unsubscribe at any time."

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    // Simulate API call - replace with actual newsletter signup
    setTimeout(() => {
      setStatus("success")
      setEmail("")
    }, 1500)
  }

  return (
    <section 
      className="py-20"
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div 
            className="w-12 h-12 flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: textColor, opacity: 0.1 }}
          >
            <Mail className="h-6 w-6" style={{ color: textColor }} />
          </div>
          
          {section.title && (
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ color: textColor }}
            >
              {section.title}
            </h2>
          )}
          
          {contentText && (
            <p 
              className="text-lg mb-8"
              style={{ color: textColor, opacity: 0.7 }}
            >
              {contentText}
            </p>
          )}

          {status === "success" ? (
            <div 
              className="flex items-center justify-center gap-2"
              style={{ color: textColor }}
            >
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg">{successMessage}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 border-0 h-12 rounded-none"
                style={{ 
                  backgroundColor: buttonColor,
                  color: buttonTextColor
                }}
              />
              <Button 
                type="submit" 
                disabled={status === "loading"}
                className="h-12 px-8 border-0 rounded-none hover:opacity-90"
                style={{ 
                  backgroundColor: buttonColor, 
                  color: buttonTextColor 
                }}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  buttonText
                )}
              </Button>
            </form>
          )}

          {showPrivacyText && (
            <p 
              className="text-sm mt-4"
              style={{ color: textColor, opacity: 0.5 }}
            >
              {privacyText}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
