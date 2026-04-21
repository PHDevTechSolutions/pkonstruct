"use client"

import { useEffect, useState, useRef } from "react"
import type { PageSection } from "./types"
import { TrendingUp, Users, Award, Clock, Building, CheckCircle, Star, Briefcase } from "lucide-react"

interface StatsWidgetProps {
  section: PageSection
}

const iconMap: Record<string, React.ReactNode> = {
  "projects": <Briefcase className="w-6 h-6" />,
  "experience": <Clock className="w-6 h-6" />,
  "team": <Users className="w-6 h-6" />,
  "satisfaction": <Star className="w-6 h-6" />,
  "clients": <Building className="w-6 h-6" />,
  "awards": <Award className="w-6 h-6" />,
  "completed": <CheckCircle className="w-6 h-6" />,
  "growth": <TrendingUp className="w-6 h-6" />,
}

function AnimatedCounter({ value, duration = 2000 }: { value: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState("0")
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          
          // Extract number and suffix (e.g., "500+" → 500, "+")
          const match = value.match(/^(\d+)(.*)$/)
          if (!match) {
            setDisplayValue(value)
            return
          }
          
          const targetNum = parseInt(match[1], 10)
          const suffix = match[2] || ""
          const startTime = Date.now()
          
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const currentNum = Math.floor(easeOutQuart * targetNum)
            
            setDisplayValue(currentNum + suffix)
            
            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setDisplayValue(value)
            }
          }
          
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, duration, hasAnimated])

  return <div ref={ref}>{displayValue}</div>
}

export function StatsWidget({ section }: StatsWidgetProps) {
  let stats = []
  try {
    // Parse content - handle both string and object
    let parsedContent: any
    if (typeof section.content === 'string') {
      parsedContent = JSON.parse(section.content || "[]")
    } else {
      parsedContent = section.content
    }
    
    // Content might be { stats: [...] } or just [...]
    stats = parsedContent?.stats || parsedContent || []
    
    // Ensure it's an array
    if (!Array.isArray(stats)) {
      stats = []
    }
  } catch {
    stats = [
      { label: "Projects Completed", value: "500+", icon: "projects" },
      { label: "Years Experience", value: "19", icon: "experience" },
      { label: "Team Members", value: "150+", icon: "team" },
      { label: "Client Satisfaction", value: "99%", icon: "satisfaction" },
    ]
  }

  const contentText = typeof section.content === 'object' ? section.content?.text : ''

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Clean Header */}
        <div className="mb-12 text-center">
          {section.title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
          )}
          {section.title && <div className="w-20 h-1 bg-gray-900 rounded-full mx-auto" />}
          {contentText && (
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{contentText}</p>
          )}
        </div>

        {/* Stats Grid - Clean Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat: any, index: number) => {
            const iconKey = stat.icon || Object.keys(iconMap)[index % Object.keys(iconMap).length]
            const Icon = iconMap[iconKey] || <TrendingUp className="w-5 h-5" />
            
            return (
              <div
                key={index}
                className="group border border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white p-6 text-center"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-10 h-10 mb-4 bg-gray-100 group-hover:bg-gray-900 transition-all duration-300 text-gray-600 group-hover:text-white">
                  {Icon}
                </div>
                
                {/* Value with animation */}
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter value={stat.value} />
                </div>
                
                {/* Label */}
                <div className="text-gray-500 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
