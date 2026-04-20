"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { PageSection } from "./types"

interface BeforeAfterWidgetProps {
  section: PageSection
}

interface BeforeAfterItem {
  id: string
  title: string
  beforeImage: string
  afterImage: string
  description?: string
}

export function BeforeAfterWidget({ section }: BeforeAfterWidgetProps) {
  let items: BeforeAfterItem[] = []
  try {
    // Parse content - handle both string and object
    let parsedContent: any
    if (typeof section.content === 'string') {
      parsedContent = JSON.parse(section.content || "[]")
    } else {
      parsedContent = section.content
    }
    
    // Content might be { items: [...] } or just [...]
    items = parsedContent?.items || parsedContent || []
    
    // Ensure it's an array
    if (!Array.isArray(items)) {
      items = []
    }
  } catch {
    items = [
      {
        id: "1",
        title: "Kitchen Renovation",
        beforeImage: "",
        afterImage: "",
        description: "Complete kitchen transformation"
      },
      {
        id: "2",
        title: "Office Building",
        beforeImage: "",
        afterImage: "",
        description: "Commercial space renovation"
      }
    ]
  }

  const [currentIndex, setCurrentIndex] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)

  if (items.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          {section.title && <h2 className="text-3xl font-bold mb-4 text-foreground">{section.title}</h2>}
          <p className="text-muted-foreground">No before/after images available</p>
        </div>
      </section>
    )
  }

  const currentItem = items[currentIndex]

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
    setSliderPosition(50)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
    setSliderPosition(50)
  }

  // Handle content as string or object
  const contentText = typeof section.content === 'string' 
    ? section.content 
    : section.content?.text || ''

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-4 text-center text-foreground">{section.title}</h2>}
        {contentText && <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">{contentText}</p>}
        
        <div className="max-w-4xl mx-auto">
          {/* Comparison Slider */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            {/* After Image (Full width) */}
            <div className="absolute inset-0">
              {currentItem.afterImage ? (
                <Image 
                  src={currentItem.afterImage} 
                  alt="After" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary">
                  <span className="text-primary font-semibold text-2xl">AFTER</span>
                </div>
              )}
            </div>

            {/* Before Image (Clipped) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              {currentItem.beforeImage ? (
                <Image 
                  src={currentItem.beforeImage} 
                  alt="Before" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground font-semibold text-2xl">BEFORE</span>
                </div>
              )}
            </div>

            {/* Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-background cursor-ew-resize shadow-lg"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full shadow-lg flex items-center justify-center border border-border">
                <ChevronLeft className="h-4 w-4 text-foreground" />
                <ChevronRight className="h-4 w-4 text-foreground" />
              </div>
            </div>

            {/* Slider Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-foreground/70 text-background px-3 py-1 rounded text-sm font-medium">
              Before
            </div>
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-medium">
              After
            </div>
          </div>

          {/* Item Info */}
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold text-foreground">{currentItem.title}</h3>
            {currentItem.description && (
              <p className="text-muted-foreground mt-2">{currentItem.description}</p>
            )}
          </div>

          {/* Navigation */}
          {items.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-card shadow hover:bg-accent transition-colors border border-border"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
              <div className="flex gap-2">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx)
                      setSliderPosition(50)
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-card shadow hover:bg-accent transition-colors border border-border"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
