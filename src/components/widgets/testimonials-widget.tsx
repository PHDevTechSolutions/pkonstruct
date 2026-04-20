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

  if (loading) return <div className="py-16 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></div>

  return (
    <section className="py-16 bg-background text-foreground">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-12 text-center">{section.title}</h2>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.filter(t => t.published).map((testimonial) => (
            <Card key={testimonial.id} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <span key={i} className="text-primary">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {(testimonial.name || "A").charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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
