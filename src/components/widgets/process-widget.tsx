"use client"

import { CheckCircle2, Circle, ArrowRight } from "lucide-react"
import type { PageSection } from "./types"

interface ProcessWidgetProps {
  section: PageSection
}

interface ProcessStep {
  id: string
  title: string
  description: string
  icon?: string
  duration?: string
}

export function ProcessWidget({ section }: ProcessWidgetProps) {
  let steps: ProcessStep[] = []
  try {
    // Parse content - handle both string and object
    let parsedContent: any
    if (typeof section.content === 'string') {
      parsedContent = JSON.parse(section.content || "[]")
    } else {
      parsedContent = section.content
    }
    
    // Content might be { steps: [...] } or just [...]
    steps = parsedContent?.steps || parsedContent || []
    
    // Ensure it's an array
    if (!Array.isArray(steps)) {
      steps = []
    }
  } catch {
    steps = [
      {
        id: "1",
        title: "Consultation",
        description: "We discuss your vision, requirements, and budget to understand your project needs.",
        duration: "1-2 days"
      },
      {
        id: "2",
        title: "Planning & Design",
        description: "Our architects create detailed plans and 3D visualizations for your approval.",
        duration: "1-2 weeks"
      },
      {
        id: "3",
        title: "Quote & Contract",
        description: "We provide a transparent detailed quote and finalize the project contract.",
        duration: "3-5 days"
      },
      {
        id: "4",
        title: "Construction",
        description: "Our expert team executes the project with precision and regular progress updates.",
        duration: "Varies"
      },
      {
        id: "5",
        title: "Quality Check",
        description: "Rigorous inspection ensures everything meets our high standards.",
        duration: "2-3 days"
      },
      {
        id: "6",
        title: "Handover",
        description: "Final walkthrough and handover of your completed project.",
        duration: "1 day"
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
        <div className="mb-12">
          {section.title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
          )}
          <div className="w-20 h-1 bg-gray-900 rounded-full" />
          {contentText && <p className="text-gray-600 mt-4 max-w-2xl">{contentText}</p>}
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block" />
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div 
                  key={step.id || `step-${index}`} 
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } flex-col`}
                >
                  {/* Content Card */}
                  <div className="flex-1 md:text-right">
                    <div className={`border border-gray-200 p-6 bg-white ${
                      index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                    }`}>
                      <div className={`flex items-center gap-2 mb-3 ${
                        index % 2 === 0 ? "md:justify-end" : ""
                      }`}>
                        <span className="text-xs font-mono text-gray-400">0{index + 1}</span>
                        {step.duration && (
                          <span className="text-xs text-gray-500 font-mono">
                            {step.duration}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                      <p className="text-gray-500">{step.description}</p>
                    </div>
                  </div>

                  {/* Center Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-900 flex items-center justify-center text-white">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
