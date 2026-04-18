"use client"

import { Award, Trophy, Star, Medal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
    <section className="py-16 bg-stone-900 text-white">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-4 text-center">{section.title}</h2>}
        {contentText && <p className="text-stone-400 text-center max-w-2xl mx-auto mb-12">{contentText}</p>}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {awards.map((award, index) => {
            const IconComponent = iconMap[award.icon || "award"]
            return (
              <Card key={award.id || `award-${index}`} className="bg-stone-800 border-stone-700">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-amber-500" />
                  </div>
                  <div className="text-amber-500 text-sm font-medium mb-2">
                    {award.year}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {award.title}
                  </h3>
                  <p className="text-stone-400 text-sm mb-2">
                    {award.organization}
                  </p>
                  {award.description && (
                    <p className="text-stone-500 text-sm">
                      {award.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
