"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
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
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }
  const alignmentClass = alignmentClasses[alignment] || "text-center"

  return (
    <section 
      className="py-20" 
      style={{ backgroundColor }}
    >
      <div className={`container mx-auto px-4 ${alignmentClass}`}>
        <h2 
          className="text-3xl md:text-4xl font-bold mb-4" 
          style={{ color: textColor }}
        >
          {section.title}
        </h2>
        {contentText && (
          <p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            style={{ 
              color: textColor,
              opacity: 0.7,
              marginLeft: alignment === 'left' ? 0 : alignment === 'right' ? 'auto' : 'auto',
              marginRight: alignment === 'left' ? 'auto' : alignment === 'right' ? 0 : 'auto'
            }}
          >
            {contentText}
          </p>
        )}
        <div className={`flex flex-wrap gap-4 ${alignment === 'center' ? 'justify-center' : alignment === 'left' ? 'justify-start' : 'justify-end'}`}>
          <Link href={buttonLink}>
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg border-0"
              style={{ 
                backgroundColor: buttonColor, 
                color: buttonTextColor 
              }}
            >
              {buttonText}
            </Button>
          </Link>
          {showSecondaryButton && (
            <Link href={secondaryButtonLink}>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-6 text-lg border-2"
                style={{ 
                  borderColor: textColor,
                  color: textColor,
                  backgroundColor: 'transparent'
                }}
              >
                {secondaryButtonText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
