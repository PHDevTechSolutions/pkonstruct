"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Phone, Mail, Link2 } from "lucide-react"
import { useTeam } from "@/hooks/use-team"

export function Team() {
  const { members, loading, error } = useTeam()

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Skeleton className="h-4 w-32 mx-auto mb-4" />
            <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-full mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Failed to load team members. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

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
          {members.map((member) => (
            <Card key={member.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}

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
                  {member.socialLinks?.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      className="p-2 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-600 transition-colors"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Link2 className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
