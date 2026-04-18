"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, ArrowRight, Loader2, X } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  category: string
  location: string
  year: string
  status: string
  image: string
  featured: boolean
}

const PROJECTS_PER_PAGE = 9
const categories = ["All", "Residential", "Commercial", "Industrial"]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const snapshot = await getDocs(collection(db, "projects"))
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[]
        setProjects(data)
        setFilteredProjects(data)
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError("Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...projects]
    
    // Category filter
    if (activeCategory !== "All") {
      filtered = filtered.filter((p) => p.category === activeCategory)
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((p) => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query)
      )
    }
    
    setFilteredProjects(filtered)
    setCurrentPage(1)
  }, [searchQuery, activeCategory, projects])

  // Pagination
  const totalProjects = filteredProjects.length
  const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE
  const currentProjects = filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  const clearSearch = () => {
    setSearchQuery("")
    setActiveCategory("All")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-stone-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-amber-500 font-medium text-sm tracking-wider uppercase">
              Our Portfolio
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              All Projects
            </h1>
            <p className="text-stone-400 text-lg">
              Explore our complete portfolio of construction projects across residential, 
              commercial, and industrial sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="bg-white border-b py-6 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-stone-400" />
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category ? "bg-amber-600 hover:bg-amber-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-sm text-stone-500 whitespace-nowrap">
              {totalProjects} project{totalProjects !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {currentProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-stone-500 text-lg mb-4">No projects found</p>
              <Button onClick={clearSearch} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                    <Link href={`/projects/${project.id}`}>
                      <div className="relative h-56 bg-stone-200">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-stone-300">
                            <span className="text-stone-500 font-medium">Project Image</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-amber-600 text-white text-sm font-medium rounded-full">
                            {project.category}
                          </span>
                        </div>
                        {project.featured && (
                          <div className="absolute top-4 right-4">
                            <span className="px-2 py-1 bg-white/90 text-amber-600 text-xs font-medium rounded">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl text-stone-900 mb-2 group-hover:text-amber-600 transition-colors">
                        <Link href={`/projects/${project.id}`}>
                          {project.title}
                        </Link>
                      </h3>
                      <p className="text-stone-600 text-sm line-clamp-2 mb-4">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-stone-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {project.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {project.year}
                          </span>
                        </div>
                        <Link 
                          href={`/projects/${project.id}`}
                          className="text-amber-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          View <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {getPageNumbers().map((page, index) =>
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 py-1 text-stone-500">...</span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page as number)}
                        className={currentPage === page ? "bg-amber-600 hover:bg-amber-700" : ""}
                      >
                        {page}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
