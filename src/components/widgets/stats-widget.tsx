"use client"

import type { PageSection } from "./types"

interface StatsWidgetProps {
  section: PageSection
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
      { label: "Projects Completed", value: "500+" },
      { label: "Years Experience", value: "19" },
      { label: "Team Members", value: "150+" },
      { label: "Client Satisfaction", value: "99%" },
    ]
  }

  return (
    <section className="py-16 bg-stone-900 text-white">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-12 text-center">{section.title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat: any, index: number) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">{stat.value}</div>
              <div className="text-stone-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
