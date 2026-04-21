"use client"

import { useEffect, useRef, useState } from "react"
import { 
  CheckCircle, 
  Shield, 
  Zap, 
  Clock, 
  Award, 
  Users, 
  Target, 
  Heart,
  Lightbulb,
  TrendingUp,
  Headphones,
  Wrench
} from "lucide-react"
import type { PageSection } from "./types"

interface FeaturesWidgetProps {
  section: PageSection
}

const iconMap: Record<string, React.ReactNode> = {
  "check": <CheckCircle className="w-7 h-7" />,
  "shield": <Shield className="w-7 h-7" />,
  "zap": <Zap className="w-7 h-7" />,
  "clock": <Clock className="w-7 h-7" />,
  "award": <Award className="w-7 h-7" />,
  "users": <Users className="w-7 h-7" />,
  "target": <Target className="w-7 h-7" />,
  "heart": <Heart className="w-7 h-7" />,
  "lightbulb": <Lightbulb className="w-7 h-7" />,
  "trending": <TrendingUp className="w-7 h-7" />,
  "support": <Headphones className="w-7 h-7" />,
  "wrench": <Wrench className="w-7 h-7" />,
}

export function FeaturesWidget({ section }: FeaturesWidgetProps) {
  let features = []
  try {
    // Parse content - handle both string and object
    let parsedContent: any
    if (typeof section.content === 'string') {
      parsedContent = JSON.parse(section.content || "[]")
    } else {
      parsedContent = section.content
    }
    
    // Content might be { features: [...] } or just [...]
    features = parsedContent?.features || parsedContent || []
    
    // Ensure it's an array
    if (!Array.isArray(features)) {
      features = []
    }
  } catch {
    features = [
      { title: "Quality Assurance", description: "Rigorous quality control on every project", icon: "shield" },
      { title: "Expert Team", description: "Skilled professionals with years of experience", icon: "users" },
      { title: "On-Time Delivery", description: "Projects completed within agreed timelines", icon: "clock" },
      { title: "Safety First", description: "Strict adherence to safety protocols", icon: "check" },
    ]
  }

  const contentText = typeof section.content === 'object' ? section.content?.text : ''
  const columns = typeof section.content === 'object' ? section.content?.columns || 4 : 4

  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setVisibleItems((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    )

    const items = containerRef.current?.querySelectorAll('[data-index]')
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  const getGridCols = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 md:grid-cols-2'
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      case 5: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      case 6: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Clean Header */}
        <div className="mb-12">
          {section.title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
          )}
          <div className="w-20 h-1 bg-gray-900 rounded-full" />
          {contentText && (
            <p className="text-gray-600 mt-4 max-w-2xl">{contentText}</p>
          )}
        </div>

        {/* Features Grid - Clean Cards */}
        <div ref={containerRef} className={`grid ${getGridCols()} gap-6`}>
          {features.map((feature: any, index: number) => {
            const iconKey = feature.icon || Object.keys(iconMap)[index % Object.keys(iconMap).length]
            const Icon = iconMap[iconKey] || iconMap["check"]
            const isVisible = visibleItems.includes(index)
            
            return (
              <div
                key={index}
                data-index={index}
                className={`group border border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gray-100 group-hover:bg-gray-900 transition-all duration-300 text-gray-600 group-hover:text-white">
                    {Icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
