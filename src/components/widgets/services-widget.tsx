"use client"

import { useState } from "react"
import { useServices } from "@/hooks/use-services"
import { Button } from "@/components/ui/button"
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight,
  Sparkles,
  HardHat,
  Wrench,
  Home,
  Building2,
  CheckCircle2,
  ArrowRight
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
  
  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6"
          >
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          </motion.div>
          <p className="text-gray-600 text-lg">Loading services...</p>
        </div>
      </section>
    )
  }

  // Icon mapping for services
  const iconMap: Record<string, React.ElementType> = {
    HardHat,
    Wrench,
    Home,
    Building2,
    Sparkles
  }

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
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Modern Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-semibold">Our Expertise</span>
            </div>
            {section.title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
            )}
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6" />
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Professional construction services tailored to your needs
            </p>
          </motion.div>
          
          {/* Modern Grid Cards */}
          <div className={`grid ${gridCols[layoutConfig.columns as keyof typeof gridCols] || gridCols[3]} gap-6`}>
            {displayServices.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Wrench
              const gradients = [
                "from-blue-500 to-indigo-600",
                "from-green-500 to-emerald-600", 
                "from-orange-500 to-red-500",
                "from-purple-500 to-pink-500",
                "from-cyan-500 to-blue-500",
                "from-rose-500 to-orange-500"
              ]
              const gradient = gradients[index % gradients.length]
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-200 transition-all duration-300"
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Number badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <motion.div 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ x: 4 }}
                    >
                      <ArrowUpRight className="w-5 h-5 text-blue-500" />
                    </motion.div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-5 leading-relaxed text-sm">{service.description}</p>
                  
                  {service.features && (
                    <ul className="space-y-2 mb-5">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-500 flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {/* CTA Link */}
                  <div className="pt-4 border-t border-gray-100">
                    <button className="inline-flex items-center text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors gap-2">
                      Learn more 
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }
  
  // List Layout
  if (layoutConfig.layout === "list") {
    return (
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Modern Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-semibold">Our Expertise</span>
            </div>
            {section.title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
            )}
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6" />
          </motion.div>
          
          <div className="space-y-4 max-w-4xl mx-auto">
            {displayServices.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Wrench
              const gradients = [
                "from-blue-500 to-indigo-600",
                "from-green-500 to-emerald-600", 
                "from-orange-500 to-red-500",
                "from-purple-500 to-pink-500",
                "from-cyan-500 to-blue-500",
                "from-rose-500 to-orange-500"
              ]
              const gradient = gradients[index % gradients.length]
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                  whileHover={{ x: 8, transition: { duration: 0.2 } }}
                  className="group bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-200 transition-all duration-300"
                >
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {service.title}
                        </h3>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{service.description}</p>
                      {service.features && (
                        <div className="flex flex-wrap gap-2">
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="text-xs text-gray-600 bg-gray-100 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors flex items-center gap-1">
                              <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${gradient}`} />
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
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
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Modern Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 text-sm font-semibold">Our Expertise</span>
              </div>
              {section.title && (
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
              )}
              <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto md:mx-0" />
            </div>
            
            {/* Navigation */}
            {displayServices.length > 1 && (
              <div className="flex gap-3 justify-center md:justify-end">
                <motion.button 
                  onClick={prevSlide}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-xl bg-white shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all flex items-center justify-center group"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                </motion.button>
                <motion.button 
                  onClick={nextSlide}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center group"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </motion.button>
              </div>
            )}
          </motion.div>
          
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {displayServices.map((service, index) => {
                const IconComponent = iconMap[service.icon] || Wrench
                const gradients = [
                  "from-blue-500 to-indigo-600",
                  "from-green-500 to-emerald-600", 
                  "from-orange-500 to-red-500",
                  "from-purple-500 to-pink-500",
                  "from-cyan-500 to-blue-500",
                  "from-rose-500 to-orange-500"
                ]
                const gradient = gradients[index % gradients.length]
                
                return (
                  <div key={service.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 pr-6">
                    <motion.div 
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-2xl p-8 h-full shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-200 transition-all duration-300 group"
                    >
                      {/* Icon */}
                      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed text-sm">{service.description}</p>
                      {service.features && (
                        <ul className="space-y-2 mb-6">
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-500 flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      <button className="inline-flex items-center text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors gap-2">
                        Learn more 
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Dots */}
          {displayServices.length > 1 && (
            <div className="flex gap-2 mt-8 justify-center">
              {displayServices.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  whileHover={{ scale: 1.2 }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide 
                      ? "w-8 bg-gradient-to-r from-blue-500 to-indigo-500" 
                      : "w-2 bg-gray-300 hover:bg-gray-400"
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
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Modern Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-semibold">Our Expertise</span>
          </div>
          {section.title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
          )}
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6" />
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Professional construction services tailored to your needs
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Wrench
            const gradients = [
              "from-blue-500 to-indigo-600",
              "from-green-500 to-emerald-600", 
              "from-orange-500 to-red-500",
              "from-purple-500 to-pink-500",
              "from-cyan-500 to-blue-500",
              "from-rose-500 to-orange-500"
            ]
            const gradient = gradients[index % gradients.length]
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-200 transition-all duration-300"
              >
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                
                {/* Number badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <motion.div 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ x: 4 }}
                  >
                    <ArrowUpRight className="w-5 h-5 text-blue-500" />
                  </motion.div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-5 leading-relaxed text-sm">{service.description}</p>
                
                {service.features && (
                  <ul className="space-y-2 mb-5">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-500 flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                
                {/* CTA Link */}
                <div className="pt-4 border-t border-gray-100">
                  <button className="inline-flex items-center text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors gap-2">
                    Learn more 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
