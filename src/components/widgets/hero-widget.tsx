"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import Image from "next/image"
import type { PageSection } from "./types"

interface HeroWidgetProps {
  section: PageSection
}

interface SlideData {
  id: string
  image: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
  buttonPosition: string
}

interface HeroContent {
  sliderType?: string
  autoPlay?: boolean
  autoPlayDelay?: number
  showDots?: boolean
  showArrows?: boolean
  slides?: SlideData[]
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  showScrollIndicator?: boolean
  overlayOpacity?: number
}

export function HeroWidget({ section }: HeroWidgetProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Parse content - handle both string and object
  let content: any = {}
  try {
    if (typeof section.content === 'string') {
      content = JSON.parse(section.content || "{}")
    } else {
      content = section.content || {}
    }
  } catch {
    // Use defaults
  }
  
  // Extract properties from content (support both old and new field names)
  const headline = content.headline || section.title || "Welcome"
  const subheadline = content.subheadline || content.subtitle || ""
  const ctaText = content.ctaText || content.buttonText || "Get Started"
  const ctaLink = content.ctaLink || content.buttonLink || "#contact"
  const backgroundImage = content.backgroundImage || section.image || ""
  
  const {
    sliderType = "fade",
    autoPlay = true,
    autoPlayDelay = 5,
    showDots = true,
    showArrows = true,
    slides = [],
    secondaryButtonText = "",
    secondaryButtonLink = "",
    showScrollIndicator = true,
    overlayOpacity = 50
  } = content
  
  // Use slides if available, otherwise create single slide from section data
  const heroSlides: SlideData[] = slides.length > 0 ? slides : [{
    id: "1",
    image: backgroundImage,
    title: headline,
    description: subheadline,
    buttonText: ctaText,
    buttonLink: ctaLink,
    buttonPosition: "center"
  }]
  
  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || heroSlides.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, autoPlayDelay * 1000)
    
    return () => clearInterval(interval)
  }, [autoPlay, autoPlayDelay, heroSlides.length])
  
  const goToSlide = (index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }
  
  const nextSlide = () => {
    goToSlide((currentSlide + 1) % heroSlides.length)
  }
  
  const prevSlide = () => {
    goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)
  }
  
  // Get button position classes
  const getButtonPosition = (position: string) => {
    const positions: Record<string, string> = {
      "top-left": "items-start justify-start",
      "top-center": "items-start justify-center",
      "top-right": "items-start justify-end",
      "center-left": "items-center justify-start",
      "center": "items-center justify-center",
      "center-right": "items-center justify-end",
      "bottom-left": "items-end justify-start",
      "bottom-center": "items-end justify-center",
      "bottom-right": "items-end justify-end"
    }
    return positions[position] || "items-center justify-center"
  }
  
  // Get animation class
  const getAnimationClass = () => {
    switch (sliderType) {
      case "slide":
        return "transition-transform duration-500 ease-in-out"
      case "fade":
      default:
        return "transition-opacity duration-500 ease-in-out"
    }
  }
  
  // Single slide hero (no slider)
  if (heroSlides.length === 1) {
    const slide = heroSlides[0]
    return (
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center bg-stone-900 text-white overflow-hidden">
        {slide.image && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={slide.image} 
              alt={slide.title} 
              fill 
              className="object-cover" 
              style={{ opacity: (100 - overlayOpacity) / 100 }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10">
          <div className={`flex flex-col min-h-[70vh] md:min-h-[80vh] py-20 ${getButtonPosition(slide.buttonPosition)}`}>
            <div className="max-w-3xl">
              {subheadline && (
                <p className="text-amber-400 font-medium mb-4 text-lg">{subheadline}</p>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-stone-300 mb-8 max-w-2xl">
                {slide.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg"
                  asChild
                >
                  <a href={slide.buttonLink}>
                    {slide.buttonText} <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                {secondaryButtonText && (
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-stone-900 px-8 py-6 text-lg"
                    asChild
                  >
                    <a href={secondaryButtonLink || "#"}>{secondaryButtonText}</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {showScrollIndicator && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <ChevronDown className="h-8 w-8 text-white/60" />
            </div>
          )}
        </div>
      </section>
    )
  }
  
  // Multi-slide hero with slider
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] bg-stone-900 text-white overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 ${getAnimationClass()} ${
              sliderType === "fade" 
                ? index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                : index === currentSlide ? "translate-x-0 z-10" : index < currentSlide ? "-translate-x-full z-0" : "translate-x-full z-0"
            }`}
          >
            {slide.image && (
              <div className="absolute inset-0 z-0">
                <Image 
                  src={slide.image} 
                  alt={slide.title} 
                  fill 
                  className="object-cover"
                  style={{ opacity: (100 - overlayOpacity) / 100 }}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
              </div>
            )}
            
            <div className="container mx-auto px-4 relative z-10 h-full">
              <div className={`flex flex-col min-h-[70vh] md:min-h-[80vh] py-20 ${getButtonPosition(slide.buttonPosition)}`}>
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    {slide.title || section.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-stone-300 mb-8 max-w-2xl">
                    {slide.description}
                  </p>
                  {slide.buttonText && (
                    <Button 
                      className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg"
                      asChild
                    >
                      <a href={slide.buttonLink}>
                        {slide.buttonText} <ArrowRight className="ml-2 h-5 w-5" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      {showArrows && heroSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}
      
      {/* Dots Navigation */}
      {showDots && heroSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-amber-600" : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
