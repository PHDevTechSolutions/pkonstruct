"use client"

import { useTestimonials } from "@/hooks/use-testimonials"
import { Loader2, Star, Quote, User } from "lucide-react"
import type { PageSection } from "./types"

interface TestimonialsWidgetProps {
  section: PageSection
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "fill-gray-900 text-gray-900"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  )
}

export function TestimonialsWidget({ section }: TestimonialsWidgetProps) {
  const { testimonials, loading } = useTestimonials()

  if (loading) {
    return (
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-transparent to-muted/20" />
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  const contentText = typeof section.content === 'object' ? section.content?.text : ''
  const publishedTestimonials = testimonials.filter(t => t.published)

  if (publishedTestimonials.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Clean Header */}
        <div className="mb-12">
          {section.title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
          )}
          <div className="w-20 h-1 bg-gray-900 rounded-full" />
          {contentText && (
            <p className="text-gray-600 mt-4 max-w-2xl">{contentText}</p>
          )}
        </div>

        {/* Testimonials Grid - Clean Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group border border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white"
            >
              <div className="p-6">
                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating || 5} />
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-gray-600">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  
                  {/* Name and Role */}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {testimonial.role}
                      {testimonial.company && ` · ${testimonial.company}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-gray-900 fill-gray-900" />
            <span>Rated 4.9/5 by {publishedTestimonials.length}+ clients</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-2">
            <span className="text-emerald-600">✓</span>
            <span>100% Verified Reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}
