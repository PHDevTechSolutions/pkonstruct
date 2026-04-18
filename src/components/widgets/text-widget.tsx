"use client"

import type { PageSection } from "./types"

interface TextWidgetProps {
  section: PageSection
}

export function TextWidget({ section }: TextWidgetProps) {
  // Handle content as string or object
  const content = typeof section.content === 'string' 
    ? section.content 
    : section.content?.text || ''
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {section.title && <h2 className="text-3xl font-bold mb-6 text-center">{section.title}</h2>}
          <div className="prose prose-lg max-w-none text-stone-600">
            {content.split('\n').map((paragraph: string, idx: number) => (
              <p key={idx} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
