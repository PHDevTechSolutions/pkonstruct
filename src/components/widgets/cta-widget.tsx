"use client"

import { Button } from "@/components/ui/button"
import type { PageSection } from "./types"

interface CTAWidgetProps {
  section: PageSection
}

export function CTAWidget({ section }: CTAWidgetProps) {
  // Handle content as string or object
  const contentText = typeof section.content === 'string' ? section.content : section.content?.subtitle || ''

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.title}</h2>
        {contentText && <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">{contentText}</p>}
        <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
          Get Started Today
        </Button>
      </div>
    </section>
  )
}
