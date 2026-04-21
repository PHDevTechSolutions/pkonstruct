"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
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
    <main className="flex-1 bg-white">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/#projects"
            className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors text-sm font-mono"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-gray-700 text-white text-xs font-medium mb-4 font-mono">
                {project.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-gray-400 mb-6">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {project.year}
                </span>
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {project.client}
                </span>
              </div>
            </div>
            <div className="relative h-64 lg:h-80 border border-gray-700">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <span className="text-gray-500 font-medium">Project Image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Stats */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 border border-gray-200 bg-white">
              <div className="text-2xl font-bold text-gray-900">{project.duration}</div>
              <div className="text-gray-500 text-sm font-mono">Duration</div>
            </div>
            <div className="text-center p-6 border border-gray-200 bg-white">
              <div className="text-2xl font-bold text-gray-900">{project.size}</div>
              <div className="text-gray-500 text-sm font-mono">Size</div>
            </div>
            <div className="text-center p-6 border border-gray-200 bg-white">
              <div className="text-2xl font-bold text-gray-900">{project.team}</div>
              <div className="text-gray-500 text-sm font-mono">Team Size</div>
            </div>
            <div className="text-center p-6 border border-gray-200 bg-white">
              <div className="text-2xl font-bold text-gray-900">{project.year}</div>
              <div className="text-gray-500 text-sm font-mono">Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Challenge & Solution */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">The Challenge</h2>
                  <p className="text-gray-500 leading-relaxed">{project.challenge}</p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Solution</h2>
                  <p className="text-gray-500 leading-relaxed">{project.solution}</p>
                </div>
              </div>

              <div className="border-t border-gray-200" />

              {/* Results */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Results</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.results.map((result, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{result}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Gallery</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {project.gallery.map((img, index) => (
                    <div key={index} className="aspect-video bg-gray-100 border border-gray-200">
                      <img
                        src={img}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>

            {/* Right Column - Features */}
            <div>
              <div className="border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Project Features</h3>
                <ul className="space-y-3">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-500 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Box */}
              <div className="bg-gray-900 p-6">
                <h3 className="font-semibold text-lg mb-2 text-white">Start Your Project</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Ready to build something amazing? Let us bring your vision to life.
                </p>
                <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 rounded-none" asChild>
                  <Link href="/#contact">Get a Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation to other projects */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link 
              href={prevProject ? `/projects/${prevProject.id}` : "#"}
              className={`inline-flex items-center text-sm font-medium transition-colors ${
                prevProject ? "text-gray-600 hover:text-gray-900" : "text-gray-400 cursor-not-allowed"
              }`}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Project
            </Link>
            <Link 
              href={nextProject ? `/projects/${nextProject.id}` : "#"}
              className={`inline-flex items-center text-sm font-medium transition-colors ${
                nextProject ? "text-gray-600 hover:text-gray-900" : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Next Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
