"use client"

import Image from "next/image"
import type { PageSection } from "./types"

interface ImageWidgetProps {
  section: PageSection
}

export function ImageWidget({ section }: ImageWidgetProps) {
  if (!section.image) return null

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative h-96 rounded-lg overflow-hidden">
          <Image src={section.image} alt={section.title} fill className="object-cover" />
        </div>
        {section.title && <p className="text-center text-stone-500 mt-4">{section.title}</p>}
      </div>
    </section>
  )
}
