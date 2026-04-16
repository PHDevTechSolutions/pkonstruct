"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"

export function Hero() {
  return (
    <section id="home" className="relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-stone-900/40 z-10" />
        <div className="w-full h-full bg-stone-800" />
      </div>

      <div className="container mx-auto relative z-20 px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600/20 text-amber-400 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Building Excellence Since 2005
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Building Your Dreams Into Reality
          </h1>
          
          <p className="text-lg md:text-xl text-stone-300 mb-8 max-w-2xl">
            PKonstruct is a leading construction company specializing in residential, commercial, and industrial projects. We bring your vision to life with quality craftsmanship and innovative solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="bg-amber-600 hover:bg-amber-700 text-white">
              <Link href="#projects">
                View Our Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-stone-900">
              <Link href="#contact">
                <Phone className="mr-2 h-4 w-4" />
                Get Free Quote
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/20">
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-stone-400">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">20+</div>
              <div className="text-stone-400">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-stone-400">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
