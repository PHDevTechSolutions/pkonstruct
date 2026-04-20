"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useAbout } from "@/hooks/use-about"
import { DynamicPage } from "@/components/dynamic-page"

export function About() {
  const { about, loading, error } = useAbout()

  if (loading) {
    return (
      <section id="about" className="py-20 bg-background text-foreground">
        <div className="container mx-auto px-4">
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-10 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-6 w-full mb-4" />
        </div>
      </section>
    )
  }

  if (error || !about) {
    return (
      <section id="about" className="py-20 bg-background text-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-destructive">Failed to load about information. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  return <DynamicPage sections={about.sections} />
}
