"use client"

import { useClients } from "@/hooks/use-clients"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import type { PageSection } from "./types"

interface ClientsWidgetProps {
  section: PageSection
}

export function ClientsWidget({ section }: ClientsWidgetProps) {
  const { clients, loading } = useClients()

  if (loading) return <div className="py-16 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>

  // Handle content as string or object
  const contentText = typeof section.content === 'string' ? section.content : section.content?.text || ''

  return (
    <section className="py-16 bg-stone-50">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-4 text-center">{section.title}</h2>}
        {contentText && <p className="text-stone-600 text-center max-w-2xl mx-auto mb-12">{contentText}</p>}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {clients.map((client) => (
            <div key={client.id} className="relative h-16 w-32 grayscale hover:grayscale-0 transition-all">
              {client.logo ? (
                <Image src={client.logo} alt={client.name} fill className="object-contain" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-stone-200 rounded">
                  <span className="text-stone-500 font-medium">{client.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
