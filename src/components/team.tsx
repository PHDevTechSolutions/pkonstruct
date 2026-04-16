"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, Link2 } from "lucide-react"

const teamMembers = [
  {
    name: "John Peterson",
    role: "Founder & CEO",
    experience: "25+ years",
    bio: "John founded PKonstruct in 2005 with a vision to deliver exceptional construction services. His leadership has grown the company from a small team to an industry leader.",
    phone: "+1 (555) 101-0001",
    email: "john@pkonstruct.com"
  },
  {
    name: "Maria Rodriguez",
    role: "Chief Operations Officer",
    experience: "18 years",
    bio: "Maria ensures every project runs smoothly from start to finish. Her expertise in project management has been key to our 100% on-time delivery record.",
    phone: "+1 (555) 101-0002",
    email: "maria@pkonstruct.com"
  },
  {
    name: "David Chen",
    role: "Head of Architecture",
    experience: "20 years",
    bio: "David brings creative vision and technical expertise to every project. His innovative designs have won multiple industry awards.",
    phone: "+1 (555) 101-0003",
    email: "david@pkonstruct.com"
  },
  {
    name: "Sarah Thompson",
    role: "Safety Director",
    experience: "15 years",
    bio: "Sarah maintains our impeccable safety record. Her rigorous safety protocols ensure zero accidents across all project sites.",
    phone: "+1 (555) 101-0004",
    email: "sarah@pkonstruct.com"
  }
]

export function Team() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Our Team</span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-2 mb-4">
            Meet the Experts
          </h2>
          <p className="text-stone-600 text-lg">
            Our leadership team brings decades of combined experience in construction, architecture, and project management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                {/* Avatar placeholder */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg text-stone-900">{member.name}</h3>
                  <p className="text-amber-600 text-sm font-medium">{member.role}</p>
                  <p className="text-stone-400 text-xs mt-1">{member.experience} experience</p>
                </div>

                <p className="text-stone-600 text-sm text-center mb-4 line-clamp-3">
                  {member.bio}
                </p>

                <div className="flex justify-center gap-3 pt-4 border-t border-stone-100">
                  <a
                    href={`tel:${member.phone}`}
                    className="p-2 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-600 transition-colors"
                    aria-label={`Call ${member.name}`}
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-600 transition-colors"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-600 transition-colors"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Link2 className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
