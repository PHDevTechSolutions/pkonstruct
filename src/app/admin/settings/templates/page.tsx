"use client"

import { useState } from "react"
import { useTemplates } from "@/hooks/use-templates"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, AlertTriangle, Layout, Palette, FileText, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TemplatesPage() {
  const { templates, activeTemplate, loading, applying, error, applyTemplate } = useTemplates()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)

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
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Page Templates</h2>
          <p className="text-stone-500">Choose a template pack for your website</p>
        </div>
        {activeTemplate && (
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            <Check className="h-4 w-4 mr-1" />
            Active: {activeTemplate.name}
          </Badge>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={cn(
              "overflow-hidden transition-all hover:shadow-lg",
              activeTemplate?.id === template.id && "ring-2 ring-amber-500 border-amber-500"
            )}
          >
            {/* Template Preview Thumbnail */}
            <div 
              className="h-48 bg-gradient-to-br flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${template.styles.primaryColor}20 0%, ${template.styles.secondaryColor}40 100%)`
              }}
            >
              <div className="text-center">
                <Layout 
                  className="h-16 w-16 mx-auto mb-2" 
                  style={{ color: template.styles.primaryColor }}
                />
                <span 
                  className="text-sm font-semibold"
                  style={{ color: template.styles.secondaryColor }}
                >
                  {template.name}
                </span>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-stone-500 mt-1">{template.description}</p>
                </div>
                {activeTemplate?.id === template.id && (
                  <Badge className="bg-amber-100 text-amber-800">Active</Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Template Stats */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  {Object.keys(template.pages).length} Pages
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Palette className="h-3 w-3 mr-1" />
                  {template.styles.primaryColor}
                </Badge>
              </div>

              {/* Included Pages */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-stone-500">Includes:</p>
                <div className="flex flex-wrap gap-1">
                  {Object.values(template.pages).slice(0, 4).map((page, i) => (
                    <span 
                      key={i}
                      className="text-xs px-2 py-1 bg-stone-100 rounded"
                    >
                      {page.title}
                    </span>
                  ))}
                  {Object.keys(template.pages).length > 4 && (
                    <span className="text-xs px-2 py-1 bg-stone-100 rounded">
                      +{Object.keys(template.pages).length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPreviewTemplate(template.id)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
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
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-medium text-amber-800 mb-2">How Templates Work</h4>
        <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
          <li>Each template includes a complete set of pre-designed pages</li>
          <li>Templates come with matching navigation, colors, and content structure</li>
          <li>Applying a template creates new pages with pre-built sections</li>
          <li>You can customize any page after applying a template</li>
          <li>Previous pages are not deleted when applying a new template</li>
        </ul>
      </div>

      {/* Apply Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Apply Template
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Are you sure you want to apply the <strong>{selectedTemplateData?.name}</strong> template?
              </p>
              <div className="bg-stone-50 p-3 rounded-lg text-sm">
                <p className="font-medium mb-2">This will:</p>
                <ul className="space-y-1 text-stone-600 list-disc list-inside">
                  <li>Create {selectedTemplateData && Object.keys(selectedTemplateData.pages).length} new pages with pre-built sections</li>
                  <li>Apply template navigation settings (header/footer)</li>
                  <li>Set template colors and styles</li>
                  <li>Your existing pages will remain unchanged</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedTemplate(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApply}
              disabled={applying}
              className="bg-amber-600 hover:bg-amber-700"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{previewData.name} - Preview</h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 hover:bg-stone-100 rounded-full"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Colors */}
              <div>
                <h4 className="font-medium mb-3">Color Scheme</h4>
                <div className="flex gap-3">
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg shadow-sm"
                      style={{ backgroundColor: previewData.styles.primaryColor }}
                    />
                    <span className="text-xs text-stone-500 mt-1">Primary</span>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg shadow-sm"
                      style={{ backgroundColor: previewData.styles.secondaryColor }}
                    />
                    <span className="text-xs text-stone-500 mt-1">Secondary</span>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg shadow-sm"
                      style={{ backgroundColor: previewData.styles.accentColor }}
                    />
                    <span className="text-xs text-stone-500 mt-1">Accent</span>
                  </div>
                </div>
              </div>

              {/* Pages */}
              <div>
                <h4 className="font-medium mb-3">Included Pages</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(previewData.pages).map((page, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{page.title}</span>
                        <div className="flex gap-1">
                          {page.showInHeader && (
                            <Badge variant="outline" className="text-xs">Header</Badge>
                          )}
                          {page.showInFooter && (
                            <Badge variant="outline" className="text-xs">Footer</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-stone-500">/{page.slug}</p>
                      <p className="text-xs text-stone-400 mt-1">
                        {page.sections.length} sections
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Preview */}
              <div>
                <h4 className="font-medium mb-3">Navigation Settings</h4>
                <div className="border rounded-lg p-4 bg-stone-50">
                  <p><strong>Site Name:</strong> {previewData.navigation.siteName}</p>
                  <p><strong>Footer:</strong> {previewData.navigation.footerDescription.slice(0, 100)}...</p>
                  <div className="flex gap-2 mt-2">
                    {previewData.navigation.socialLinks
                      .filter(s => s.isActive)
                      .map((link, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {link.platform}
                        </Badge>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-stone-50">
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700"
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
