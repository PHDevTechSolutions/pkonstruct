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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Clean Header */}
        <div className="mb-12">
          {section.title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
          )}
          <div className="w-20 h-1 bg-gray-900 rounded-full" />
          {contentText && <p className="text-gray-600 mt-4 max-w-2xl">{contentText}</p>}
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Comparison Slider */}
          <div className="relative aspect-video overflow-hidden bg-gray-100">
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
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-900 font-semibold text-2xl">AFTER</span>
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
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <span className="text-gray-600 font-semibold text-2xl">BEFORE</span>
                </div>
              )}
            </div>

            {/* Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white flex items-center justify-center border border-gray-200">
                <ChevronLeft className="h-4 w-4 text-gray-900" />
                <ChevronRight className="h-4 w-4 text-gray-900" />
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
            <div className="absolute top-4 left-4 bg-gray-900 text-white px-4 py-2 text-xs font-medium">
              BEFORE
            </div>
            <div className="absolute top-4 right-4 bg-white text-gray-900 px-4 py-2 text-xs font-medium border border-gray-200">
              AFTER
            </div>
          </div>

          {/* Item Info */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-900">{currentItem.title}</h3>
            {currentItem.description && (
              <p className="text-gray-500 mt-2">{currentItem.description}</p>
            )}
          </div>

          {/* Navigation */}
          {items.length > 1 && (
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={prevSlide}
                className="p-3 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx)
                      setSliderPosition(50)
                    }}
                    className={`h-1 transition-all duration-300 ${
                      idx === currentIndex ? "w-8 bg-gray-900" : "w-4 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="p-3 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
