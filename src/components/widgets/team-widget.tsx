"use client"

import { useTeam } from "@/hooks/use-team"
import { Card, CardContent } from "@/components/ui/card"
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

  if (loading) return <div className="py-16 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></div>

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-4 text-center text-foreground">{section.title}</h2>}
        {contentText && <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">{contentText}</p>}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="text-center overflow-hidden bg-card">
              <div className="relative h-64 bg-muted">
                {member.image ? (
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/70">
                    <span className="text-muted-foreground text-4xl">{member.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-card-foreground">{member.name}</h3>
                <p className="text-primary text-sm">{member.role}</p>
                <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
