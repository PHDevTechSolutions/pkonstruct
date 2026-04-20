"use client"

import { Check, X, HelpCircle } from "lucide-react"
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

  const renderValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
      )
    }
    return <span className="text-card-foreground font-medium">{value}</span>
  }

  // Handle content as string or object
  const contentText = typeof section.content === 'string' ? section.content : section.content?.text || ''

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-4 text-center text-foreground">{section.title}</h2>}
        {contentText && <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">{contentText}</p>}
        
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full bg-card rounded-lg shadow-sm overflow-hidden border border-border">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="text-left p-4 font-semibold">Features</th>
                {data.options.map((option) => (
                  <th key={option} className="p-4 font-semibold text-center min-w-[150px]">
                    {option}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr 
                  key={item.id} 
                  className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}
                >
                  <td className="p-4">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-card-foreground">{item.feature}</span>
                      {item.description && (
                        <div className="group relative">
                          <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-popover text-popover-foreground text-xs rounded shadow-lg z-10">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  {data.options.map((option) => (
                    <td key={option} className="p-4 text-center">
                      {renderValue(item.options[option])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
