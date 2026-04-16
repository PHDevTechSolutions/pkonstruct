"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useProject, useProjects } from "@/hooks/use-projects"
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Building2, 
  CheckCircle2,
  Ruler,
  Users,
  Clock,
  ArrowRight,
  Loader2
} from "lucide-react"

interface ProjectDetailClientProps {
  id: string
}

export function ProjectDetailClient({ id }: ProjectDetailClientProps) {
  const { project, loading, error } = useProject(id)
  const { projects: allProjects } = useProjects()

  if (loading) {
    return (
      <main className="flex-1">
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
          <p className="mt-4 text-stone-600">Loading project...</p>
        </div>
      </main>
    )
  }

  if (error || !project) {
    return (
      <main className="flex-1">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-red-600">{error || "Project not found"}</p>
          <Button className="mt-4" asChild>
            <Link href="/#projects">Back to Projects</Link>
          </Button>
        </div>
      </main>
    )
  }

  const projectIndex = allProjects.findIndex((p) => p.id === id)
  const prevProject = projectIndex > 0 ? allProjects[projectIndex - 1] : null
  const nextProject = projectIndex < allProjects.length - 1 ? allProjects[projectIndex + 1] : null

  return (
    <main className="flex-1">
      {/* Back Navigation */}
      <div className="bg-stone-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/#projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-stone-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <span className="inline-block px-3 py-1 bg-amber-600 text-white text-sm font-medium rounded-full mb-4">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {project.title}
            </h1>
            <p className="text-xl text-stone-300 mb-8">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-6 text-stone-400">
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {project.location}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {project.year}
              </span>
              <span className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {project.client}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Project Stats */}
      <section className="py-12 bg-stone-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-stone-900">{project.duration}</div>
                <div className="text-stone-500 text-sm">Duration</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Ruler className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-stone-900">{project.size}</div>
                <div className="text-stone-500 text-sm">Size</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-stone-900">{project.team}</div>
                <div className="text-stone-500 text-sm">Team Size</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-stone-900">{project.year}</div>
                <div className="text-stone-500 text-sm">Completed</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Challenge & Solution */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900 mb-4">The Challenge</h2>
                  <p className="text-stone-600">{project.challenge}</p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-stone-900 mb-4">Our Solution</h2>
                  <p className="text-stone-600">{project.solution}</p>
                </div>
              </div>

              <Separator />

              {/* Results */}
              <div>
                <h2 className="text-2xl font-bold text-stone-900 mb-6">Project Results</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.results.map((result, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-stone-700">{result}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-stone-900 mb-6">Project Gallery</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {project.gallery.map((_, index) => (
                    <div key={index} className="aspect-video bg-stone-200 rounded-lg flex items-center justify-center">
                      <span className="text-stone-500 text-sm">Image {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>

            {/* Right Column - Features */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Project Features</h3>
                  <ul className="space-y-3">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-stone-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className="mt-6 bg-amber-600 text-white">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Start Your Project</h3>
                  <p className="text-amber-100 mb-4">
                    Ready to build something amazing? Let us bring your vision to life.
                  </p>
                  <Button className="w-full bg-white text-amber-600 hover:bg-amber-50" asChild>
                    <Link href="/#contact">Get a Quote</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation to other projects */}
      <section className="py-12 bg-stone-50 border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild disabled={!prevProject}>
              <Link href={prevProject ? `/projects/${prevProject.id}` : "#"}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Project
              </Link>
            </Button>
            <Button variant="outline" asChild disabled={!nextProject}>
              <Link href={nextProject ? `/projects/${nextProject.id}` : "#"}>
                Next Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
