"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save, Loader2, GripVertical, Globe, Link2, MessageCircle, AtSign, Camera, ExternalLink, Upload, Settings, Terminal } from "lucide-react"
import { uploadImageToCloudinary } from "@/lib/cloudinary"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
  isActive: boolean
}

interface HeaderButton {
  id: string
  label: string
  link: string
  variant: "default" | "outline" | "ghost"
  isActive: boolean
}

interface SiteSettings {
  header: {
    logoText: string
    logoImage: string
    showLogo: boolean
    buttons: HeaderButton[]
  }
  footer: {
    companyName: string
    tagline: string
    showSocialLinks: boolean
    socialLinks: SocialLink[]
    copyright: string
  }
}

const defaultSettings: SiteSettings = {
  header: {
    logoText: "PKonstruct",
    logoImage: "",
    showLogo: true,
    buttons: [
      { id: "cta-1", label: "Get Quote", link: "/contact", variant: "default", isActive: true }
    ]
  },
  footer: {
    companyName: "PKonstruct",
    tagline: "Building excellence since 2005. We transform your vision into reality with quality craftsmanship and innovative solutions.",
    showSocialLinks: true,
    socialLinks: [
      { id: "social-1", platform: "Facebook", url: "#", icon: "MessageCircle", isActive: true },
      { id: "social-2", platform: "Twitter", url: "#", icon: "AtSign", isActive: true },
      { id: "social-3", platform: "Instagram", url: "#", icon: "Camera", isActive: true },
      { id: "social-4", platform: "LinkedIn", url: "#", icon: "ExternalLink", isActive: true },
    ],
    copyright: "© 2025 PKonstruct. All rights reserved."
  }
}

