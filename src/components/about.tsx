"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Award, Users, Shield } from "lucide-react"

const values = [
  {
    icon: CheckCircle,
    title: "Quality Excellence",
    description: "We never compromise on quality. Every project is executed with precision and attention to detail."
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized with multiple industry awards for our innovative designs and sustainable practices."
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Our team consists of certified professionals with decades of combined industry experience."
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "We maintain rigorous safety standards, ensuring zero accidents across all our project sites."
  }
]

const milestones = [
  { year: "2005", event: "PKonstruct founded with 5 employees" },
  { year: "2010", event: "Completed 100th project milestone" },
  { year: "2015", event: "Expanded to commercial construction" },
  { year: "2020", event: "Achieved ISO 9001 certification" },
  { year: "2024", event: "500+ projects completed" }
]

export function About() {
  return (
    <section id="about" className="py-20 bg-stone-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">About Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              Building Excellence for Over Two Decades
            </h2>
            <p className="text-stone-300 text-lg mb-6">
              PKonstruct has established itself as a trusted name in the construction industry. Our commitment to quality, safety, and client satisfaction has made us the preferred choice for projects of all sizes.
            </p>
            <p className="text-stone-300 text-lg mb-8">
              From humble beginnings in 2005, we have grown into a full-service construction company with expertise spanning residential, commercial, and industrial sectors.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-stone-800 rounded-lg">
                <div className="text-3xl font-bold text-amber-500">150+</div>
                <div className="text-stone-400 text-sm">Team Members</div>
              </div>
              <div className="text-center p-4 bg-stone-800 rounded-lg">
                <div className="text-3xl font-bold text-amber-500">25+</div>
                <div className="text-stone-400 text-sm">Industry Awards</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {values.map((value, index) => (
              <Card key={index} className="bg-stone-800 border-stone-700">
                <CardContent className="p-6">
                  <value.icon className="h-8 w-8 text-amber-500 mb-4" />
                  <h3 className="font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-stone-400 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="border-t border-stone-800 pt-16">
          <h3 className="text-2xl font-bold text-center mb-12">Our Journey</h3>
          <div className="flex flex-wrap justify-center gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-amber-500 mb-1">{milestone.year}</div>
                <div className="text-stone-400 text-sm max-w-[150px]">{milestone.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
