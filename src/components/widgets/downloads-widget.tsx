"use client"

import { FileText, Download, FileImage, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { PageSection } from "./types"

interface DownloadsWidgetProps {
  section: PageSection
}

interface DownloadFile {
  id: string
  title: string
  description: string
  fileUrl: string
  fileType: "pdf" | "doc" | "image" | "spreadsheet"
  fileSize: string
}

const iconMap = {
  pdf: FileText,
  doc: FileText,
  image: FileImage,
  spreadsheet: FileSpreadsheet
}

const typeColors = {
  pdf: "text-red-500 bg-red-50",
  doc: "text-blue-500 bg-blue-50",
  image: "text-purple-500 bg-purple-50",
  spreadsheet: "text-green-500 bg-green-50"
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

  // Handle content as string or object
  const contentText = typeof section.content === 'string' ? section.content : section.content?.text || ''

  return (
    <section className="py-16 bg-stone-50">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-4 text-center">{section.title}</h2>}
        {contentText && <p className="text-stone-600 text-center max-w-2xl mx-auto mb-12">{contentText}</p>}
        
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {files.map((file) => {
            const IconComponent = iconMap[file.fileType]
            return (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${typeColors[file.fileType]}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{file.title}</h3>
                    <p className="text-stone-500 text-sm">{file.description}</p>
                    <span className="text-xs text-stone-400">{file.fileSize}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <a href={file.fileUrl} download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
