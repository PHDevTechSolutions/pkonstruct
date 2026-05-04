"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { 
  CheckCircle2, 
  Shield, 
  Zap, 
  Clock, 
  Award, 
  Users, 
  Target, 
  Heart,
  Lightbulb,
  TrendingUp,
  Headphones,
  Wrench,
  Sparkles,
  Star,
  Gem,
  Crown
} from "lucide-react"
import type { PageSection } from "./types"

interface FeaturesWidgetProps {
  section: PageSection
}

// Icon components for gradient backgrounds
const iconComponents: Record<string, React.ElementType> = {
  "check": CheckCircle2,
  "shield": Shield,
  "zap": Zap,
  "clock": Clock,
  "award": Award,
  "users": Users,
  "target": Target,
  "heart": Heart,
  "lightbulb": Lightbulb,
  "trending": TrendingUp,
  "support": Headphones,
  "wrench": Wrench,
  "star": Star,
  "gem": Gem,
  "crown": Crown
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
      { title: "Quality Assurance", description: "Rigorous quality control on every project", icon: "shield" },
      { title: "Expert Team", description: "Skilled professionals with years of experience", icon: "users" },
      { title: "On-Time Delivery", description: "Projects completed within agreed timelines", icon: "clock" },
      { title: "Safety First", description: "Strict adherence to safety protocols", icon: "check" },
    ]
  }

  const contentText = typeof section.content === 'object' ? section.content?.text : ''
  const columns = typeof section.content === 'object' ? section.content?.columns || 4 : 4

  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setVisibleItems((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    )

    const items = containerRef.current?.querySelectorAll('[data-index]')
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  const getGridCols = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 md:grid-cols-2'
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      case 5: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      case 6: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }
  }

  // Gradient colors for icons
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-green-500 to-emerald-600", 
    "from-orange-500 to-red-500",
    "from-purple-500 to-pink-500",
    "from-cyan-500 to-blue-500",
    "from-rose-500 to-orange-500",
    "from-teal-500 to-cyan-500",
    "from-violet-500 to-purple-500"
  ]

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
            <span className="text-blue-700 text-sm font-semibold">Why Choose Us</span>
          </div>
          {section.title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
          )}
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6" />
          {contentText && (
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">{contentText}</p>
          )}
        </motion.div>

        {/* Features Grid - Modern Cards */}
        <div ref={containerRef} className={`grid ${getGridCols()} gap-6`}>
          {features.map((feature: any, index: number) => {
            const iconKey = feature.icon || Object.keys(iconComponents)[index % Object.keys(iconComponents).length]
            const IconComponent = iconComponents[iconKey] || CheckCircle2
            const gradient = gradients[index % gradients.length]
            const isVisible = visibleItems.includes(index)
            
            return (
              <motion.div
                key={index}
                data-index={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-200 transition-all duration-300"
              >
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
