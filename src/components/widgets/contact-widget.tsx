"use client"

import { Button } from "@/components/ui/button"
import type { PageSection } from "./types"

interface ContactWidgetProps {
  section: PageSection
}

export function ContactWidget({ section }: ContactWidgetProps) {
  // Handle content as string or object
  const contentText = typeof section.content === 'string' ? section.content : section.content?.text || ''

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {section.title && <h2 className="text-3xl font-bold mb-4 text-center text-foreground">{section.title}</h2>}
          {contentText && <p className="text-muted-foreground text-center mb-8">{contentText}</p>}
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
            />
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
