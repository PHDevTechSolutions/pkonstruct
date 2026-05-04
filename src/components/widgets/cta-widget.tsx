"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, ChevronRight } from "lucide-react"
import type { PageSection } from "./types"

interface CTAWidgetProps {
  section: PageSection
}

export function CTAWidget({ section }: CTAWidgetProps) {
  // Parse content data from admin
  const contentData = typeof section.content === 'string' 
    ? {} 
    : section.content || {}
  
  const contentText = typeof section.content === 'string' 
    ? section.content 
    : contentData?.subtitle || ''
  
  // Customization options
  const buttonText = contentData?.buttonText || "Get Started"
  const buttonLink = contentData?.buttonLink || "#contact"
  const backgroundColor = contentData?.backgroundColor || "#111827"
  const textColor = contentData?.textColor || "#ffffff"
  const buttonColor = contentData?.buttonColor || "#ffffff"
  const buttonTextColor = contentData?.buttonTextColor || "#111827"
  const showSecondaryButton = contentData?.showSecondaryButton === true
  const secondaryButtonText = contentData?.secondaryButtonText || "Learn More"
  const secondaryButtonLink = contentData?.secondaryButtonLink || "#about"
  const alignment: 'left' | 'center' | 'right' = contentData?.alignment || "center"
  
  const alignmentClasses: Record<string, string> = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end"
  }
  const alignmentClass = alignmentClasses[alignment] || "text-center items-center"

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
      
      <div className={`container mx-auto px-4 relative z-10 flex flex-col ${alignmentClass}`}>
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
        >
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-white/80 text-sm font-medium">Take Action</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-4xl" 
          style={{ color: isDarkBg ? '#ffffff' : textColor }}
        >
          {section.title}
        </motion.h2>
        
        {contentText && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl"
            style={{ 
              color: isDarkBg ? '#ffffff99' : textColor,
              opacity: isDarkBg ? 1 : 0.8
            }}
          >
            {contentText}
          </motion.p>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className={`flex flex-wrap gap-4 ${alignment === 'center' ? 'justify-center' : alignment === 'left' ? 'justify-start' : 'justify-end'}`}
        >
          <Link href={buttonLink}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 text-white border-0 rounded-xl group"
              >
                {buttonText}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </Link>
          {showSecondaryButton && (
            <Link href={secondaryButtonLink}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 rounded-xl group"
                >
                  {secondaryButtonText}
                  <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}