const iconMap: Record<string, React.ElementType> = {
  MessageCircle,
  Globe,
  Link2,
  AtSign,
  Camera,
  ExternalLink
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("header")
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const docRef = doc(db, "settings", "site")
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as SiteSettings
        setSettings({
          header: { ...defaultSettings.header, ...data.header },
          footer: { ...defaultSettings.footer, ...data.footer }
        })
      }
    } catch (err) {
      console.error("Error fetching settings:", err)
      setError("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, "settings", "site"), settings)
      setError(null)
    } catch (err) {
      console.error("Error saving settings:", err)
      setError("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const addHeaderButton = () => {
    const newButton: HeaderButton = {
      id: `btn-${Date.now()}`,
      label: "New Button",
      link: "/",
      variant: "default",
      isActive: true
    }
    setSettings({
      ...settings,
      header: {
        ...settings.header,
        buttons: [...settings.header.buttons, newButton]
      }
    })
  }

  const updateHeaderButton = (id: string, updates: Partial<HeaderButton>) => {
    setSettings({
      ...settings,
      header: {
        ...settings.header,
        buttons: settings.header.buttons.map(btn => 
          btn.id === id ? { ...btn, ...updates } : btn
        )
      }
    })
  }

  const deleteHeaderButton = (id: string) => {
    setSettings({
      ...settings,
      header: {
        ...settings.header,
        buttons: settings.header.buttons.filter(btn => btn.id !== id)
      }
    })
  }

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: `social-${Date.now()}`,
      platform: "Website",
      url: "#",
      icon: "Globe",
      isActive: true
    }
    setSettings({
      ...settings,
      footer: {
        ...settings.footer,
        socialLinks: [...settings.footer.socialLinks, newLink]
      }
    })
  }

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setSettings({
      ...settings,
      footer: {
        ...settings.footer,
        socialLinks: settings.footer.socialLinks.map(link => 
          link.id === id ? { ...link, ...updates } : link
        )
      }
    })
  }

  const deleteSocialLink = (id: string) => {
    setSettings({
      ...settings,
      footer: {
        ...settings.footer,
        socialLinks: settings.footer.socialLinks.filter(link => link.id !== id)
      }
    })
  }

  // Logo upload handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setUploadingLogo(true)
    setError(null)

    try {
      const result = await uploadImageToCloudinary(file, "pkonstruct/settings")
      setSettings({
        ...settings,
        header: { ...settings.header, logoImage: result.url }
      })
    } catch (err) {
      setError("Failed to upload logo image")
      console.error(err)
    } finally {
      setUploadingLogo(false)
    }
  }

  const removeLogoImage = () => {
    setSettings({
      ...settings,
      header: { ...settings.header, logoImage: "" }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className={cn("space-y-6 transition-all duration-500", mounted ? "opacity-100" : "opacity-0")}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30">
              <Settings className="h-5 w-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          </div>
          <p className="text-gray-500 font-mono text-sm">// Customize header, footer, and global settings</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving} 
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400">
          <Terminal className="h-4 w-4" />
          <span className="text-sm font-mono">{error}</span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-[#111111] border border-[#222222] p-1">
          <TabsTrigger 
            value="header" 
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30 border border-transparent rounded-lg"
          >
            Header
          </TabsTrigger>
          <TabsTrigger 
            value="footer"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30 border border-transparent rounded-lg"
          >
            Footer
          </TabsTrigger>
        </TabsList>

        {/* Header Settings */}
        <TabsContent value="header" className="space-y-4">
          <Card className="bg-[#111111] border-[#222222]">
            <CardHeader>
              <CardTitle className="text-white">Logo & Brand</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-400 font-mono text-sm">Logo Text</Label>
                  <Input
                    value={settings.header.logoText}
                    onChange={(e) => setSettings({
                      ...settings,
                      header: { ...settings.header, logoText: e.target.value }
                    })}
                    placeholder="Company Name"
                    className="bg-[#1a1a1a] border-[#333333] text-white focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400 font-mono text-sm">Logo Image</Label>
                  <div className="space-y-3">
                    {settings.header.logoImage ? (
                      <div className="relative inline-block">
                        <img
                          src={settings.header.logoImage}
                          alt="Logo Preview"
                          className="h-16 w-auto rounded-lg border border-[#333333]"
                        />
                        <button
                          onClick={removeLogoImage}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500/80 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#333333] rounded-lg cursor-pointer hover:border-cyan-500/50 hover:bg-[#1a1a1a] transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploadingLogo ? (
                            <Loader2 className="h-8 w-8 animate-spin text-cyan-500 mb-2" />
                          ) : (
                            <Upload className="h-8 w-8 text-gray-500 mb-2" />
                          )}
                          <p className="text-sm text-gray-400">
                            {uploadingLogo ? "Uploading..." : "Click to upload logo"}
                          </p>
                          <p className="text-xs text-gray-600 font-mono">PNG, JPG up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={uploadingLogo}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showLogo"
                  checked={settings.header.showLogo}
                  onChange={(e) => setSettings({
                    ...settings,
                    header: { ...settings.header, showLogo: e.target.checked }
                  })}
                  className="rounded border-[#333333] bg-[#1a1a1a] text-cyan-500 focus:ring-cyan-500/20"
                />
                <Label htmlFor="showLogo" className="text-gray-300">Show Logo in Header</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#222222]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Header Buttons</CardTitle>
              <Button 
                size="sm" 
                onClick={addHeaderButton}
                className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Button
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {settings.header.buttons.map((button, index) => (
                  <div key={button.id} className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg border border-[#333333]">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={index === 0}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-white hover:bg-[#222222]"
                        onClick={() => {
                          const newButtons = [...settings.header.buttons]
                          const [moved] = newButtons.splice(index, 1)
                          newButtons.splice(index - 1, 0, moved)
                          setSettings({ ...settings, header: { ...settings.header, buttons: newButtons }})
                        }}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={index === settings.header.buttons.length - 1}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-white hover:bg-[#222222]"
                        onClick={() => {
                          const newButtons = [...settings.header.buttons]
                          const [moved] = newButtons.splice(index, 1)
                          newButtons.splice(index + 1, 0, moved)
                          setSettings({ ...settings, header: { ...settings.header, buttons: newButtons }})
                        }}
                      >
                        ↓
                      </Button>
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <Input
                        value={button.label}
                        onChange={(e) => updateHeaderButton(button.id, { label: e.target.value })}
                        placeholder="Button Label"
                        className="bg-[#222222] border-[#333333] text-white focus:border-cyan-500/50"
                      />
                      <Input
                        value={button.link}
                        onChange={(e) => updateHeaderButton(button.id, { link: e.target.value })}
                        placeholder="/page-link"
                        className="bg-[#222222] border-[#333333] text-white focus:border-cyan-500/50 font-mono text-sm"
                      />
                      <select
                        value={button.variant}
                        onChange={(e) => updateHeaderButton(button.id, { variant: e.target.value as any })}
                        className="rounded-md border border-[#333333] bg-[#222222] px-3 py-2 text-sm text-gray-300 focus:border-cyan-500/50 focus:outline-none"
                      >
                        <option value="default">Default (Filled)</option>
                        <option value="outline">Outline</option>
                        <option value="ghost">Ghost</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={button.isActive}
                        onChange={(e) => updateHeaderButton(button.id, { isActive: e.target.checked })}
                        className="rounded border-[#333333] bg-[#222222] text-cyan-500 focus:ring-cyan-500/20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteHeaderButton(button.id)}
                        className="text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {settings.header.buttons.length === 0 && (
                  <p className="text-gray-500 text-center py-4 font-mono">// No buttons added</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Settings */}
        <TabsContent value="footer" className="space-y-4">
          <Card className="bg-[#111111] border-[#222222]">
            <CardHeader>
              <CardTitle className="text-white">Company Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400 font-mono text-sm">Company Name</Label>
                <Input
                  value={settings.footer.companyName}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, companyName: e.target.value }
                  })}
                  placeholder="Company Name"
                  className="bg-[#1a1a1a] border-[#333333] text-white focus:border-cyan-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400 font-mono text-sm">Tagline / Description</Label>
                <textarea
                  value={settings.footer.tagline}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, tagline: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none"
                  placeholder="Brief company description"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400 font-mono text-sm">Copyright Text</Label>
                <Input
                  value={settings.footer.copyright}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, copyright: e.target.value }
                  })}
                  placeholder="© 2025 Company Name. All rights reserved."
                  className="bg-[#1a1a1a] border-[#333333] text-white focus:border-cyan-500/50 font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#222222]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Social Links</CardTitle>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showSocial"
                  checked={settings.footer.showSocialLinks}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, showSocialLinks: e.target.checked }
                  })}
                  className="rounded border-[#333333] bg-[#1a1a1a] text-cyan-500 focus:ring-cyan-500/20"
                />
                <Label htmlFor="showSocial" className="text-gray-300">Show Social Links</Label>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {settings.footer.socialLinks.map((link, index) => (
                  <div key={link.id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg border border-[#333333]">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={index === 0}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-white hover:bg-[#222222]"
                        onClick={() => {
                          const newLinks = [...settings.footer.socialLinks]
                          const [moved] = newLinks.splice(index, 1)
                          newLinks.splice(index - 1, 0, moved)
                          setSettings({ ...settings, footer: { ...settings.footer, socialLinks: newLinks }})
                        }}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={index === settings.footer.socialLinks.length - 1}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-white hover:bg-[#222222]"
                        onClick={() => {
                          const newLinks = [...settings.footer.socialLinks]
                          const [moved] = newLinks.splice(index, 1)
                          newLinks.splice(index + 1, 0, moved)
                          setSettings({ ...settings, footer: { ...settings.footer, socialLinks: newLinks }})
                        }}
                      >
                        ↓
                      </Button>
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <Input
                        value={link.platform}
                        onChange={(e) => updateSocialLink(link.id, { platform: e.target.value })}
                        placeholder="Platform Name"
                        className="bg-[#222222] border-[#333333] text-white focus:border-cyan-500/50"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                        placeholder="https://..."
                        className="bg-[#222222] border-[#333333] text-white focus:border-cyan-500/50 font-mono text-sm"
                      />
                      <select
                        value={link.icon}
                        onChange={(e) => updateSocialLink(link.id, { icon: e.target.value })}
                        className="rounded-md border border-[#333333] bg-[#222222] px-3 py-2 text-sm text-gray-300 focus:border-cyan-500/50 focus:outline-none"
                      >
                        <option value="MessageCircle">Facebook/Message</option>
                        <option value="AtSign">Twitter/At</option>
                        <option value="Camera">Instagram/Camera</option>
                        <option value="ExternalLink">LinkedIn/External</option>
                        <option value="Globe">Website/Globe</option>
                        <option value="Link2">Other/Link</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={link.isActive}
                        onChange={(e) => updateSocialLink(link.id, { isActive: e.target.checked })}
                        className="rounded border-[#333333] bg-[#222222] text-cyan-500 focus:ring-cyan-500/20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSocialLink(link.id)}
                        className="text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addSocialLink} 
                  className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Social Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
