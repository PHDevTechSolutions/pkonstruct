"use client"

import { useState } from "react"
import { FileText, Download, FileImage, FileSpreadsheet, FileArchive, ExternalLink, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PageSection } from "./types"

interface DownloadsWidgetProps {
  section: PageSection
}

interface DownloadFile {
  id: string
  title: string
  description: string
  fileUrl: string
  fileType: "pdf" | "doc" | "image" | "spreadsheet" | "archive"
  fileSize: string
}

const iconMap = {
  pdf: FileText,
  doc: FileText,
  image: FileImage,
  spreadsheet: FileSpreadsheet,
  archive: FileArchive
}

const typeConfig = {
  pdf: { 
    color: "text-red-600", 
    bg: "bg-red-50",
    border: "border-red-200",
    label: "PDF"
  },
  doc: { 
    color: "text-blue-600", 
    bg: "bg-blue-50",
    border: "border-blue-200",
    label: "DOC"
  },
  image: { 
    color: "text-purple-600", 
    bg: "bg-purple-50",
    border: "border-purple-200",
    label: "IMG"
  },
  spreadsheet: { 
    color: "text-emerald-600", 
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    label: "XLS"
  },
  archive: { 
    color: "text-amber-600", 
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "ZIP"
  }
}

export function DownloadsWidget({ section }: DownloadsWidgetProps) {
  let files: DownloadFile[] = []
  try {
    const contentToParse = typeof section.content === 'string' ? section.content : JSON.stringify(section.content)
    files = JSON.parse(contentToParse || "[]")
  } catch {
    files = [
      {
        id: "1",
        title: "Company Profile",
        description: "Complete company overview and services",
        fileUrl: "#",
        fileType: "pdf",
        fileSize: "2.5 MB"
      },
      {
        id: "2",
        title: "Service Catalog",
        description: "Detailed service offerings and pricing",
        fileUrl: "#",
        fileType: "pdf",
        fileSize: "1.8 MB"
      },
      {
        id: "3",
        title: "Project Portfolio",
        description: "Showcase of completed projects",
        fileUrl: "#",
        fileType: "pdf",
        fileSize: "4.2 MB"
      },
      {
        id: "4",
        title: "Safety Standards",
        description: "Our safety protocols and certifications",
        fileUrl: "#",
        fileType: "doc",
        fileSize: "856 KB"
      }
    ]
  }

  const contentText = typeof section.content === 'string' ? section.content : section.content?.text || ''
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([])

  const handleDownload = (fileId: string) => {
    setDownloadedFiles(prev => [...prev, fileId])
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Clean Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            {section.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
            )}
            <div className="w-20 h-1 bg-gray-900 rounded-full" />
            {contentText && (
              <p className="text-gray-600 mt-4 max-w-2xl">{contentText}</p>
            )}
          </div>
          
          {/* Total files indicator */}
          <div className="inline-flex items-center gap-2 text-gray-500">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-mono">
              {files.length} Documents
            </span>
          </div>
        </div>

        {/* Files Grid - Minimal Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {files.map((file, index) => {
            const IconComponent = iconMap[file.fileType]
            const config = typeConfig[file.fileType]
            const isDownloaded = downloadedFiles.includes(file.id)
            
            return (
              <div
                key={file.id}
                className="group border border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white"
              >
                <div className="p-6 flex items-center gap-5">
                  {/* File Icon */}
                  <div className={`relative flex-shrink-0 w-14 h-14 ${config.bg} ${config.border} border flex items-center justify-center`}>
                    <IconComponent className={`h-6 w-6 ${config.color}`} />
                    
                    {/* File type label */}
                    <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold uppercase ${config.bg} ${config.color} border ${config.border}`}>
                      {config.label}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {file.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                      {file.description}
                    </p>
                    <span className="text-xs text-gray-400 font-mono">
                      {file.fileSize}
                    </span>
                  </div>

                  {/* Download Button */}
                  <Button
                    variant={isDownloaded ? "default" : "outline"}
                    size="icon"
                    className={`flex-shrink-0 w-10 h-10 transition-all duration-300 ${
                      isDownloaded 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-0' 
                        : 'border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white'
                    }`}
                    asChild
                    onClick={() => handleDownload(file.id)}
                  >
                    <a href={file.fileUrl} download>
                      {isDownloaded ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </a>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Free Downloads</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            <span>Instant Access</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Updated Regularly</span>
          </div>
        </div>
      </div>
    </section>
  )
}
