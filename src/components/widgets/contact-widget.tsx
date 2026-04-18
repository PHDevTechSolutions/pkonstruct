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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {section.title && <h2 className="text-3xl font-bold mb-4 text-center">{section.title}</h2>}
          {contentText && <p className="text-stone-600 text-center mb-8">{contentText}</p>}
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
