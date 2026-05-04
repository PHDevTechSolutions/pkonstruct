"use client"

import Link from "next/link"
import { 
  HardHat, 
  MessageCircle, 
  Globe, 
  Camera, 
  Link2, 
  AtSign, 
  ExternalLink, 
  Video,
  Loader2,
  Sparkles,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  ArrowUpRight
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useNavigation } from "@/hooks/use-navigation"
import { useServices } from "@/hooks/use-services"
import { useSettings } from "@/hooks/use-settings"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { motion } from "framer-motion"

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
    <footer className="bg-gradient-to-br from-gray-50 via-white to-blue-50 border-t border-gray-200 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Link href="/" className="flex items-center gap-2 mb-4 group">
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
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <HardHat className="h-5 w-5 text-white" />
                </div>
              )}
              <span className="text-xl font-bold text-gray-900">
                {navSettings?.siteName || settings?.footer?.companyName || "PKonstruct"}
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-gray-600 leading-relaxed">
              {navSettings?.footerDescription || settings?.footer?.tagline || "Building excellence since 2005. Quality construction services you can trust."}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {/* From Navigation Settings */}
              {navSettings?.socialLinks?.filter(s => s.isActive && s.url).map((social) => {
                const IconComponent = iconMap[social.icon] || Globe
                return (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center hover:shadow-lg hover:border-blue-300 transition-all group"
                    aria-label={social.platform}
                  >
                    <IconComponent className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </motion.a>
                )
              })}
              {/* From Old Settings (fallback) */}
              {(!navSettings?.socialLinks || navSettings.socialLinks.filter(s => s.isActive && s.url).length === 0) && 
                settings?.footer?.socialLinks?.filter(s => s.isActive).map((social) => {
                  const IconComponent = iconMap[social.icon] || Globe
                  return (
                    <motion.a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center hover:shadow-lg hover:border-blue-300 transition-all group"
                      aria-label={social.platform}
                    >
                      <IconComponent className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    </motion.a>
                  )
                })}
            </div>
          </motion.div>

          {/* Show default columns OR custom columns */}
          {!navSettings?.footerColumns ? (
            <>
              {/* Services */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-md flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  Services
                </h3>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                ) : (
                  <ul className="space-y-3">
                    {services.slice(0, 5).map((service, index) => (
                      <motion.li 
                        key={service.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <Link 
                          href={`/services/${service.slug || service.id}`} 
                          className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1 group"
                        >
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {service.title}
                        </Link>
                      </motion.li>
                    ))}
                    <li>
                      <Link 
                        href="/services" 
                        className="text-blue-600 hover:text-blue-700 transition-colors font-medium flex items-center gap-1"
                      >
                        All Services
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </li>
                  </ul>
                )}
              </motion.div>

              {/* Company */}
              {footerNav.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    Company
                  </h3>
                  <ul className="space-y-3">
                    {footerNav.map((page, index) => (
                      <motion.li 
                        key={page.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <Link 
                          href={`/${page.slug}`} 
                          className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1 group"
                        >
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {page.title}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Legal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-md flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  Legal
                </h3>
                <ul className="space-y-3">
                  {legalLinks.map((link, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <Link 
                        href={link.href} 
                        className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1 group"
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </>
          ) : (
            /* Custom Footer Columns */
            navSettings.footerColumns.map((column, colIndex) => (
              <motion.div 
                key={colIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * colIndex }}
              >
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className={`w-6 h-6 bg-gradient-to-br rounded-md flex items-center justify-center ${
                    colIndex % 3 === 0 ? "from-blue-500 to-indigo-500" :
                    colIndex % 3 === 1 ? "from-green-500 to-emerald-500" :
                    "from-orange-500 to-red-500"
                  }`}>
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links?.map((link, linkIndex) => (
                    <motion.li 
                      key={linkIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * colIndex + linkIndex * 0.05 }}
                    >
                      <Link 
                        href={link.url || "#"} 
                        className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1 group"
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))
          )}
        </div>

        <Separator className="mb-8 bg-gray-200" />

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-gray-500">
            {navSettings?.footerCopyright || settings?.footer?.copyright || `© ${new Date().getFullYear()} ${navSettings?.siteName || settings?.footer?.companyName || "PKonstruct"}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Built with</span>
            <span className="text-red-500">♥</span>
            <span>by</span>
            <span className="font-semibold text-blue-600">PKonstruct</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
