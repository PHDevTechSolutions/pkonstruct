"use client"

import { useTestimonials } from "@/hooks/use-testimonials"
import { motion } from "framer-motion"
import { Loader2, Star, Quote, User, Sparkles, MessageCircle, Heart } from "lucide-react"
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
          className={`w-5 h-5 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  )
}

export function TestimonialsWidget({ section }: TestimonialsWidgetProps) {
  const { testimonials, loading } = useTestimonials()

  const contentText = typeof section.content === 'object' ? section.content?.text : ''
  const publishedTestimonials = testimonials.filter(t => t.published)

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6"
            >
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            </motion.div>
            <p className="text-gray-600 text-lg">Loading testimonials...</p>
          </div>
        </div>
      </section>
    )
  }

  if (publishedTestimonials.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Modern Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-4 py-2 mb-6">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-semibold">Client Stories</span>
          </div>
          {section.title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
          )}
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6" />
          {contentText && (
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">{contentText}</p>
          )}
        </motion.div>

        {/* Testimonials Grid - Modern Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
            >
              {/* Quote decoration */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-50"></div>
              <div className="absolute top-6 right-6 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 z-10">
                <Quote className="w-5 h-5 text-white" />
              </div>
              
              <div className="p-6 relative z-10">
                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating || 5} />
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-600 mb-6 leading-relaxed text-sm">
                  "{testimonial.text}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center overflow-hidden shadow-md">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  
                  {/* Name and Role */}
                  <div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {testimonial.role}
                      {testimonial.company && (
                        <span className="text-blue-600"> · {testimonial.company}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators - Modern Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-4"
        >
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-md shadow-gray-200/50 border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Rated 4.9/5</p>
              <p className="text-xs text-gray-500">by {publishedTestimonials.length}+ clients</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-md shadow-gray-200/50 border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">100% Verified</p>
              <p className="text-xs text-gray-500">Authentic reviews only</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-md shadow-gray-200/50 border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Top Rated</p>
              <p className="text-xs text-gray-500">Construction company</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
