"use client"

import { useClients } from "@/hooks/use-clients"
import { Loader2, Building2 } from "lucide-react"
import Image from "next/image"
import type { PageSection } from "./types"

interface ClientsWidgetProps {
  section: PageSection
}

export function ClientsWidget({ section }: ClientsWidgetProps) {
  const { clients, loading } = useClients()

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      </section>
    )
  }

  // Handle content as string or object
  const contentText = typeof section.content === 'string' ? section.content : section.content?.text || ''
  const layout = typeof section.content === 'object' ? section.content?.layout || 'grid' : 'grid'
  const showCount = typeof section.content === 'object' ? section.content?.showCount || clients.length : clients.length

  const displayClients = clients.slice(0, showCount)

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

        {/* Clients Grid - Clean Layout */}
        {layout === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayClients.map((client) => (
              <div
                key={client.id}
                className="group border border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white h-24"
              >
                {/* Logo content */}
                <div className="relative h-full w-full flex items-center justify-center p-4">
                  {client.logo ? (
                    <div className="relative h-full w-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                      <Image 
                        src={client.logo} 
                        alt={client.name} 
                        fill 
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-gray-600">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                        {client.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Marquee/Scrolling Layout */
          <div className="relative border-y border-gray-200 py-6">
            <div className="flex overflow-hidden">
              <div className="flex animate-marquee gap-8">
                {[...displayClients, ...displayClients].map((client, index) => (
                  <div
                    key={`${client.id}-${index}`}
                    className="flex-shrink-0 h-12 w-32 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  >
                    {client.logo ? (
                      <Image 
                        src={client.logo} 
                        alt={client.name} 
                        fill 
                        className="object-contain"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="text-gray-500 text-sm font-medium">{client.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats section */}
        {clients.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {clients.length}+
              </div>
              <div className="text-sm text-gray-500 mt-1">Trusted Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                100%
              </div>
              <div className="text-sm text-gray-500 mt-1">Satisfaction Rate</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
