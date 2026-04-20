"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import type { PageSection } from "./types"

interface FeaturesWidgetProps {
  section: PageSection
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
      { title: "Quality Assurance", description: "Rigorous quality control on every project" },
      { title: "Expert Team", description: "Skilled professionals with years of experience" },
      { title: "On-Time Delivery", description: "Projects completed within agreed timelines" },
      { title: "Safety First", description: "Strict adherence to safety protocols" },
    ]
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-12 text-center text-foreground">{section.title}</h2>}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature: any, index: number) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow bg-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <CheckCircle className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
