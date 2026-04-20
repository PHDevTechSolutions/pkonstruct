"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Globe, Code, BarChart3, Share2, Search, Settings, Terminal, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className={cn("space-y-6 max-w-5xl mx-auto transition-all duration-500", mounted ? "opacity-100" : "opacity-0")}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
              <Settings className="h-5 w-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">General Settings</h1>
          </div>
          <p className="text-gray-500 font-mono text-sm">// Manage site-wide SEO, analytics, and scripts</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
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
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-mono flex items-center gap-2">
          <Check className="h-4 w-4" />
          Settings saved successfully!
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-mono flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          {error}
        </div>
      )}

      <Tabs defaultValue="seo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto bg-[#111111] border border-[#222222] p-1">
          <TabsTrigger 
            value="seo" 
            className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30 border border-transparent rounded-lg"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30 border border-transparent rounded-lg"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger 
            value="scripts" 
            className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30 border border-transparent rounded-lg"
          >
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Scripts</span>
          </TabsTrigger>
          <TabsTrigger 
            value="social" 
            className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30 border border-transparent rounded-lg"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger 
            value="site" 
            className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30 border border-transparent rounded-lg"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Site Info</span>
          </TabsTrigger>
        </TabsList>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card className="bg-[#111111] border-[#222222]">
            <CardHeader>
              <CardTitle className="text-white">Search Engine Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Site Name</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => updateSetting("siteName", e.target.value)}
                  placeholder="Your company name"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Site Description</label>
                <Textarea
                  value={settings.siteDescription}
                  onChange={(e) => updateSetting("siteDescription", e.target.value)}
                  placeholder="Brief description of your business"
                  rows={3}
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Keywords</label>
                <Input
                  value={settings.siteKeywords}
                  onChange={(e) => updateSetting("siteKeywords", e.target.value)}
                  placeholder="construction, builder, contractor, ..."
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                />
                <p className="text-xs text-gray-600 font-mono">// Comma-separated keywords for search engines</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Author</label>
                <Input
                  value={settings.author}
                  onChange={(e) => updateSetting("author", e.target.value)}
                  placeholder="Company or author name"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#222222]">
            <CardHeader>
              <CardTitle className="text-white">Site Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Google Search Console Verification</label>
                <Input
                  value={settings.googleSiteVerification}
                  onChange={(e) => updateSetting("googleSiteVerification", e.target.value)}
                  placeholder="google-site-verification=xxxxxxxxxx"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono text-sm"
                />
                <p className="text-xs text-gray-600 font-mono">// Meta tag content for Google Search Console</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Bing Webmaster Tools Verification</label>
                <Input
                  value={settings.bingVerification}
                  onChange={(e) => updateSetting("bingVerification", e.target.value)}
                  placeholder="Verification code from Bing"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#222222]">
            <CardHeader>
              <CardTitle className="text-white">Open Graph / Social Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Default OG Image URL</label>
                <Input
                  value={settings.ogImage}
                  onChange={(e) => updateSetting("ogImage", e.target.value)}
                  placeholder="https://yoursite.com/og-image.jpg"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono text-sm"
                />
                <p className="text-xs text-gray-600 font-mono">// 1200x630px image for social media sharing</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 font-mono">OG Type</label>
                  <select
                    value={settings.ogType}
                    onChange={(e) => updateSetting("ogType", e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                  >
                    <option value="website">Website</option>
                    <option value="business.business">Business</option>
                    <option value="article">Article</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 font-mono">Twitter Card Type</label>
                  <select
                    value={settings.twitterCard}
                    onChange={(e) => updateSetting("twitterCard", e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white focus:border-cyan-500/50 focus:outline-none"
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
          <Card className="bg-[#111111] border-[#222222]">
            <CardHeader>
              <CardTitle className="text-white">Google Analytics & Tag Manager</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Google Analytics 4 ID</label>
                <Input
                  value={settings.googleAnalyticsId}
                  onChange={(e) => updateSetting("googleAnalyticsId", e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono"
                />
                <p className="text-xs text-gray-600 font-mono">// Your GA4 Measurement ID (starts with G-)</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Google Tag Manager ID</label>
                <Input
                  value={settings.googleTagManagerId}
                  onChange={(e) => updateSetting("googleTagManagerId", e.target.value)}
                  placeholder="GTM-XXXXXX"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono"
                />
                <p className="text-xs text-gray-600 font-mono">// Your GTM Container ID (starts with GTM-)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#222222]">
            <CardHeader>
              <CardTitle className="text-white">Other Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Facebook Pixel ID</label>
                <Input
                  value={settings.facebookPixelId}
                  onChange={(e) => updateSetting("facebookPixelId", e.target.value)}
                  placeholder="xxxxxxxxxx"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono"
                />
                <p className="text-xs text-gray-600 font-mono">// For Facebook Ads tracking</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scripts Tab */}
        <TabsContent value="scripts" className="space-y-6">
          <Card className="bg-[#111111] border-[#222222]">
            <CardHeader>
              <CardTitle className="text-white">Custom Scripts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono flex items-center gap-2">
                  <Code className="h-4 w-4 text-cyan-400" />
                  Head Scripts (inside &lt;head&gt; tag)
                </label>
                <Textarea
                  value={settings.headScripts}
                  onChange={(e) => updateSetting("headScripts", e.target.value)}
                  placeholder="<!-- Google Analytics -->&#10;<script>...</script>&#10;<!-- Custom CSS -->"
                  rows={6}
                  className="font-mono text-sm bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                />
                <p className="text-xs text-gray-600 font-mono">// Scripts and styles that go in the HTML head section</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono flex items-center gap-2">
                  <Code className="h-4 w-4 text-cyan-400" />
                  Body Start Scripts (after &lt;body&gt; opening)
                </label>
                <Textarea
                  value={settings.bodyStartScripts}
                  onChange={(e) => updateSetting("bodyStartScripts", e.target.value)}
                  placeholder="<!-- Google Tag Manager (noscript) -->&#10;<noscript>...</noscript>"
                  rows={4}
                  className="font-mono text-sm bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono flex items-center gap-2">
                  <Code className="h-4 w-4 text-cyan-400" />
                  Body End Scripts (before &lt;/body&gt; closing)
                </label>
                <Textarea
                  value={settings.bodyEndScripts}
                  onChange={(e) => updateSetting("bodyEndScripts", e.target.value)}
                  placeholder="<!-- Chat Widget -->&#10;<script>...</script>&#10;<!-- Footer Scripts -->"
                  rows={4}
                  className="font-mono text-sm bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card className="bg-[#111111] border-[#222222]">
            <CardHeader>
              <CardTitle className="text-white">Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Facebook Page URL</label>
                <Input
                  value={settings.facebookUrl}
                  onChange={(e) => updateSetting("facebookUrl", e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Twitter/X URL</label>
                <Input
                  value={settings.twitterUrl}
                  onChange={(e) => updateSetting("twitterUrl", e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">Instagram URL</label>
                <Input
                  value={settings.instagramUrl}
                  onChange={(e) => updateSetting("instagramUrl", e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">LinkedIn URL</label>
                <Input
                  value={settings.linkedinUrl}
                  onChange={(e) => updateSetting("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/company/yourcompany"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 font-mono">YouTube URL</label>
                <Input
                  value={settings.youtubeUrl}
                  onChange={(e) => updateSetting("youtubeUrl", e.target.value)}
                  placeholder="https://youtube.com/channel/xxxxx"
                  className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Info Tab */}
        <TabsContent value="site" className="space-y-6">
          <Card className="bg-[#111111] border-[#222222]">
            <CardHeader>
              <CardTitle className="text-white">Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#1a1a1a] border border-[#333333] p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-gray-300 font-mono">// Preview</h4>
                <p className="text-sm text-gray-400">
                  <strong className="text-cyan-400">{settings.siteName}</strong> - {settings.siteDescription}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 p-4 rounded-lg">
                <h4 className="font-medium text-cyan-400 mb-2 font-mono">// Important Notes</h4>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
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
