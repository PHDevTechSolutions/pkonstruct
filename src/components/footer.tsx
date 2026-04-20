"use client"

import Link from "next/link"
import { HardHat, MessageCircle, Globe, Camera, Link2, AtSign, ExternalLink, Video } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useNavigation } from "@/hooks/use-navigation"
import { useServices } from "@/hooks/use-services"
import { useSettings } from "@/hooks/use-settings"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

interface NavSettings {
  siteName: string
  headerLogo: string
  footerDescription: string
  footerCopyright: string
  footerBgColor: string
  footerTextColor: string
  socialLinks: { platform: string; url: string; icon: string; isActive: boolean }[]
  footerColumns: { title: string; links: { label: string; url: string }[] }[]
}

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Cookie Policy", href: "#" }
]

const iconMap: Record<string, React.ElementType> = {
  MessageCircle,
  AtSign,
  Camera,
  ExternalLink,
  Globe,
  Link2,
  Video,
  Facebook: Globe,
  Twitter: AtSign,
  Instagram: Camera,
  LinkedIn: ExternalLink,
  YouTube: Video,
}

export function Footer() {
  const { footerNav } = useNavigation()
  const { services, loading } = useServices()
  const { settings, loading: settingsLoading } = useSettings()
  const [navSettings, setNavSettings] = useState<NavSettings | null>(null)

  // Fetch navigation settings
  useEffect(() => {
    const fetchNavSettings = async () => {
      try {
        const docRef = doc(db, "settings", "navigation")
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setNavSettings(docSnap.data() as NavSettings)
        }
      } catch (err) {
        console.error("Error fetching nav settings:", err)
      }
    }
    fetchNavSettings()
  }, [])
  return (
    <footer 
      className="text-muted-foreground"
      style={{
        backgroundColor: navSettings?.footerBgColor || "#1c1917",
        color: navSettings?.footerTextColor || "#d6d3d1"
      }}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {navSettings?.headerLogo ? (
                <img 
                  src={navSettings.headerLogo} 
                  alt="Logo" 
                  className="h-8 w-auto"
                />
              ) : settings?.header?.logoImage ? (
                <img 
                  src={settings.header.logoImage} 
                  alt="Logo" 
                  className="h-8 w-auto"
                />
              ) : (
                <HardHat className="h-8 w-8 text-primary" />
              )}
              <span 
                className="text-xl font-bold"
                style={{ color: navSettings?.footerTextColor || "#ffffff" }}
              >
                {navSettings?.siteName || settings?.footer?.companyName || "PKonstruct"}
              </span>
            </Link>
            <p 
              className="mb-4 max-w-sm"
              style={{ color: navSettings?.footerTextColor ? `${navSettings.footerTextColor}99` : "#a8a29e" }}
            >
              {navSettings?.footerDescription || settings?.footer?.tagline || "Building excellence since 2005."}
            </p>
            {/* Social Links - from Navigation Settings */}
            {navSettings?.socialLinks && navSettings.socialLinks.filter(s => s.isActive && s.url).length > 0 && (
              <div className="flex gap-4">
                {navSettings.socialLinks.filter(s => s.isActive && s.url).map((social) => {
                  const IconComponent = iconMap[social.icon] || Globe
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: navSettings?.footerTextColor ? `${navSettings.footerTextColor}20` : "#292524" }}
                      aria-label={social.platform}
                    >
                      <IconComponent className="h-5 w-5" style={{ color: navSettings?.footerTextColor || "#d6d3d1" }} />
                    </a>
                  )
                })}
              </div>
            )}
            {/* Fallback to old settings if no navSettings */}
            {(!navSettings?.socialLinks || navSettings.socialLinks.filter(s => s.isActive && s.url).length === 0) && settings?.footer?.showSocialLinks && (
              <div className="flex gap-4">
                {settings?.footer?.socialLinks?.filter(s => s.isActive).map((social) => {
                  const IconComponent = iconMap[social.icon] || Globe
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary transition-colors"
                      aria-label={social.platform}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Show default columns OR custom columns from template, not both */}
          {!navSettings?.footerColumns ? (
            <>
              {/* Services - Dynamic from Services Collection */}
              <div>
                <h3 className="font-semibold mb-4" style={{ color: navSettings?.footerTextColor || "#ffffff" }}>Services</h3>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <ul className="space-y-2">
                    {services.slice(0, 5).map((service) => (
                      <li key={service.id}>
                        <Link href={`/services/${service.slug || service.id}`} className="hover:text-primary transition-colors">
                          {service.title}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href="/services" className="hover:text-primary transition-colors font-medium text-primary">
                        All Services →
                      </Link>
                    </li>
                  </ul>
                )}
              </div>

              {/* Company - Dynamic from Pages (Hidden if empty) */}
              {footerNav.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4" style={{ color: navSettings?.footerTextColor || "#ffffff" }}>Company</h3>
                  <ul className="space-y-2">
                    {footerNav.map((page) => (
                      <li key={page.id}>
                        <Link href={`/${page.slug}`} className="hover:text-primary transition-colors">
                          {page.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legal - Can be customized via admin settings */}
              <div>
                <h3 className="font-semibold mb-4" style={{ color: navSettings?.footerTextColor || "#ffffff" }}>Legal</h3>
                <ul className="space-y-2">
                  {legalLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            /* Custom Footer Columns from Navigation Settings (Template) */
            navSettings.footerColumns.map((column, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4" style={{ color: navSettings?.footerTextColor || "#ffffff" }}>
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links?.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.url || "#"} 
                        className="hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <Separator className="mb-8" style={{ backgroundColor: navSettings?.footerTextColor ? `${navSettings.footerTextColor}20` : "#292524" }} />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm" style={{ color: navSettings?.footerTextColor ? `${navSettings.footerTextColor}99` : "#78716c" }}>
            {navSettings?.footerCopyright || settings?.footer?.copyright || `© ${new Date().getFullYear()} ${navSettings?.siteName || settings?.footer?.companyName || "PKonstruct"}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
