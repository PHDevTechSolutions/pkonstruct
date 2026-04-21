"use client"

import { useState } from "react"
import { Check, X, HelpCircle, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PageSection } from "./types"

interface ComparisonWidgetProps {
  section: PageSection
}

interface ComparisonItem {
  id: string
  feature: string
  description?: string
  options: Record<string, boolean | string>
}

interface ComparisonData {
  title: string
  options: string[]
  items: ComparisonItem[]
}

export function ComparisonWidget({ section }: ComparisonWidgetProps) {
  let data: ComparisonData
  try {
    const contentToParse = typeof section.content === 'string' ? section.content : JSON.stringify(section.content)
    data = JSON.parse(contentToParse)
  } catch {
    data = {
      title: "Construction Services Comparison",
      options: ["Residential", "Commercial", "Industrial"],
      items: [
        {
          id: "1",
          feature: "Project Timeline",
          description: "Estimated completion time",
          options: {
            "Residential": "2-6 months",
            "Commercial": "6-18 months",
            "Industrial": "12-36 months"
          }
        },
        {
          id: "2",
          feature: "Team Size",
          description: "Number of workers assigned",
          options: {
            "Residential": "5-15 workers",
            "Commercial": "20-50 workers",
            "Industrial": "50-200 workers"
          }
        },
        {
          id: "3",
          feature: "Custom Design",
          options: {
            "Residential": true,
            "Commercial": true,
            "Industrial": true
          }
        },
        {
          id: "4",
          feature: "24/7 Support",
          options: {
            "Residential": false,
            "Commercial": true,
            "Industrial": true
          }
        },
        {
          id: "5",
          feature: "Maintenance Plan",
          options: {
            "Residential": true,
            "Commercial": true,
            "Industrial": true
          }
        },
        {
          id: "6",
          feature: "Warranty Period",
          options: {
            "Residential": "1 year",
            "Commercial": "3 years",
            "Industrial": "5 years"
          }
        }
      ]
    }
  }

  const renderValue = (value: boolean | string, isHovered: boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
          isHovered ? 'bg-primary text-primary-foreground scale-110' : 'bg-emerald-500/10 text-emerald-500'
        }`}>
          <Check className="h-4 w-4" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mx-auto">
          <X className="h-4 w-4 text-muted-foreground/50" />
        </div>
      )
    }
    return <span className="text-foreground font-medium">{value}</span>
  }

  const contentText = typeof section.content === 'string' ? section.content : section.content?.text || ''
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

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

        {/* Comparison Table - Clean Design */}
        <div className="max-w-5xl mx-auto">
          <div className="border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-6 font-semibold text-gray-900 sticky left-0 z-10 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span>Features</span>
                      </div>
                    </th>
                    {data.options.map((option, idx) => (
                      <th 
                        key={option} 
                        className={`p-6 font-bold text-center min-w-[160px] transition-colors duration-200 ${
                          hoveredColumn === idx 
                            ? 'bg-gray-100 text-gray-900' 
                            : 'text-gray-900'
                        }`}
                        onMouseEnter={() => setHoveredColumn(idx)}
                        onMouseLeave={() => setHoveredColumn(null)}
                      >
                        <span className="text-lg">{option}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, rowIndex) => (
                    <tr 
                      key={item.id}
                      className={`border-b border-gray-100 transition-colors duration-200 ${
                        hoveredRow === rowIndex ? 'bg-gray-50' : ''
                      }`}
                      onMouseEnter={() => setHoveredRow(rowIndex)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="p-6 bg-white sticky left-0 z-10">
                        <div className="flex items-start gap-3">
                          <span className="font-semibold text-gray-900">{item.feature}</span>
                          {item.description && (
                            <div className="group relative">
                              <HelpCircle className="h-4 w-4 text-gray-400 shrink-0 mt-0.5 cursor-help hover:text-gray-900 transition-colors" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-white border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <p className="text-sm text-gray-600">{item.description}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      {data.options.map((option, colIndex) => (
                        <td 
                          key={option} 
                          className={`p-6 text-center transition-colors duration-200 ${
                            hoveredColumn === colIndex 
                              ? 'bg-gray-50' 
                              : ''
                          }`}
                          onMouseEnter={() => setHoveredColumn(colIndex)}
                          onMouseLeave={() => setHoveredColumn(null)}
                        >
                          {renderValue(item.options[option], hoveredColumn === colIndex)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              Need help choosing? Get a free consultation.
            </p>
            <Button 
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 border-0"
            >
              Get Free Consultation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
