"use client"

import { useState, useEffect } from "react"
import { useInquiries, Inquiry } from "@/hooks/use-inquiries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Trash2, 
  Archive, 
  Mail, 
  MailOpen, 
  Reply, 
  Loader2,
  CheckCircle,
  X,
  Inbox,
  FileText,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Terminal,
  ArrowUpRight,
  Eye,
  Send
} from "lucide-react"
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
import { format } from "date-fns"

const ITEMS_PER_PAGE = 10

const statusColors = {
  new: "bg-red-500/10 text-red-400 border-red-500/20",
  read: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  replied: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  archived: "bg-gray-500/10 text-gray-400 border-gray-500/20",
}

const statusLabels = {
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
}

export default function InquiriesManagementPage() {
  const { 
    inquiries, 
    stats, 
    loading, 
    error, 
    fetchInquiries,
    updateInquiry,
    deleteInquiry,
    deleteMultipleInquiries,
    markAsReplied 
  } = useInquiries()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "read" | "replied" | "archived">("all")
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([])
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [notes, setNotes] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [inquiryToDelete, setInquiryToDelete] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter and paginate inquiries
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = !searchQuery || 
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredInquiries.length / ITEMS_PER_PAGE)
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSelectAll = () => {
    if (selectedInquiries.length === paginatedInquiries.length) {
      setSelectedInquiries([])
    } else {
      setSelectedInquiries(paginatedInquiries.map(i => i.id))
    }
  }

  const handleSelectInquiry = (id: string) => {
    setSelectedInquiries(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleStatusChange = async (id: string, status: "new" | "read" | "replied" | "archived") => {
    await updateInquiry(id, { status })
  }

  const handleDelete = async () => {
    if (inquiryToDelete) {
      await deleteInquiry(inquiryToDelete)
      setInquiryToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleBulkDelete = async () => {
    await deleteMultipleInquiries(selectedInquiries)
    setSelectedInquiries([])
    setDeleteDialogOpen(false)
  }

  const handleBulkArchive = async () => {
    await Promise.all(selectedInquiries.map(id => updateInquiry(id, { status: 'archived' })))
    setSelectedInquiries([])
  }

  const handleViewInquiry = async (inquiry: Inquiry) => {
    setViewingInquiry(inquiry)
    setReplyMessage("")
    setNotes(inquiry.notes || "")
    
    // Mark as read if new
    if (inquiry.status === 'new') {
      await updateInquiry(inquiry.id, { status: 'read' })
    }
  }

  const handleReply = async () => {
    if (!viewingInquiry || !replyMessage.trim()) return
    
    setIsReplying(true)
    await markAsReplied(viewingInquiry.id, replyMessage)
    setIsReplying(false)
    setReplyMessage("")
    
    // Update local state
    setViewingInquiry(prev => prev ? { ...prev, status: 'replied', replyMessage } : null)
  }

  const handleSaveNotes = async () => {
    if (!viewingInquiry) return
    await updateInquiry(viewingInquiry.id, { notes })
  }

  return (
    <div className={cn("space-y-6 transition-all duration-500", mounted ? "opacity-100" : "opacity-0")}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30">
              <Mail className="h-5 w-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Inquiries</h1>
          </div>
          <p className="text-gray-500 font-mono text-sm">// Manage contact form submissions</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => fetchInquiries()}
          disabled={loading}
          className="border-gray-700 text-gray-400 hover:text-white hover:border-cyan-500/50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#1a1a1a] border-[#333] hover:border-red-500/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New</p>
                <p className="text-2xl font-bold text-red-400">{stats.new}</p>
              </div>
              <Mail className="h-8 w-8 text-red-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-[#333] hover:border-cyan-500/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Read</p>
                <p className="text-2xl font-bold text-cyan-400">{stats.read}</p>
              </div>
              <MailOpen className="h-8 w-8 text-cyan-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-[#333] hover:border-emerald-500/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Replied</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.replied}</p>
              </div>
              <Reply className="h-8 w-8 text-emerald-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-[#333] hover:border-gray-500/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-300">{stats.total}</p>
              </div>
              <Inbox className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#1a1a1a] border-[#333]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name, email, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#111] border-[#333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "new" | "read" | "replied" | "archived")}
              className="h-10 px-3 rounded-md bg-[#111] border border-[#333] text-gray-400 focus:border-cyan-500/50 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedInquiries.length > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#333]">
              <span className="text-sm text-gray-500">
                {selectedInquiries.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkArchive}
                className="border-gray-700 text-gray-400 hover:text-white hover:border-cyan-500/50"
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setInquiryToDelete(null)
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inquiries Table */}
      <Card className="bg-[#1a1a1a] border-[#333] overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-[#252525]" />
              ))}
            </div>
          ) : paginatedInquiries.length === 0 ? (
            <div className="text-center py-12">
              <Inbox className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No inquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#333] bg-[#111]">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedInquiries.length === paginatedInquiries.length && paginatedInquiries.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-[#333] bg-[#1a1a1a] text-cyan-500 focus:ring-cyan-500/20"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333]">
                  {paginatedInquiries.map((inquiry) => (
                    <tr 
                      key={inquiry.id}
                      className="hover:bg-[#222] transition-colors group"
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedInquiries.includes(inquiry.id)}
                          onChange={() => handleSelectInquiry(inquiry.id)}
                          className="rounded border-[#333] bg-[#1a1a1a] text-cyan-500 focus:ring-cyan-500/20"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={cn("text-xs", statusColors[inquiry.status])}>
                          {statusLabels[inquiry.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-white font-medium">{inquiry.name}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{inquiry.email}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm max-w-[200px] truncate">{inquiry.subject}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {format(inquiry.createdAt.toDate(), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInquiry(inquiry)}
                            className="text-gray-400 hover:text-white hover:bg-[#333]"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <select
                            value={inquiry.status}
                            onChange={(e) => handleStatusChange(inquiry.id, e.target.value as "new" | "read" | "replied" | "archived")}
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 px-2 text-xs rounded bg-[#252525] border-[#333] text-gray-400 focus:border-cyan-500/50 focus:outline-none"
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              setInquiryToDelete(inquiry.id)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredInquiries.length)} of {filteredInquiries.length} inquiries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-[#333] text-gray-400 hover:text-white hover:border-cyan-500/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-[#333] text-gray-400 hover:text-white hover:border-cyan-500/50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {viewingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-[#333]">
            <CardContent className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#333] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30">
                    <Mail className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Inquiry Details</h2>
                    <p className="text-gray-500 text-sm">
                      From {viewingInquiry.name} • {viewingInquiry.createdAt && format(viewingInquiry.createdAt.toDate(), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewingInquiry(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#111] rounded-lg border border-[#333]">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Name</p>
                  <p className="text-white font-medium">{viewingInquiry.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Email</p>
                  <a href={`mailto:${viewingInquiry.email}`} className="text-cyan-400 hover:underline font-medium">
                    {viewingInquiry.email}
                  </a>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase mb-1">Subject</p>
                  <p className="text-white font-medium">{viewingInquiry.subject}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                  <Badge variant="outline" className={cn("text-xs", statusColors[viewingInquiry.status])}>
                    {statusLabels[viewingInquiry.status]}
                  </Badge>
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Message</p>
                <div className="p-4 bg-[#111] rounded-lg border border-[#333] text-gray-300 whitespace-pre-wrap min-h-[100px]">
                  {viewingInquiry.message}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Internal Notes</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add private notes about this inquiry..."
                  className="w-full p-3 bg-[#111] border border-[#333] rounded-lg text-gray-300 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none min-h-[80px] resize-none"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSaveNotes}
                  className="mt-2 border-gray-700 text-gray-400 hover:text-white hover:border-cyan-500/50"
                >
                  Save Notes
                </Button>
              </div>

              {/* Reply Section */}
              {viewingInquiry.status !== 'replied' && (
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-2">Reply</p>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full p-3 bg-[#111] border border-[#333] rounded-lg text-gray-300 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none min-h-[120px] resize-none"
                  />
                </div>
              )}

              {/* Previous Reply */}
              {viewingInquiry.replyMessage && (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <p className="text-xs text-emerald-400 font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    Your Reply ({viewingInquiry.repliedAt && format(viewingInquiry.repliedAt.toDate(), 'MMM d, h:mm a')})
                  </p>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{viewingInquiry.replyMessage}</p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#333]">
                <Button 
                  variant="outline" 
                  onClick={() => setViewingInquiry(null)}
                  className="border-gray-700 text-gray-400 hover:text-white hover:border-cyan-500/50"
                >
                  Close
                </Button>
                {viewingInquiry.status !== 'replied' && (
                  <Button 
                    onClick={handleReply}
                    disabled={!replyMessage.trim() || isReplying}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0"
                  >
                    {isReplying ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1a1a1a] border-[#333]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {inquiryToDelete 
                ? "Are you sure you want to delete this inquiry? This action cannot be undone."
                : `Are you sure you want to delete ${selectedInquiries.length} selected inquiries? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setInquiryToDelete(null)}
              className="border-gray-700 text-gray-400 hover:text-white hover:border-cyan-500/50 bg-transparent"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={inquiryToDelete ? handleDelete : handleBulkDelete}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
