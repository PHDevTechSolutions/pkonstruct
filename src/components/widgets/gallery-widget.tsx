"use client"

import Image from "next/image"
import type { PageSection } from "./types"

interface GalleryWidgetProps {
  section: PageSection
}

export function GalleryWidget({ section }: GalleryWidgetProps) {
  // Handle content as string or object
  const contentStr = typeof section.content === 'string' ? section.content : ''
  const images = contentStr ? contentStr.split(',').map(url => url.trim()) : []

  return (
    <section className="py-16 bg-stone-50">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-12 text-center">{section.title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
              <Image
                src={url}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
