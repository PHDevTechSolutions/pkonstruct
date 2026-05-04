"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Navigation, 
  ExternalLink, 
  Building2, 
  Globe,
  Sparkles,
  LocateFixed
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PageSection } from "./types"

interface LocationWidgetProps {
  section: PageSection
}

interface LocationInfo {
  address: string
  city: string
  country: string
  phone: string
  email: string
  hours: string | { day: string; time: string }[]
  mapUrl?: string
  mapEmbed?: string
  directionsUrl?: string
}

export function LocationWidget({ section }: LocationWidgetProps) {
  let location: LocationInfo
  try {
    const contentToParse = typeof section.content === 'string' ? section.content : JSON.stringify(section.content)
    location = JSON.parse(contentToParse)
  } catch {
    location = {
      address: "123 Construction Ave",
      city: "Makati City, Metro Manila",
      country: "Philippines",
      phone: "+63 (2) 8123 4567",
      email: "info@pkonstruct.com",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM",
      mapUrl: "https://maps.google.com",
      directionsUrl: "https://maps.google.com/directions"
    }
  }

  const contentText = typeof section.content === 'object' ? section.content?.text : ''

  // Icon gradient colors
  const iconGradients = [
    "from-blue-500 to-indigo-600",
    "from-green-500 to-emerald-600",
    "from-orange-500 to-red-500",
    "from-purple-500 to-pink-500"
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
            <LocateFixed className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-semibold">Find Us</span>
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
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Map Container - Modern */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden min-h-[400px] rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 bg-white"
          >
            {/* Map Content */}
            <div className="relative h-full w-full bg-gray-50">
              {location.mapEmbed ? (
                <iframe
                  src={location.mapEmbed}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
                    <MapPin className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-gray-600 text-center max-w-xs mb-2 font-medium">
                    Interactive map would be displayed here
                  </p>
                  <p className="text-sm text-gray-400">
                    Add a Google Maps embed URL in the content
                  </p>
                </div>
              )}
            </div>

            {/* External map link - Modern */}
            {location.mapUrl && (
              <div className="absolute bottom-4 right-4 z-20">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <Globe className="w-4 h-4" />
                  Open in Maps
                  <ExternalLink className="w-3 h-3" />
                </motion.a>
              </div>
            )}
          </motion.div>

          {/* Contact Info Cards - Modern */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Address Card */}
            <motion.div 
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-blue-100/30 hover:border-blue-200 transition-all duration-300"
            >
              <div className="p-5 flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${iconGradients[0]} rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20`}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">Address</h3>
                  <p className="text-gray-600">{location.address}</p>
                  <p className="text-gray-600">{location.city}</p>
                  <p className="text-gray-600">{location.country}</p>
                </div>
              </div>
            </motion.div>

            {/* Phone Card */}
            <motion.div 
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-green-100/30 hover:border-green-200 transition-all duration-300"
            >
              <div className="p-5 flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${iconGradients[1]} rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20`}>
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">Phone</h3>
                  <a href={`tel:${location.phone}`} className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                    {location.phone}
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div 
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-orange-100/30 hover:border-orange-200 transition-all duration-300"
            >
              <div className="p-5 flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${iconGradients[2]} rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20`}>
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">Email</h3>
                  <a href={`mailto:${location.email}`} className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
                    {location.email}
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Hours Card */}
            <motion.div 
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-purple-100/30 hover:border-purple-200 transition-all duration-300"
            >
              <div className="p-5 flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${iconGradients[3]} rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20`}>
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">Business Hours</h3>
                  {Array.isArray(location.hours) ? (
                    <div className="space-y-1">
                      {location.hours.map((h: any, i: number) => (
                        <p key={i} className="text-gray-600 text-sm flex justify-between">
                          <span className="font-medium">{h.day}:</span>
                          <span>{h.time}</span>
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 font-medium">{location.hours}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Get Directions Button */}
            {location.directionsUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  className="w-full py-5 text-lg font-semibold bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 text-white border-0 mt-2 rounded-xl"
                  asChild
                >
                  <a href={location.directionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <Navigation className="h-5 w-5" />
                    Get Directions
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
