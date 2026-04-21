"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, HardHat, AlertCircle } from "lucide-react"
import { useServices } from "@/hooks/use-services"
import { getIcon } from "@/lib/icon-map"

export default function ServicesPage() {
  const { services, loading, error } = useServices()

  return (
    <main className="min-h-screen pt-20 pb-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Clean Header */}
        <div className="mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <div className="w-20 h-1 bg-gray-900 rounded-full mb-4" />
          <p className="text-gray-600 text-lg max-w-2xl">
            From concept to completion, we offer a full range of construction services to meet all your building needs.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-200 p-6">
                <Skeleton className="h-12 w-12 mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {services.map((service, index) => {
              const IconComponent = getIcon(service.icon)
              return (
                <Link key={service.id} href={`/services/${service.id}`}>
                  <div className="group border border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white p-6 cursor-pointer">
                    {/* Number */}
                    <span className="text-xs font-mono text-gray-400 mb-4 block">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    
                    {/* Icon */}
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-900 transition-colors duration-300">
                      {IconComponent ? (
                        <IconComponent className="h-6 w-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
                      ) : (
                        <HardHat className="h-6 w-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-400 group-hover:text-gray-900 transition-colors">
                      <span>Learn More</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gray-900 p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Need a Custom Solution?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl">
            Every project is unique. Contact us to discuss your specific requirements 
            and get a customized quote tailored to your needs.
          </p>
          <Link href="/#contact">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 border-0 rounded-none">
              Get Free Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
