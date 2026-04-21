"use client"

import Image from "next/image"
import { Handshake, Building2, ArrowUpRight, Link2 } from "lucide-react"
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

const categoryIcons: Record<string, React.ReactNode> = {
  "Materials": <Building2 className="w-5 h-5" />,
  "Utilities": <Link2 className="w-5 h-5" />,
  "default": <Handshake className="w-5 h-5" />,
}

export function PartnersWidget({ section }: PartnersWidgetProps) {
  let partners: Partner[] = []
  try {
    // Parse content - handle both string or object
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

  const categoryCount = Object.keys(grouped).length

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Clean Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            {section.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
            )}
            <div className="w-20 h-1 bg-gray-900 rounded-full" />
            {contentText && (
              <p className="text-gray-600 mt-4 max-w-2xl">{contentText}</p>
            )}
          </div>
          
          {/* Category count indicator */}
          {categoryCount > 0 && (
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm font-mono">
              <Handshake className="w-4 h-4" />
              <span>
                {partners.length} Partners / {categoryCount} Categories
              </span>
            </div>
          )}
        </div>

        {/* Partners by Category - Clean Grid */}
        <div className="space-y-10">
          {Object.entries(grouped).map(([category, categoryPartners]) => (
            <div key={category}>
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {category}
                  <span className="text-sm font-normal text-gray-400 font-mono">
                    ({categoryPartners.length})
                  </span>
                </h3>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Partners Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {categoryPartners.map((partner) => (
                  <a
                    key={partner.id}
                    href={partner.website || "#"}
                    target={partner.website ? "_blank" : undefined}
                    rel={partner.website ? "noopener noreferrer" : undefined}
                    className="group"
                  >
                    <div className="relative h-24 border border-gray-200 overflow-hidden transition-all duration-300 hover:border-gray-900 bg-white">
                      {/* Content */}
                      <div className="relative h-full flex items-center justify-center p-4">
                        {partner.logo ? (
                          <div className="relative w-full h-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                            <Image 
                              src={partner.logo} 
                              alt={partner.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-gray-600">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors text-center line-clamp-2">
                              {partner.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* External link indicator */}
                      {partner.website && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-6 h-6 bg-gray-900 flex items-center justify-center">
                            <ArrowUpRight className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <Handshake className="w-4 h-4" />
            <span>{partners.length}+ Industry Partners</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            <span>Trusted Network</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>{categoryCount} Partner Categories</span>
          </div>
        </div>
      </div>
    </section>
  )
}
