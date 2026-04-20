"use client"

import { useState, useEffect } from "react"
import { useTemplates } from "@/hooks/use-templates"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, AlertTriangle, Layout, Palette, FileText, ExternalLink, LayoutTemplate, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TemplatesPage() {
  const { templates, activeTemplate, loading, applying, error, applyTemplate } = useTemplates()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleApplyTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    setConfirmDialogOpen(true)
  }

  const confirmApply = async () => {
    if (selectedTemplate) {
      const success = await applyTemplate(selectedTemplate)
      if (success) {
        setConfirmDialogOpen(false)
        setSelectedTemplate(null)
      }
    }
  }

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate)
  const previewData = templates.find(t => t.id === previewTemplate)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className={cn("space-y-6 max-w-6xl mx-auto transition-all duration-500", mounted ? "opacity-100" : "opacity-0")}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
              <LayoutTemplate className="h-5 w-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Page Templates</h1>
          </div>
          <p className="text-gray-500 font-mono text-sm">// Choose a template pack for your website</p>
        </div>
        {activeTemplate && (
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1">
            <Check className="h-4 w-4 mr-1" />
            Active: {activeTemplate.name}
          </Badge>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-mono flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={cn(
              "overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] bg-[#111111] border-[#222222]",
              activeTemplate?.id === template.id && "ring-2 ring-cyan-500 border-cyan-500"
            )}
          >
            {/* Template Preview Thumbnail */}
            <div 
              className="h-48 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${template.styles.primaryColor}30 0%, ${template.styles.secondaryColor}50 100%)`
              }}
            >
              <div className="text-center">
                <Layout 
                  className="h-16 w-16 mx-auto mb-2" 
                  style={{ color: template.styles.primaryColor }}
                />
                <span 
                  className="text-sm font-semibold text-white drop-shadow-lg"
                >
                  {template.name}
                </span>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-white">{template.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                </div>
                {activeTemplate?.id === template.id && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Active</Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Template Stats */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs border-[#333333] text-gray-400 bg-[#1a1a1a]">
                  <FileText className="h-3 w-3 mr-1" />
                  {Object.keys(template.pages).length} Pages
                </Badge>
                <Badge variant="outline" className="text-xs border-[#333333] text-gray-400 bg-[#1a1a1a] font-mono">
                  <Palette className="h-3 w-3 mr-1" />
                  {template.styles.primaryColor}
                </Badge>
              </div>

              {/* Included Pages */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 font-mono">// Includes:</p>
                <div className="flex flex-wrap gap-1">
                  {Object.values(template.pages).slice(0, 4).map((page, i) => (
                    <span 
                      key={i}
                      className="text-xs px-2 py-1 bg-[#1a1a1a] border border-[#333333] rounded text-gray-400"
                    >
                      {page.title}
                    </span>
                  ))}
                  {Object.keys(template.pages).length > 4 && (
                    <span className="text-xs px-2 py-1 bg-[#1a1a1a] border border-[#333333] rounded text-gray-500">
                      +{Object.keys(template.pages).length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222] hover:border-[#444444]"
                  onClick={() => setPreviewTemplate(template.id)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  onClick={() => handleApplyTemplate(template.id)}
                  disabled={applying || activeTemplate?.id === template.id}
                >
                  {applying && selectedTemplate === template.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : activeTemplate?.id === template.id ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Applied
                    </>
                  ) : (
                    "Apply Template"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4">
        <h4 className="font-medium text-cyan-400 mb-2 font-mono">// How Templates Work</h4>
        <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
          <li>Each template includes a complete set of pre-designed pages</li>
          <li>Templates come with matching navigation, colors, and content structure</li>
          <li>Applying a template creates new pages with pre-built sections</li>
          <li>You can customize any page after applying a template</li>
          <li>Previous pages are not deleted when applying a new template</li>
        </ul>
      </div>

      {/* Apply Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="bg-[#111111] border-[#222222] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Apply Template
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-gray-400">
              <p>
                Are you sure you want to apply the <strong className="text-cyan-400">{selectedTemplateData?.name}</strong> template?
              </p>
              <div className="bg-[#1a1a1a] border border-[#333333] p-3 rounded-lg text-sm">
                <p className="font-medium mb-2 text-gray-300">This will:</p>
                <ul className="space-y-1 text-gray-500 list-disc list-inside">
                  <li>Create {selectedTemplateData && Object.keys(selectedTemplateData.pages).length} new pages with pre-built sections</li>
                  <li>Apply template navigation settings (header/footer)</li>
                  <li>Set template colors and styles</li>
                  <li>Your existing pages will remain unchanged</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setSelectedTemplate(null)}
              className="border-[#333333] text-gray-400 hover:text-white hover:bg-[#222222]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApply}
              disabled={applying}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0"
            >
              {applying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply Template"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      {previewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#111111] border border-[#222222] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-[#222222]">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{previewData.name} - Preview</h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 hover:bg-[#222222] rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Colors */}
              <div>
                <h4 className="font-medium mb-3 text-gray-300 font-mono">// Color Scheme</h4>
                <div className="flex gap-3">
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg shadow-lg border border-[#333333]"
                      style={{ backgroundColor: previewData.styles.primaryColor }}
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Primary</span>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg shadow-lg border border-[#333333]"
                      style={{ backgroundColor: previewData.styles.secondaryColor }}
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Secondary</span>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg shadow-lg border border-[#333333]"
                      style={{ backgroundColor: previewData.styles.accentColor }}
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Accent</span>
                  </div>
                </div>
              </div>

              {/* Pages */}
              <div>
                <h4 className="font-medium mb-3 text-gray-300 font-mono">// Included Pages</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(previewData.pages).map((page, i) => (
                    <div key={i} className="border border-[#333333] rounded-lg p-3 bg-[#1a1a1a]">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-300">{page.title}</span>
                        <div className="flex gap-1">
                          {page.showInHeader && (
                            <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400 bg-cyan-500/10">Header</Badge>
                          )}
                          {page.showInFooter && (
                            <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400 bg-cyan-500/10">Footer</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 font-mono">/{page.slug}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {page.sections.length} sections
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Preview */}
              <div>
                <h4 className="font-medium mb-3 text-gray-300 font-mono">// Navigation Settings</h4>
                <div className="border border-[#333333] rounded-lg p-4 bg-[#1a1a1a]">
                  <p className="text-gray-400"><span className="text-cyan-400 font-mono">Site Name:</span> {previewData.navigation.siteName}</p>
                  <p className="text-gray-400 mt-1"><span className="text-cyan-400 font-mono">Footer:</span> {previewData.navigation.footerDescription.slice(0, 100)}...</p>
                  <div className="flex gap-2 mt-2">
                    {previewData.navigation.socialLinks
                      .filter(s => s.isActive)
                      .map((link, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-[#333333] text-gray-400 bg-[#222222]">
                          {link.platform}
                        </Badge>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#222222] bg-[#1a1a1a]">
              <Button 
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                onClick={() => {
                  setPreviewTemplate(null)
                  handleApplyTemplate(previewData.id)
                }}
              >
                Apply This Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
