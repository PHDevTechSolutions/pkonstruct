"use client"

import { useClients } from "@/hooks/use-clients"
import { Loader2, Building2, Sparkles, Handshake, Star, Award } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import type { PageSection } from "./types"

interface ClientsWidgetProps {
  section: PageSection
}

export function ClientsWidget({ section }: ClientsWidgetProps) {
  const { clients, loading } = useClients()

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
          <p className="text-gray-600 text-lg">Loading partners...</p>
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
            <Handshake className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-semibold">Trusted By</span>
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

        {/* Clients Grid - Modern Layout */}
        {layout === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-blue-100/30 hover:border-blue-200 transition-all duration-300 h-28 flex items-center justify-center p-4"
              >
                {client.logo ? (
                  <div className="relative h-full w-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                    <Image 
                      src={client.logo} 
                      alt={client.name} 
                      fill 
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600 transition-colors">
                      {client.name}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          /* Marquee/Scrolling Layout */
          <div className="relative bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 py-8 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
            <div className="flex overflow-hidden">
              <div className="flex animate-marquee gap-12 items-center">
                {[...displayClients, ...displayClients, ...displayClients].map((client, index) => (
                  <div
                    key={`${client.id}-${index}`}
                    className="flex-shrink-0 h-16 w-40 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                  >
                    {client.logo ? (
                      <Image 
                        src={client.logo} 
                        alt={client.name} 
                        width={120}
                        height={50}
                        className="object-contain max-h-12"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm font-semibold">{client.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats section - Modern Cards */}
        {clients.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 flex flex-wrap justify-center gap-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 text-center min-w-[160px]">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/25">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {clients.length}+
              </div>
              <div className="text-sm text-gray-500 font-medium">Trusted Partners</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 text-center min-w-[160px]">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-500/25">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                100%
              </div>
              <div className="text-sm text-gray-500 font-medium">Satisfaction Rate</div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
