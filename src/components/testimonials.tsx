"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Robert Johnson",
    role: "Homeowner",
    location: "Beverly Hills, CA",
    rating: 5,
    text: "PKonstruct transformed our dream home into reality. Their attention to detail and quality craftsmanship exceeded our expectations. The team was professional throughout the entire process.",
    project: "Custom Villa Construction"
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "CEO, TechStart Inc.",
    location: "San Francisco, CA",
    rating: 5,
    text: "Working with PKonstruct on our new headquarters was an excellent experience. They delivered on time and within budget. The modern design perfectly represents our brand.",
    project: "Commercial Office Building"
  },
  {
    id: 3,
    name: "Michael Torres",
    role: "Factory Manager",
    location: "Detroit, MI",
    rating: 5,
    text: "Our new manufacturing facility is a testament to PKonstruct's industrial expertise. They understood our operational needs and built a space that increased our productivity by 40%.",
    project: "Manufacturing Facility"
  },
  {
    id: 4,
    name: "Emily Watson",
    role: "Property Developer",
    location: "Miami, FL",
    rating: 5,
    text: "I've worked with many construction companies, but PKonstruct stands out for their reliability and quality. Our apartment complex was completed ahead of schedule.",
    project: "Riverside Apartments"
  },
  {
    id: 5,
    name: "David Park",
    role: "Retail Chain Owner",
    location: "Austin, TX",
    rating: 5,
    text: "The mall extension project was complex, but PKonstruct handled it flawlessly. Their project management kept everything on track despite tight deadlines.",
    project: "Shopping Mall Extension"
  }
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it. Here's what our satisfied clients have to say about working with us.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="relative bg-card">
            <CardContent className="p-8 md:p-12">
              <Quote className="absolute top-6 right-6 h-16 w-16 text-primary/10" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>

              <blockquote className="text-xl md:text-2xl text-card-foreground mb-8 leading-relaxed relative z-10">
                "{testimonials[currentIndex].text}"
              </blockquote>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-card-foreground text-lg">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-muted-foreground">
                    {testimonials[currentIndex].role}
                  </div>
                  <div className="text-primary text-sm mt-1">
                    Project: {testimonials[currentIndex].project}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
