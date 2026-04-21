"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink, Building2, Globe } from "lucide-react"
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

const contactItems = [
  { key: 'address', icon: MapPin, label: 'Address' },
  { key: 'phone', icon: Phone, label: 'Phone' },
  { key: 'email', icon: Mail, label: 'Email' },
  { key: 'hours', icon: Clock, label: 'Business Hours' },
]

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
  const [isMapHovered, setIsMapHovered] = useState(false)

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
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Map Container - Clean */}
          <div 
            className="relative overflow-hidden min-h-[400px] border border-gray-200 group"
            onMouseEnter={() => setIsMapHovered(true)}
            onMouseLeave={() => setIsMapHovered(false)}
          >
            {/* Map Content */}
            <div className="relative h-full w-full bg-gray-100">
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
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                  <MapPin className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center max-w-xs mb-4">
                    Interactive map would be displayed here
                  </p>
                  <p className="text-sm text-gray-400">
                    Add a Google Maps embed URL in the content
                  </p>
                </div>
              )}
            </div>

            {/* External map link */}
            {location.mapUrl && (
              <div className="absolute bottom-4 right-4 z-20">
                <a 
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-900 hover:border-gray-900 transition-all"
                >
                  <Globe className="w-4 h-4" />
                  Open in Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Contact Info Cards - Clean */}
          <div className="space-y-4">
            {/* Address Card */}
            <div className="group border border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white">
              <div className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center shrink-0 text-gray-600 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-500">{location.address}</p>
                  <p className="text-gray-500">{location.city}</p>
                  <p className="text-gray-500">{location.country}</p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="group border border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white">
              <div className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center shrink-0 text-gray-600 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                  <a href={`tel:${location.phone}`} className="text-gray-500 hover:text-gray-900 transition-colors">
                    {location.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="group border border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white">
              <div className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center shrink-0 text-gray-600 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <a href={`mailto:${location.email}`} className="text-gray-500 hover:text-gray-900 transition-colors">
                    {location.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="group border border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white">
              <div className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center shrink-0 text-gray-600 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Business Hours</h3>
                  {Array.isArray(location.hours) ? (
                    <div className="space-y-1">
                      {location.hours.map((h: any, i: number) => (
                        <p key={i} className="text-gray-500 text-sm flex justify-between">
                          <span className="font-medium">{h.day}:</span>
                          <span>{h.time}</span>
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">{location.hours}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Get Directions Button */}
            {location.directionsUrl && (
              <Button 
                className="w-full py-6 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white border-0 mt-4"
                asChild
              >
                <a href={location.directionsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="h-5 w-5 mr-2" />
                  Get Directions
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
