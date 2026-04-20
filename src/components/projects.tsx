"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProjects } from "@/hooks/use-projects"
import { MapPin, Calendar, ArrowRight, Loader2 } from "lucide-react"

const categories = ["All", "Residential", "Commercial", "Industrial"]

export function Projects() {
  const [activeCategory, setActiveCategory] = useState("All")
  const { projects, loading, error } = useProjects(activeCategory === "All" ? undefined : activeCategory)

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading projects...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Portfolio</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Featured Projects
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore our portfolio of successful construction projects across residential, commercial, and industrial sectors.
          </p>
        </div>

        <Tabs defaultValue="All" className="w-full mb-12">
          <TabsList className="flex justify-center flex-wrap h-auto gap-2">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => setActiveCategory(category)}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found in this category.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 bg-card">
              <Link href={`/projects/${project.id}`}>
                <div className="relative h-64 bg-muted">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/70">
                      <span className="text-muted-foreground font-medium">Project Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>
              </Link>
              <CardContent className="p-6">
                <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                  <h3 className="text-xl font-bold text-card-foreground mb-2">{project.title}</h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {project.year}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0" asChild>
                    <Link href={`/projects/${project.id}`}>
                      View
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/projects">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
