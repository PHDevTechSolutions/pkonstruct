"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import type { PageSection } from "./types"
import { FileText, Sparkles, Quote, BookOpen, AlignLeft } from "lucide-react"

interface TextWidgetProps {
  section: PageSection
}

export function TextWidget({ section }: TextWidgetProps) {
  // Parse content data from admin
  const contentData = typeof section.content === 'string' 
    ? {} 
    : section.content || {}
  
  const content = typeof section.content === 'string' 
    ? section.content 
    : contentData?.text || ''
  
  const layout = contentData?.layout || 'centered'
  const highlight = contentData?.highlight || null
  
  // Customization options
  const backgroundColor = contentData?.backgroundColor || "#ffffff"
  const textColor = contentData?.textColor || "#111827"
  const textAlign = contentData?.textAlign || "left"
  const fontSize = contentData?.fontSize || "base"
  
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const paragraphs = content.split('\n').filter((p: string) => p.trim())
  
  // Font size classes
  const fontSizeClasses: Record<string, string> = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  
  const textStyle = {
    backgroundColor,
    color: textColor,
    textAlign: textAlign as any
  }

  // Check if using gradient background
  const isGradientBg = backgroundColor.includes('gradient') || 
                       backgroundColor === 'transparent' ||
                       backgroundColor === '#ffffff' ||
                       backgroundColor === 'white'

  return (
    <section 
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: isGradientBg ? undefined : backgroundColor }}
    >
      {/* Decorative background for light backgrounds */}
      {isGradientBg && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`${
          layout === 'split' ? 'grid lg:grid-cols-2 gap-12 items-center' : 
          layout === 'wide' ? 'max-w-4xl mx-auto' : 
          layout === 'full' ? 'w-full' :
          'max-w-4xl mx-auto'
        }`}>
          
          {/* Title Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={layout === 'split' || layout === 'full' ? '' : 'mb-12'} 
            style={{ textAlign: textAlign as any }}
          >
            {section.title && (
              <div>
                {/* Modern badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-4 py-2 mb-6"
                >
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 text-sm font-semibold">About Us</span>
                </motion.div>
                
                {/* Gradient accent line */}
                <div 
                  className="w-24 h-1.5 rounded-full mb-6 bg-gradient-to-r from-blue-500 to-indigo-500" 
                  style={{ 
                    marginLeft: textAlign === 'center' ? 'auto' : textAlign === 'right' ? 'auto' : 0,
                    marginRight: textAlign === 'center' ? 'auto' : textAlign === 'left' ? 'auto' : 0
                  }} 
                />
                
                <h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                  style={{ color: textColor }}
                >
                  {section.title}
                </h2>
              </div>
            )}
            
            {/* Highlight Box - Modern */}
            {highlight && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={`p-5 rounded-2xl border border-blue-200 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md shadow-blue-100/50 ${layout === 'split' || layout === 'full' ? '' : 'max-w-2xl'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">{highlight}</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Content Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            {/* Quote decoration for left-aligned */}
            {textAlign === 'left' && (
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center opacity-50">
                <Quote className="w-6 h-6 text-blue-400" />
              </div>
            )}
            
            <div 
              className={`text-widget-content ${fontSizeClasses[fontSize] || 'text-lg'} leading-relaxed`} 
              style={{ 
                color: textColor,
                textAlign: textAlign as any
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
            
            {/* Decorative element at bottom */}
            {content && (
              <motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                animate={isVisible ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-12 flex items-center gap-4" 
                style={{ 
                  justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'
                }}
              >
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <AlignLeft className="w-4 h-4 text-blue-600" />
                </div>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
