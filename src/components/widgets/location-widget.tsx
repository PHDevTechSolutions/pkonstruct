"use client"

import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  hours: string
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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-4 text-center">{section.title}</h2>}
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Map */}
          <div className="relative h-96 lg:h-auto rounded-lg overflow-hidden bg-stone-100 min-h-[300px]">
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
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100">
                <MapPin className="h-16 w-16 text-amber-600 mb-4" />
                <p className="text-stone-600 text-center max-w-xs">
                  Interactive map would be displayed here.<br/>
                  Add a Google Maps embed URL in the content.
                </p>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-stone-600">{location.address}</p>
                    <p className="text-stone-600">{location.city}</p>
                    <p className="text-stone-600">{location.country}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-stone-600">{location.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-stone-600">{location.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <p className="text-stone-600">{location.hours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {location.directionsUrl && (
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700"
                asChild
              >
                <a href={location.directionsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
