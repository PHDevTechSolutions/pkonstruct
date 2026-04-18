"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
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
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/services" 
          className="inline-flex items-center text-stone-600 hover:text-stone-900 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg bg-amber-100 flex items-center justify-center">
              <IconComponent className="h-8 w-8 text-amber-600" />
            </div>
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
              Our Services
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            {service.title}
          </h1>
          <p className="text-xl text-stone-600">
            {service.description}
          </p>
        </div>

        {service.image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">
              What We Offer
            </h2>
            <p className="text-stone-600 mb-6">
              {service.fullDescription || `${service.description} Our team of experienced professionals brings expertise and dedication to every project, ensuring exceptional results that exceed your expectations.`}
            </p>
            <Link href="/#contact">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                Get a Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">
                Key Features
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-stone-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-stone-900 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Ready to Start Your Project?
          </h2>
          <p className="text-stone-300 text-center mb-6 max-w-2xl mx-auto">
            Contact us today to discuss your project requirements and get a free, 
            no-obligation quote from our team of experts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/#contact">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto">
                Request Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="tel:+15551234567">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-stone-900 w-full sm:w-auto">
                <Phone className="mr-2 h-4 w-4" />
                Call Us
              </Button>
            </a>
          </div>
          <p className="text-stone-400 text-sm text-center mt-4">
            Or email us at{" "}
            <a href="mailto:info@pkonstruct.com" className="text-amber-500 hover:underline">
              <Mail className="inline h-4 w-4 mr-1" />
              info@pkonstruct.com
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
