"use client"

import { Building2, Hotel, Store, Warehouse, Home, Factory, Landmark, Castle } from "lucide-react"

const clients = [
  { name: "Marriott Hotels", icon: Hotel },
  { name: "Home Depot", icon: Store },
  { name: "Amazon Logistics", icon: Warehouse },
  { name: "Lennar Homes", icon: Home },
  { name: "Tesla Motors", icon: Factory },
  { name: "Wells Fargo", icon: Landmark },
  { name: "Hyatt Resorts", icon: Castle },
  { name: "CBRE Group", icon: Building2 }
]

export function Clients() {
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
          {clients.map((client, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-lg bg-stone-800 flex items-center justify-center group-hover:bg-amber-600 transition-colors duration-300">
                <client.icon className="h-8 w-8 text-stone-400 group-hover:text-white transition-colors" />
              </div>
              <span className="text-stone-400 text-sm text-center group-hover:text-white transition-colors">
                {client.name}
              </span>
            </div>
          ))}
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
