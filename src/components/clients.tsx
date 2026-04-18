"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useClients } from "@/hooks/use-clients"
import { getIcon } from "@/lib/icon-map"

export function Clients() {
  const { clients, loading, error } = useClients()

  if (loading) {
    return (
      <section className="py-16 bg-stone-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-4 w-32 mx-auto mb-4" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <Skeleton className="w-16 h-16 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-stone-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-400">Failed to load clients. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-stone-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">Trusted By</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
            Industry Leaders Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {clients.map((client) => {
            const IconComponent = getIcon(client.icon)
            return (
              <div
                key={client.id}
                className="flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-lg bg-stone-800 flex items-center justify-center group-hover:bg-amber-600 transition-colors duration-300">
                  <IconComponent className="h-8 w-8 text-stone-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-stone-400 text-sm text-center group-hover:text-white transition-colors">
                  {client.name}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-stone-400 text-sm">
            Join 100+ satisfied clients who trust PKonstruct with their construction needs
          </p>
        </div>
      </div>
    </section>
  )
}
