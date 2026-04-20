"use client"

import Image from "next/image"
import { Handshake } from "lucide-react"
import type { PageSection } from "./types"

interface PartnersWidgetProps {
  section: PageSection
}

interface Partner {
  id: string
  name: string
  logo?: string
  website?: string
  category: string
}

export function PartnersWidget({ section }: PartnersWidgetProps) {
  let partners: Partner[] = []
  try {
    // Parse content - handle both string and object
    let parsedContent: any
    if (typeof section.content === 'string') {
      parsedContent = JSON.parse(section.content || "[]")
    } else {
      parsedContent = section.content
    }
    
    // Content might be { partners: [...] } or just [...]
    partners = parsedContent?.partners || parsedContent || []
    
    // Ensure it's an array
    if (!Array.isArray(partners)) {
      partners = []
    }
  } catch {
    partners = [
      { id: "1", name: "Holcim Philippines", category: "Materials" },
      { id: "2", name: "Meralco", category: "Utilities" },
      { id: "3", name: "DMCI Holdings", category: "Development" },
      { id: "4", name: "BDO Construction", category: "Finance" },
      { id: "5", name: "Philippine Steel", category: "Materials" },
      { id: "6", name: "Ayala Land", category: "Real Estate" }
    ]
  }

  // Group by category
  const grouped = partners.reduce((acc, partner) => {
    if (!acc[partner.category]) acc[partner.category] = []
    acc[partner.category].push(partner)
    return acc
  }, {} as Record<string, Partner[]>)

  // Handle content as string or object
  const contentText = typeof section.content === 'string' 
    ? section.content 
    : section.content?.text || ''

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-4 text-center text-foreground">{section.title}</h2>}
        {contentText && <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">{contentText}</p>}
        
        <div className="space-y-10 max-w-5xl mx-auto">
          {Object.entries(grouped).map(([category, categoryPartners]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                <Handshake className="h-5 w-5" />
                {category}
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                {categoryPartners.map((partner) => (
                  <a
                    key={partner.id}
                    href={partner.website || "#"}
                    target={partner.website ? "_blank" : undefined}
                    rel={partner.website ? "noopener noreferrer" : undefined}
                    className="group"
                  >
                    <div className="h-20 px-6 bg-muted border border-border rounded-lg flex items-center justify-center min-w-[180px] hover:border-primary/50 hover:shadow-sm transition-all">
                      {partner.logo ? (
                        <Image 
                          src={partner.logo} 
                          alt={partner.name}
                          width={120}
                          height={60}
                          className="object-contain grayscale group-hover:grayscale-0 transition-all"
                        />
                      ) : (
                        <span className="text-muted-foreground font-medium text-center">
                          {partner.name}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
