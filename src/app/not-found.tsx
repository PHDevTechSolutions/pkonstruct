"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, HardHat } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center pt-20 pb-16">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-8">
          <HardHat className="h-24 w-24 text-amber-600 mx-auto mb-6" />
          <h1 className="text-6xl md:text-8xl font-bold text-stone-900 mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">
            Page Under Construction
          </h2>
          <p className="text-stone-600 text-lg max-w-md mx-auto mb-8">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved. 
            Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/services">
            <Button size="lg" variant="outline">
              View Services
            </Button>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-stone-300 rounded-md text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>
        </div>

        <div className="mt-12 p-6 bg-stone-100 rounded-lg max-w-lg mx-auto">
          <h3 className="font-semibold text-stone-900 mb-2">
            Looking for something specific?
          </h3>
          <p className="text-stone-600 text-sm mb-4">
            Try one of these popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link 
              href="/services" 
              className="px-4 py-2 bg-white rounded-md text-stone-600 hover:text-amber-600 hover:shadow transition-all"
            >
              Services
            </Link>
            <Link 
              href="/projects/residential-complex" 
              className="px-4 py-2 bg-white rounded-md text-stone-600 hover:text-amber-600 hover:shadow transition-all"
            >
              Projects
            </Link>
            <Link 
              href="/blog" 
              className="px-4 py-2 bg-white rounded-md text-stone-600 hover:text-amber-600 hover:shadow transition-all"
            >
              Blog
            </Link>
            <Link 
              href="/faq" 
              className="px-4 py-2 bg-white rounded-md text-stone-600 hover:text-amber-600 hover:shadow transition-all"
            >
              FAQ
            </Link>
            <Link 
              href="/#contact" 
              className="px-4 py-2 bg-white rounded-md text-stone-600 hover:text-amber-600 hover:shadow transition-all"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
