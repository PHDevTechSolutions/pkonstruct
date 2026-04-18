"use client"

import { useTestimonials } from "@/hooks/use-testimonials"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { PageSection } from "./types"

interface TestimonialsWidgetProps {
  section: PageSection
}

export function TestimonialsWidget({ section }: TestimonialsWidgetProps) {
  const { testimonials, loading } = useTestimonials()

  if (loading) return <div className="py-16 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>

  return (
    <section className="py-16 bg-stone-900 text-white">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-12 text-center">{section.title}</h2>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.filter(t => t.published).map((testimonial) => (
            <Card key={testimonial.id} className="bg-stone-800 border-stone-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <span key={i} className="text-amber-500">★</span>
                  ))}
                </div>
                <p className="text-stone-300 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {(testimonial.name || "A").charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{testimonial.name}</p>
                    <p className="text-sm text-stone-400">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
