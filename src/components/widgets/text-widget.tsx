"use client"

import { useEffect, useRef, useState } from "react"
import type { PageSection } from "./types"
import { FileText, Sparkles } from "lucide-react"

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

  return (
    <section 
      ref={ref}
      className="py-20"
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4">
        <div className={`${
          layout === 'split' ? 'grid lg:grid-cols-2 gap-12 items-center' : 
          layout === 'wide' ? 'container mx-auto' : 
          layout === 'full' ? 'w-full' :
          'container mx-auto'
        }`}>
          
          {/* Title Section */}
          <div className={layout === 'split' || layout === 'full' ? '' : 'mb-12'} style={{ textAlign: textAlign as any }}>
            {section.title && (
              <div>
                {/* Accent line */}
                <div 
                  className="w-20 h-1 rounded-full mb-6" 
                  style={{ 
                    backgroundColor: textColor,
                    marginLeft: textAlign === 'center' ? 'auto' : textAlign === 'right' ? 'auto' : 0,
                    marginRight: textAlign === 'center' ? 'auto' : textAlign === 'left' ? 'auto' : 0
                  }} 
                />
                
                <h2 
                  className="text-3xl md:text-4xl font-bold mb-6"
                  style={{ color: textColor }}
                >
                  {section.title}
                </h2>
              </div>
            )}
            
            {/* Highlight Box */}
            {highlight && (
              <div className={`p-4 border border-gray-200 mb-8 ${layout === 'split' || layout === 'full' ? '' : 'max-w-2xl'}`} style={{ backgroundColor: `${textColor}10` }}>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: textColor }} />
                  <p style={{ color: textColor }}>{highlight}</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className={`${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          } transition-all duration-700 ease-out`}>
            <div 
              className={`text-widget-content ${fontSizeClasses[fontSize] || 'text-lg'} leading-relaxed`} 
              style={{ 
                color: textColor,
                textAlign: textAlign as any,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s ease-out'
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
            
            {/* Decorative element at bottom */}
            {content && (
              <div className="mt-12 flex items-center gap-4" style={{ 
                justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'
              }}>
                <div className="h-px w-12" style={{ backgroundColor: `${textColor}30` }} />
                <FileText className="w-4 h-4" style={{ color: `${textColor}50` }} />
                <div className="h-px w-12" style={{ backgroundColor: `${textColor}30` }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
