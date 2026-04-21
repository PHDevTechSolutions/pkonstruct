"use client"

import { useTeam } from "@/hooks/use-team"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import type { PageSection } from "./types"

interface TeamWidgetProps {
  section: PageSection
}

export function TeamWidget({ section }: TeamWidgetProps) {
  const { members, loading } = useTeam()
  // Handle content as string or object
  const contentText = typeof section.content === 'string' 
    ? section.content 
    : section.content?.text || ''

  if (loading) return <div className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" /></div>

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Clean Header */}
        <div className="mb-12">
          {section.title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
          )}
          <div className="w-20 h-1 bg-gray-900 rounded-full" />
          {contentText && <p className="text-gray-600 mt-4 max-w-2xl">{contentText}</p>}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <div key={member.id} className="group border border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white">
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                {member.image ? (
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-4xl">{member.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
                <p className="text-gray-500 text-sm font-mono uppercase tracking-wider">{member.role}</p>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
