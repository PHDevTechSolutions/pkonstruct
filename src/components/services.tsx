"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Home, 
  Building2, 
  Factory, 
  Hammer, 
  Paintbrush, 
  HardHat,
  Ruler,
  Truck
} from "lucide-react"

const services = [
  {
    icon: Home,
    title: "Residential Construction",
    description: "Custom homes, renovations, and additions built to your exact specifications with premium materials."
  },
  {
    icon: Building2,
    title: "Commercial Building",
    description: "Office buildings, retail spaces, and commercial complexes designed for functionality and aesthetics."
  },
  {
    icon: Factory,
    title: "Industrial Projects",
    description: "Warehouses, factories, and industrial facilities built to meet stringent safety standards."
  },
  {
    icon: Hammer,
    title: "Renovations",
    description: "Transform existing spaces with our expert renovation services, from kitchens to entire buildings."
  },
  {
    icon: Paintbrush,
    title: "Interior & Exterior Finishing",
    description: "Professional painting, flooring, and finishing touches that bring your project to completion."
  },
  {
    icon: HardHat,
    title: "Project Management",
    description: "End-to-end project management ensuring on-time delivery and within budget constraints."
  },
  {
    icon: Ruler,
    title: "Architectural Design",
    description: "Innovative architectural solutions tailored to your needs, combining form with function."
  },
  {
    icon: Truck,
    title: "Site Preparation",
    description: "Complete site preparation including excavation, grading, and foundation work."
  }
]

export function Services() {
  return (
    <section id="services" className="py-20 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-2 mb-4">
            Comprehensive Construction Solutions
          </h2>
          <p className="text-stone-600 text-lg">
            From concept to completion, we offer a full range of construction services to meet all your building needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-600 transition-colors duration-300">
                  <service.icon className="h-6 w-6 text-amber-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
