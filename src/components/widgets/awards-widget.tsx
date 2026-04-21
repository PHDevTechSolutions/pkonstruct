"use client"

import { Award, Trophy, Star, Medal, ArrowUpRight } from "lucide-react"
import type { PageSection } from "./types"

interface AwardsWidgetProps {
  section: PageSection
}

interface AwardItem {
  id: string
  title: string
  organization: string
  year: string
  description?: string
  icon?: "award" | "trophy" | "star" | "medal"
}

const iconMap = {
  award: Award,
  trophy: Trophy,
  star: Star,
  medal: Medal
}

export function AwardsWidget({ section }: AwardsWidgetProps) {
  let awards: AwardItem[] = []
  try {
    // Parse content - handle both string and object
    let parsedContent: any
    if (typeof section.content === 'string') {
      parsedContent = JSON.parse(section.content || "[]")
    } else {
      parsedContent = section.content
    }
    
    // Content might be { awards: [...] } or just [...]
    awards = parsedContent?.awards || parsedContent || []
    
    // Ensure it's an array
    if (!Array.isArray(awards)) {
      awards = []
    }
  } catch {
    awards = [
      {
        id: "1",
        title: "Best Construction Company",
        organization: "Philippine Construction Awards",
        year: "2023",
        description: "Recognized for excellence in commercial construction",
        icon: "trophy"
      },
      {
        id: "2",
        title: "Safety Excellence Award",
        organization: "OSHA Philippines",
        year: "2023",
        description: "Zero accidents for 3 consecutive years",
        icon: "award"
      },
      {
        id: "3",
        title: "Green Building Champion",
        organization: "PHILGBC",
        year: "2022",
        description: "Leadership in sustainable construction practices",
        icon: "star"
      },
      {
        id: "4",
        title: "Innovation in Design",
        organization: "Architectural Digest",
        year: "2022",
        description: "Most innovative residential project design",
        icon: "medal"
      }
    ]
  }

  // Handle content as string or object
  const contentText = typeof section.content === 'string' 
    ? section.content 
    : section.content?.text || ''

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Clean Header */}
        <div className="mb-16">
          {section.title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
          )}
          <div className="w-20 h-1 bg-gray-900 rounded-full" />
          {contentText && (
            <p className="text-gray-600 mt-4 max-w-2xl">{contentText}</p>
          )}
        </div>
        
        {/* Awards Grid - Minimal Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award, index) => {
            const IconComponent = iconMap[award.icon || "award"] || Award
            return (
              <div 
                key={award.id || `award-${index}`} 
                className="group border border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white"
              >
                <div className="p-6">
                  {/* Year badge */}
                  <span className="text-xs font-mono text-gray-400 mb-4 block">
                    {award.year}
                  </span>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-900 transition-colors duration-300">
                    <IconComponent className="h-6 w-6 text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {award.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    {award.organization}
                  </p>
                  {award.description && (
                    <p className="text-gray-400 text-xs">
                      {award.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
