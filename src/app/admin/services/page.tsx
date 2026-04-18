"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Pencil, Trash2, Plus, Search } from "lucide-react"
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
  
  // Search and Pagination states
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Services</h2>
          <p className="text-stone-500">Manage your services</p>
        </div>
        <Link href="/admin/services/new">
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4 mr-2" />
            New Service
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search services by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="p-6 text-red-600">
            {error}
          </CardContent>
        </Card>
      )}

      {!loading && !error && services.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-stone-500 mb-4">No services yet</p>
            <Link href="/admin/services/new">
              <Button variant="outline">Create your first service</Button>
            </Link>
          </CardContent>
        </Card>
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
                <p className="text-sm text-stone-500">
                  Showing {paginatedServices.length} of {filteredServices.length} services
                </p>
              </div>
              
              <div className="space-y-4">
                {paginatedServices.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{service.title}</h3>
                      <span className="text-sm text-stone-500">#{service.order}</span>
                    </div>
                    <p className="text-stone-600 text-sm line-clamp-2">{service.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-stone-100 px-2 py-1 rounded">{service.icon}</span>
                      <span className="text-sm text-stone-500">{service.features?.length || 0} features</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/services/edit/${service.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDeleteId(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-stone-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
