"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, CheckCircle2, Loader2, Sparkles, Send, Bell, Shield } from "lucide-react"
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

  // Check if using dark background
  const isDarkBg = backgroundColor === '#111827' || 
                   backgroundColor === '#000000' ||
                   backgroundColor === 'black' ||
                   backgroundColor?.toLowerCase().includes('gray-900')

  return (
    <section 
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: isDarkBg ? undefined : backgroundColor }}
    >
      {/* Decorative background */}
      {isDarkBg ? (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Icon Badge */}
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25"
          >
            <Mail className="h-8 w-8 text-white" />
          </motion.div>
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white/80 text-sm font-medium">Stay Updated</span>
          </motion.div>
          
          {section.title && (
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: isDarkBg ? '#ffffff' : textColor }}
            >
              {section.title}
            </motion.h2>
          )}
          
          {contentText && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-lg mb-8"
              style={{ color: isDarkBg ? '#ffffff99' : textColor, opacity: isDarkBg ? 1 : 0.7 }}
            >
              {contentText}
            </motion.p>
          )}

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-lg font-medium" style={{ color: isDarkBg ? '#ffffff' : textColor }}>
                  {successMessage}
                </span>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit} 
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    placeholder={placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 h-14 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-white/40 focus:bg-white/15 transition-all"
                    style={{ 
                      backgroundColor: isDarkBg ? undefined : buttonColor,
                      color: isDarkBg ? '#ffffff' : buttonTextColor
                    }}
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    disabled={status === "loading"}
                    className="h-14 px-8 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 text-white border-0 rounded-xl font-semibold transition-all disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        {buttonText}
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Trust badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap justify-center items-center gap-6"
          >
            <div className="flex items-center gap-2 text-sm" style={{ color: isDarkBg ? '#ffffff80' : textColor, opacity: isDarkBg ? 1 : 0.6 }}>
              <Bell className="w-4 h-4" />
              <span>Weekly updates</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: isDarkBg ? '#ffffff80' : textColor, opacity: isDarkBg ? 1 : 0.6 }}>
              <Shield className="w-4 h-4" />
              <span>No spam</span>
            </div>
          </motion.div>

          {showPrivacyText && (
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="text-sm mt-6"
              style={{ color: isDarkBg ? '#ffffff60' : textColor, opacity: isDarkBg ? 1 : 0.5 }}
            >
              {privacyText}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
