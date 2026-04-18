"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, HardHat, AlertCircle } from "lucide-react"
import { useServices } from "@/hooks/use-services"
import { getIcon } from "@/lib/icon-map"

export default function ServicesPage() {
  const { services, loading, error } = useServices()

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">What We Do</span>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mt-2 mb-4">
            Our Services
          </h1>
          <p className="text-stone-600 text-lg">
            From concept to completion, we offer a full range of construction services to meet all your building needs.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service) => {
              const IconComponent = getIcon(service.icon)
              return (
                <Card key={service.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-600 transition-colors duration-300">
                      {IconComponent ? (
                        <IconComponent className="h-6 w-6 text-amber-600 group-hover:text-white transition-colors duration-300" />
                      ) : (
                        <HardHat className="h-6 w-6 text-amber-600 group-hover:text-white transition-colors duration-300" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-stone-600 text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <Link href={`/services/${service.id}`}>
                      <Button variant="outline" className="w-full group/btn">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <div className="bg-stone-900 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-stone-300 mb-6 max-w-2xl mx-auto">
            Every project is unique. Contact us to discuss your specific requirements 
            and get a customized quote tailored to your needs.
          </p>
          <Link href="/#contact">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              Get Free Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
