"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useHome } from "@/hooks/use-home"
import { DynamicPage } from "@/components/dynamic-page"

export function Home() {
  const { home, loading, error } = useHome()

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-screen w-full" />
      </div>
    )
  }

  if (error || !home) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Failed to load home page</p>
      </div>
    )
  }

  return <DynamicPage sections={home.sections} />
}
