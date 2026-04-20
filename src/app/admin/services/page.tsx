"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Pencil, Trash2, Plus, Search, Briefcase, Terminal } from "lucide-react"
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

interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  order: number
}

export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Search and Pagination states
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, "services"))
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[]
        setServices(data.sort((a, b) => a.order - b.order))
      } catch (err) {
        console.error("Error fetching services:", err)
        setError("Failed to load services")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    
    setDeleting(true)
    try {
      await deleteDoc(doc(db, "services", deleteId))
      setServices(services.filter((s) => s.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      console.error("Error deleting service:", err)
      alert("Failed to delete service")
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
            <div className="p-2 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30">
              <Briefcase className="h-5 w-5 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Services</h1>
          </div>
          <p className="text-gray-500 font-mono text-sm">// Manage your services</p>
        </div>
        <Link href="/admin/services/new">
          <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-0 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Plus className="h-4 w-4 mr-2" />
            New Service
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#111111] rounded-xl border border-[#222222]">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search services by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10 bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-500 focus:border-amber-500/50 focus:ring-amber-500/20"
          />
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

      {!loading && !error && services.length === 0 && (
        <div className="rounded-2xl bg-[#111111] border border-[#222222] p-8 text-center">
          <div className="p-4 bg-[#1a1a1a] rounded-full w-fit mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-gray-500" />
          </div>
          <p className="text-gray-400 mb-4 font-mono">// No services found</p>
          <Link href="/admin/services/new">
            <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300">
              Create your first service
            </Button>
          </Link>
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <>
        {(() => {
          // Filter services
          const filteredServices = services.filter(service => {
            const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 service.description?.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesSearch
          })
          
          // Pagination
          const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
          const paginatedServices = filteredServices.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )
          
          return (
            <>
              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 font-mono">
                  // Showing {paginatedServices.length} of {filteredServices.length} services
                </p>
              </div>
              
              <div className="space-y-3">
                {paginatedServices.map((service) => (
                  <div 
                    key={service.id}
                    className="group rounded-2xl bg-[#111111] border border-[#222222] p-5 hover:border-[#333333] transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-white group-hover:text-amber-400 transition-colors">{service.title}</h3>
                          <span className="text-xs text-gray-500 font-mono px-2 py-0.5 bg-[#1a1a1a] rounded">#{service.order}</span>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">{service.description}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="px-2 py-1 bg-[#1a1a1a] rounded text-xs text-gray-400 font-mono border border-[#333333]">
                            {service.icon}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">{service.features?.length || 0} features</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/services/edit/${service.id}`}>
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
                          onClick={() => setDeleteId(service.id)}
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
              Delete Service
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this service? This action cannot be undone.
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
