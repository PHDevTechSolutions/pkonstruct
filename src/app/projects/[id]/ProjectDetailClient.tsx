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
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Tag,
  TrendingUp,
  Target
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ProjectDetailClientProps {
  id: string
}

export function ProjectDetailClient({ id }: ProjectDetailClientProps) {
  const { project, loading, error } = useProject(id)
  const { projects: allProjects } = useProjects()

  if (loading) {
    return (
      <main className="flex-1 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
        <div className="container mx-auto px-4 py-32 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <Loader2 className="h-12 w-12 mx-auto text-blue-600" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600 text-lg"
          >
            Loading project...
          </motion.p>
        </div>
      </main>
    )
  }

  if (error || !project) {
    return (
      <main className="flex-1 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
        <div className="container mx-auto px-4 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 mb-6 text-lg">{error || "Project not found"}</p>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg transition-all rounded-full px-6"
              asChild
            >
              <Link href="/#projects">Back to Projects</Link>
            </Button>
          </motion.div>
        </div>
      </main>
    )
  }

  const projectIndex = allProjects.findIndex((p) => p.id === id)
  const prevProject = projectIndex > 0 ? allProjects[projectIndex - 1] : null
  const nextProject = projectIndex < allProjects.length - 1 ? allProjects[projectIndex + 1] : null

  return (
    <main className="flex-1">
      {/* Modern Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          {project.image ? (
            <>
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" />
          )}
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-16">
          <div className="container mx-auto px-4 py-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="/#projects"
                className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm font-medium backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 border border-white/20 hover:bg-white/20"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Projects
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                <Tag className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm font-medium">{project.category}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
                {project.title}
              </h1>

              {/* Description */}
              <p className="text-xl text-white/90 mb-6 max-w-2xl leading-relaxed">
                {project.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 text-white/80 text-sm">
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Stats */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 border-b border-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{project.duration}</div>
              <div className="text-gray-500 text-sm font-medium">Duration</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Ruler className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{project.size}</div>
              <div className="text-gray-500 text-sm font-medium">Size</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{project.team}</div>
              <div className="text-gray-500 text-sm font-medium">Team Size</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{project.year}</div>
              <div className="text-gray-500 text-sm font-medium">Completed</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Challenge & Solution */}
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">The Challenge</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{project.challenge}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Our Solution</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{project.solution}</p>
                </motion.div>
              </div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Project Results</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.results.map((result, index) => (
                    <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700">{result}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Project Gallery</h2>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {project.gallery.map((img, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="aspect-video rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        <img
                          src={img}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Features */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 mb-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Project Features</h3>
                </div>
                <ul className="space-y-3">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* CTA Box */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 shadow-2xl text-white"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Start Your Project</h3>
                <p className="text-blue-100 text-sm mb-6">
                  Ready to build something amazing? Let us bring your vision to life.
                </p>
                <Button 
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-full shadow-lg transition-all hover:shadow-xl" 
                  asChild
                >
                  <Link href="/#contact">Get a Quote</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Navigation to other projects */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 border-t border-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center"
          >
            <Link 
              href={prevProject ? `/projects/${prevProject.id}` : "#"}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                prevProject 
                  ? "border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50" 
                  : "border-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium">Previous Project</span>
            </Link>
            <Link 
              href={nextProject ? `/projects/${nextProject.id}` : "#"}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                nextProject 
                  ? "border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50" 
                  : "border-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              <span className="font-medium">Next Project</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
