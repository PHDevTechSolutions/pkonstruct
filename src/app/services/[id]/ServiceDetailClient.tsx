"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useService } from "@/hooks/use-services"
import { getIcon } from "@/lib/icon-map"
import { 
  ArrowLeft, 
  CheckCircle,
  ArrowRight,
  Phone,
  Mail
} from "lucide-react"

interface ServiceDetailClientProps {
  serviceId: string
}

export default function ServiceDetailClient({ serviceId }: ServiceDetailClientProps) {
  const { service, loading, error } = useService(serviceId)

  if (loading) {
    return (
      <main className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-10 w-48 mb-8" />
          <Skeleton className="h-16 w-full mb-4" />
          <Skeleton className="h-8 w-3/4 mb-8" />
          <Skeleton className="h-64 w-full rounded-lg mb-8" />
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (error || !service) {
    return (
      <main className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Service Not Found</h1>
          <p className="text-stone-600 mb-6">The service you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/services">
            <Button>View All Services</Button>
          </Link>
        </div>
      </main>
    )
  }

  const IconComponent = getIcon(service.icon)
  const features = service.features || [
    "Professional project management",
    "Licensed and insured contractors",
    "Quality materials and craftsmanship",
    "On-time project delivery",
  ]

  return (
    <main className="min-h-screen pt-20 pb-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <Link 
          href="/services" 
          className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors text-sm font-mono"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {service.title}
          </h1>
          <div className="w-20 h-1 bg-gray-900 rounded-full mb-4" />
          <p className="text-lg text-gray-600">
            {service.description}
          </p>
        </div>

        {service.image && (
          <div className="mb-8 border border-gray-200">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        )}

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              {service.fullDescription || `${service.description} Our team of experienced professionals brings expertise and dedication to every project, ensuring exceptional results that exceed your expectations.`}
            </p>
            <Link href="/#contact">
              <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800 rounded-none px-8">
                Get a Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Features Box */}
          <div className="border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Key Features
            </h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-500 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900 p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Ready to Start Your Project?
          </h2>
          <p className="text-gray-400 mb-6 max-w-2xl">
            Contact us today to discuss your project requirements and get a free, 
            no-obligation quote from our team of experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/#contact">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-none w-full sm:w-auto">
                Request Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="tel:+15551234567">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 rounded-none w-full sm:w-auto">
                <Phone className="mr-2 h-4 w-4" />
                Call Us
              </Button>
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            Or email us at{" "}
            <a href="mailto:info@pkonstruct.com" className="text-white hover:underline">
              info@pkonstruct.com
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
