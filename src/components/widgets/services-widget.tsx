"use client"

import { useState } from "react"
import { useServices } from "@/hooks/use-services"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
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
  
  if (loading) return <div className="py-16 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></div>

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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Clean Header */}
          <div className="mb-16">
            {section.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
            )}
            <div className="w-20 h-1 bg-gray-900 rounded-full" />
          </div>
          
          {/* Minimal Grid Cards */}
          <div className={`grid ${gridCols[layoutConfig.columns as keyof typeof gridCols] || gridCols[3]} gap-8`}>
            {displayServices.map((service, index) => (
              <div 
                key={service.id} 
                className="group border border-gray-200 rounded-none hover:border-gray-900 transition-all duration-300 bg-white"
              >
                <div className="p-8">
                  {/* Number indicator */}
                  <span className="text-sm font-mono text-gray-400 mb-4 block">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-gray-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  {service.features && (
                    <ul className="space-y-3">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-500 flex items-center gap-3">
                          <span className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {/* Arrow link */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <span className="inline-flex items-center text-sm font-medium text-gray-900 group-hover:gap-2 transition-all">
                      Learn more 
                      <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  // List Layout
  if (layoutConfig.layout === "list") {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Clean Header */}
          <div className="mb-16">
            {section.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
            )}
            <div className="w-20 h-1 bg-gray-900 rounded-full" />
          </div>
          
          <div className="space-y-0 max-w-4xl">
            {displayServices.map((service, index) => (
              <div 
                key={service.id} 
                className="group border-b border-gray-200 py-8 first:pt-0 hover:bg-gray-50 transition-colors -mx-4 px-4"
              >
                <div className="flex items-start gap-6">
                  <span className="text-sm font-mono text-gray-400 flex-shrink-0 w-8">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    {service.features && (
                      <div className="flex flex-wrap gap-2">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>
              </div>
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Clean Header */}
          <div className="mb-16 flex items-end justify-between">
            <div>
              {section.title && (
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
              )}
              <div className="w-20 h-1 bg-gray-900 rounded-full" />
            </div>
            
            {/* Navigation */}
            {displayServices.length > 1 && (
              <div className="flex gap-2">
                <button 
                  onClick={prevSlide} 
                  className="p-3 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={nextSlide} 
                  className="p-3 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {displayServices.map((service, index) => (
                <div key={service.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 pr-8">
                  <div className="bg-white border border-gray-200 p-8 h-full group hover:border-gray-900 transition-colors">
                    <span className="text-sm font-mono text-gray-400 mb-6 block">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    {service.features && (
                      <ul className="space-y-2">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-500 flex items-center gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots */}
          {displayServices.length > 1 && (
            <div className="flex gap-2 mt-8">
              {displayServices.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1 transition-all duration-300 ${
                    idx === currentSlide ? "w-8 bg-gray-900" : "w-4 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }
  
  // Default Grid
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Clean Header */}
        <div className="mb-16">
          {section.title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
          )}
          <div className="w-20 h-1 bg-gray-900 rounded-full" />
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => (
            <div 
              key={service.id} 
              className="group border border-gray-200 rounded-none hover:border-gray-900 transition-all duration-300 bg-white"
            >
              <div className="p-8">
                <span className="text-sm font-mono text-gray-400 mb-4 block">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                {service.features && (
                  <ul className="space-y-3">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-500 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <span className="inline-flex items-center text-sm font-medium text-gray-900 group-hover:gap-2 transition-all">
                    Learn more 
                    <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
