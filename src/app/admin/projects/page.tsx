"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Eye, Search, FolderKanban, Terminal } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

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

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Search, Filter, and Pagination states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Get unique categories and statuses
  const categories = [...new Set(projects.map(p => p.category).filter(Boolean))]
  const statuses = [...new Set(projects.map(p => p.status).filter(Boolean))]

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"))
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[]
        setProjects(data)
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError("Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    
    setDeleting(true)
    try {
      await deleteDoc(doc(db, "projects", deleteId))
      setProjects(projects.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      console.error("Error deleting project:", err)
      alert("Failed to delete project")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className={cn("space-y-6 transition-all duration-500", mounted ? "opacity-100" : "opacity-0")}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
              <FolderKanban className="h-5 w-5 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
          </div>
          <p className="text-gray-500 font-mono text-sm">// Manage your portfolio projects</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#111111] rounded-xl border border-[#222222]">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search projects by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10 bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-gray-300 focus:border-purple-500/50 focus:outline-none"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-gray-300 focus:border-purple-500/50 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
              <Skeleton className="h-6 w-1/3 mb-2 bg-[#222222]" />
              <Skeleton className="h-4 w-full bg-[#222222]" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-[#111111] border border-red-500/30 p-6">
          <div className="flex items-center gap-3 text-red-400">
            <Terminal className="h-5 w-5" />
            <span className="font-mono">Error: {error}</span>
          </div>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="rounded-2xl bg-[#111111] border border-[#222222] p-8 text-center">
          <div className="p-4 bg-[#1a1a1a] rounded-full w-fit mx-auto mb-4">
            <FolderKanban className="h-8 w-8 text-gray-500" />
          </div>
          <p className="text-gray-400 mb-4 font-mono">// No projects found</p>
          <Link href="/admin/projects/new">
            <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
              Create your first project
            </Button>
          </Link>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <>
        {(() => {
          // Filter projects
          const filteredProjects = projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 project.description?.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === "all" || project.status === statusFilter
            const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
            return matchesSearch && matchesStatus && matchesCategory
          })
          
          // Pagination
          const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
          const paginatedProjects = filteredProjects.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )
          
          return (
            <>
              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 font-mono">
                  // Showing {paginatedProjects.length} of {filteredProjects.length} projects
                </p>
              </div>
              
              <div className="space-y-3">
                {paginatedProjects.map((project) => (
                  <div 
                    key={project.id}
                    className="group rounded-2xl bg-[#111111] border border-[#222222] p-5 hover:border-[#333333] transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-semibold text-lg text-white group-hover:text-purple-400 transition-colors">{project.title}</h3>
                          {project.featured && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 font-mono flex-wrap">
                          <span className="px-2 py-1 bg-[#1a1a1a] rounded">{project.category}</span>
                          <span className="text-gray-600">•</span>
                          <span>{project.location}</span>
                          <span className="text-gray-600">•</span>
                          <span>{project.year}</span>
                          <span className="text-gray-600">•</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium border",
                            project.status === "Completed" 
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          )}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link href={`/projects/${project.id}`} target="_blank">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/projects/edit/${project.id}`}>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-gray-500 hover:text-amber-400 hover:bg-amber-500/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => setDeleteId(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222] hover:border-[#444444] disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500 font-mono px-3 py-1 bg-[#111111] rounded-lg border border-[#222222]">
                    Page {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222] hover:border-[#444444] disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )
        })()}
        </>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#111111] border-[#333333] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-400" />
              Delete Project
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#1a1a1a] border-[#333333] text-gray-300 hover:bg-[#222222] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 hover:text-red-300"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
