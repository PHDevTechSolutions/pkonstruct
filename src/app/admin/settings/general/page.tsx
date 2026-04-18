"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Globe, Code, BarChart3, Share2, Search } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SiteSettings {
  // SEO
  siteName: string
  siteDescription: string
  siteKeywords: string
  author: string
  
  // Analytics
  googleAnalyticsId: string
  googleTagManagerId: string
  facebookPixelId: string
  
  // Verification
  googleSiteVerification: string
  bingVerification: string
  
  // Custom Scripts
  headScripts: string
  bodyStartScripts: string
  bodyEndScripts: string
  
  // Social Media
  facebookUrl: string
  twitterUrl: string
  instagramUrl: string
  linkedinUrl: string
  youtubeUrl: string
  
  // Open Graph
  ogImage: string
  ogType: string
  twitterCard: string
}

const defaultSettings: SiteSettings = {
  siteName: "PKonstruct",
  siteDescription: "Building Excellence Since 2005",
  siteKeywords: "construction, builder, contractor, residential, commercial",
  author: "PKonstruct",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  facebookPixelId: "",
  googleSiteVerification: "",
  bingVerification: "",
  headScripts: "",
  bodyStartScripts: "",
  bodyEndScripts: "",
  facebookUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  youtubeUrl: "",
  ogImage: "",
  ogType: "website",
  twitterCard: "summary_large_image",
}

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const docRef = doc(db, "settings", "general")
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        setSettings({ ...defaultSettings, ...docSnap.data() })
      }
    } catch (err) {
      console.error("Error loading settings:", err)
      setError("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    
    try {
      const docRef = doc(db, "settings", "general")
      await setDoc(docRef, {
        ...settings,
        updatedAt: new Date().toISOString(),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error("Error saving settings:", err)
      setError("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">General Settings</h2>
          <p className="text-stone-500">Manage site-wide SEO, analytics, and scripts</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {saved && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="seo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="scripts" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Scripts</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger value="site" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Site Info</span>
          </TabsTrigger>
        </TabsList>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Engine Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Name</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => updateSetting("siteName", e.target.value)}
                  placeholder="Your company name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Description</label>
                <Textarea
                  value={settings.siteDescription}
                  onChange={(e) => updateSetting("siteDescription", e.target.value)}
                  placeholder="Brief description of your business"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Keywords</label>
                <Input
                  value={settings.siteKeywords}
                  onChange={(e) => updateSetting("siteKeywords", e.target.value)}
                  placeholder="construction, builder, contractor, ..."
                />
                <p className="text-xs text-stone-500">Comma-separated keywords for search engines</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Author</label>
                <Input
                  value={settings.author}
                  onChange={(e) => updateSetting("author", e.target.value)}
                  placeholder="Company or author name"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Site Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Google Search Console Verification</label>
                <Input
                  value={settings.googleSiteVerification}
                  onChange={(e) => updateSetting("googleSiteVerification", e.target.value)}
                  placeholder="google-site-verification=xxxxxxxxxx"
                />
                <p className="text-xs text-stone-500">Meta tag content for Google Search Console</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Bing Webmaster Tools Verification</label>
                <Input
                  value={settings.bingVerification}
                  onChange={(e) => updateSetting("bingVerification", e.target.value)}
                  placeholder="Verification code from Bing"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open Graph / Social Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default OG Image URL</label>
                <Input
                  value={settings.ogImage}
                  onChange={(e) => updateSetting("ogImage", e.target.value)}
                  placeholder="https://yoursite.com/og-image.jpg"
                />
                <p className="text-xs text-stone-500">1200x630px image for social media sharing</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">OG Type</label>
                  <select
                    value={settings.ogType}
                    onChange={(e) => updateSetting("ogType", e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm"
                  >
                    <option value="website">Website</option>
                    <option value="business.business">Business</option>
                    <option value="article">Article</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Twitter Card Type</label>
                  <select
                    value={settings.twitterCard}
                    onChange={(e) => updateSetting("twitterCard", e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Google Analytics & Tag Manager</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Google Analytics 4 ID</label>
                <Input
                  value={settings.googleAnalyticsId}
                  onChange={(e) => updateSetting("googleAnalyticsId", e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs text-stone-500">Your GA4 Measurement ID (starts with G-)</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Google Tag Manager ID</label>
                <Input
                  value={settings.googleTagManagerId}
                  onChange={(e) => updateSetting("googleTagManagerId", e.target.value)}
                  placeholder="GTM-XXXXXX"
                />
                <p className="text-xs text-stone-500">Your GTM Container ID (starts with GTM-)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Facebook Pixel ID</label>
                <Input
                  value={settings.facebookPixelId}
                  onChange={(e) => updateSetting("facebookPixelId", e.target.value)}
                  placeholder="xxxxxxxxxx"
                />
                <p className="text-xs text-stone-500">For Facebook Ads tracking</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scripts Tab */}
        <TabsContent value="scripts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Scripts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Head Scripts (inside &lt;head&gt; tag)
                </label>
                <Textarea
                  value={settings.headScripts}
                  onChange={(e) => updateSetting("headScripts", e.target.value)}
                  placeholder="<!-- Google Analytics -->&#10;<script>...</script>&#10;<!-- Custom CSS -->"
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-stone-500">Scripts and styles that go in the HTML head section</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Body Start Scripts (after &lt;body&gt; opening)
                </label>
                <Textarea
                  value={settings.bodyStartScripts}
                  onChange={(e) => updateSetting("bodyStartScripts", e.target.value)}
                  placeholder="<!-- Google Tag Manager (noscript) -->&#10;<noscript>...</noscript>"
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Body End Scripts (before &lt;/body&gt; closing)
                </label>
                <Textarea
                  value={settings.bodyEndScripts}
                  onChange={(e) => updateSetting("bodyEndScripts", e.target.value)}
                  placeholder="<!-- Chat Widget -->&#10;<script>...</script>&#10;<!-- Footer Scripts -->"
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Facebook Page URL</label>
                <Input
                  value={settings.facebookUrl}
                  onChange={(e) => updateSetting("facebookUrl", e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Twitter/X URL</label>
                <Input
                  value={settings.twitterUrl}
                  onChange={(e) => updateSetting("twitterUrl", e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Instagram URL</label>
                <Input
                  value={settings.instagramUrl}
                  onChange={(e) => updateSetting("instagramUrl", e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn URL</label>
                <Input
                  value={settings.linkedinUrl}
                  onChange={(e) => updateSetting("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">YouTube URL</label>
                <Input
                  value={settings.youtubeUrl}
                  onChange={(e) => updateSetting("youtubeUrl", e.target.value)}
                  placeholder="https://youtube.com/channel/xxxxx"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Info Tab */}
        <TabsContent value="site" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Preview</h4>
                <p className="text-sm text-stone-600">
                  <strong>{settings.siteName}</strong> - {settings.siteDescription}
                </p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-medium text-amber-800">Important Notes</h4>
                <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc list-inside">
                  <li>Changes take effect immediately after saving</li>
                  <li>Custom scripts are rendered as raw HTML - use with caution</li>
                  <li>Verify your analytics IDs are correct before saving</li>
                  <li>Site verification codes are used for search engine indexing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
