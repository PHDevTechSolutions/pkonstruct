"use client"

import { useState } from "react"
import { useServices } from "@/hooks/use-services"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import type { PageSection } from "./types"

interface ServicesWidgetProps {
  section: PageSection
}

interface LayoutConfig {
  layout: "grid" | "list" | "slider"
  columns: number
  itemsPerPage: number
  showFilters: boolean
}

export function ServicesWidget({ section }: ServicesWidgetProps) {
  const { services, loading } = useServices()
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Parse layout configuration from content
  let layoutConfig: LayoutConfig = {
    layout: "grid",
    columns: 3,
    itemsPerPage: 6,
    showFilters: false
  }
  
  try {
    const contentToParse = typeof section.content === 'string' ? section.content : JSON.stringify(section.content)
    const parsed = JSON.parse(contentToParse || "{}")
    layoutConfig = {
      layout: parsed.layout || "grid",
      columns: parsed.columns || 3,
      itemsPerPage: parsed.itemsPerPage || 6,
      showFilters: parsed.showFilters || false
    }
  } catch {
    // Use defaults
  }
  
  // Limit services based on itemsPerPage
  const displayServices = services.slice(0, layoutConfig.itemsPerPage)
  
  if (loading) return <div className="py-16 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>

  // Grid Layout
  if (layoutConfig.layout === "grid") {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    }
    
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {section.title && <h2 className="text-3xl font-bold mb-12 text-center">{section.title}</h2>}
          
          <div className={`grid ${gridCols[layoutConfig.columns as keyof typeof gridCols] || gridCols[3]} gap-6`}>
            {displayServices.map((service) => (
              <Card key={service.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-stone-600 mb-4">{service.description}</p>
                  {service.features && (
                    <ul className="space-y-1">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-sm text-stone-500 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-amber-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  // List Layout
  if (layoutConfig.layout === "list") {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {section.title && <h2 className="text-3xl font-bold mb-12 text-center">{section.title}</h2>}
          <div className="space-y-4 max-w-4xl mx-auto">
            {displayServices.map((service) => (
              <Card key={service.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-stone-600">{service.description}</p>
                      {service.features && (
                        <ul className="space-y-1 mt-3">
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-sm text-stone-500 flex items-center">
                              <CheckCircle className="h-3 w-3 mr-2 text-amber-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  // Slider Layout
  if (layoutConfig.layout === "slider") {
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % displayServices.length)
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + displayServices.length) % displayServices.length)
    
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {section.title && <h2 className="text-3xl font-bold mb-12 text-center">{section.title}</h2>}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {displayServices.map((service) => (
                  <div key={service.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-3">
                    <Card className="h-full group hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                          <CheckCircle className="h-6 w-6 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                        <p className="text-stone-600 mb-4">{service.description}</p>
                        {service.features && (
                          <ul className="space-y-1">
                            {service.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="text-sm text-stone-500 flex items-center">
                                <CheckCircle className="h-3 w-3 mr-2 text-amber-600" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation */}
            {displayServices.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg">
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="flex justify-center gap-2 mt-4">
                  {displayServices.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentSlide ? "bg-amber-600" : "bg-stone-300"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    )
  }
  
  // Default Grid
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-12 text-center">{section.title}</h2>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-stone-600 mb-4">{service.description}</p>
                {service.features && (
                  <ul className="space-y-1">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-sm text-stone-500 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-amber-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
