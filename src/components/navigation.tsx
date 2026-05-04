"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, HardHat, Loader2, X, ChevronRight, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet"
import { useNavigation } from "@/hooks/use-navigation"
import { useSettings } from "@/hooks/use-settings"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

interface NavSettings {
  siteName: string
  headerLogo: string
  headerBgColor: string
  headerTextColor: string
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { headerNav, loading: navLoading } = useNavigation()
  const { settings, loading: settingsLoading } = useSettings()
  const [navSettings, setNavSettings] = useState<NavSettings | null>(null)
  const [navSettingsLoading, setNavSettingsLoading] = useState(true)
  const pathname = usePathname()
  
  // Force solid background on shop pages (where bg is white)
  const isShopPage = pathname?.startsWith('/shop') || pathname?.startsWith('/product') || pathname?.startsWith('/cart') || pathname?.startsWith('/checkout') || pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/account') || pathname?.startsWith('/order-confirmation')
  const forceSolid = isShopPage

  // Detect scroll for transparent/solid header
  useEffect(() => {
    const handleScroll = () => {
      // Use 100px threshold for better UX
      setScrolled(window.scrollY > 100)
    }
    // Initial check
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch navigation settings from settings/navigation
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
      } finally {
        setNavSettingsLoading(false)
      }
    }
    fetchNavSettings()
  }, [])

  // Only show dynamic pages from database
  const navLinks = headerNav.map(item => ({ 
    href: item.slug === "home" ? "/" : `/${item.slug}`, 
    label: item.title 
  }))

  const headerButtons = settings?.header?.buttons?.filter(b => b.isActive) || []

  const loading = navLoading || settingsLoading || navSettingsLoading

  if (loading) {
    return (
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <HardHat className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              {navSettings?.siteName || settings?.header?.logoText || "PKonstruct"}
            </span>
          </Link>
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        </div>
      </motion.header>
    )
  }

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
        scrolled || forceSolid
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg shadow-gray-200/20" 
          : "bg-transparent border-b border-white/10"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        {settings?.header?.showLogo !== false && (
          <Link href="/" className="flex items-center gap-2 group">
            {navSettings?.headerLogo ? (
              <img 
                src={navSettings.headerLogo} 
                alt="Logo" 
                className="h-7 w-auto"
              />
            ) : settings?.header?.logoImage ? (
              <img 
                src={settings.header.logoImage} 
                alt="Logo" 
                className="h-7 w-auto"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <HardHat className="h-5 w-5 text-white" />
              </div>
            )}
            <span className={`text-lg font-bold transition-colors ${
              scrolled || forceSolid ? "text-gray-900" : "text-white"
            }`}>
              {navSettings?.siteName || settings?.header?.logoText || "PKonstruct"}
            </span>
          </Link>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 group ${
                scrolled || forceSolid
                  ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50" 
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="relative z-10">{link.label}</span>
              <motion.span
                className={`absolute inset-0 rounded-full ${
                  scrolled || forceSolid ? "bg-blue-100" : "bg-white/10"
                }`}
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </Link>
          ))}
          
          {/* Divider */}
          {headerButtons.length > 0 && navLinks.length > 0 && (
            <div className={`w-px h-6 mx-3 ${scrolled || forceSolid ? "bg-gray-300" : "bg-white/30"}`} />
          )}
          
          {/* Header Buttons */}
          {headerButtons.map((btn) => (
            <Button 
              key={btn.id} 
              variant={btn.variant} 
              asChild
              className={btn.variant === "default" 
                ? "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 text-white border-0 rounded-full px-6 h-10 font-semibold transition-all duration-300 group overflow-hidden relative" 
                : scrolled || forceSolid
                  ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-gray-300 hover:border-blue-300 rounded-full px-6 h-10 font-medium transition-all duration-300"
                  : "text-white hover:text-white hover:bg-white/20 border border-white/40 hover:border-white/60 rounded-full px-6 h-10 font-medium transition-all duration-300"
              }
            >
              <Link href={btn.link} className="flex items-center gap-2">
                {btn.label}
                {btn.variant === "default" && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon"
                className={`rounded-full h-10 w-10 ${
                  scrolled || forceSolid
                    ? "hover:bg-blue-50 text-gray-700" 
                    : "hover:bg-white/20 text-white border border-white/30"
                }`}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </motion.div>
          </SheetTrigger>
          <SheetContent side="right" className="w-[340px] bg-gradient-to-br from-white to-gray-50 border-l border-gray-200 p-0 shadow-2xl">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col h-full">
              {/* Header with Gradient */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <HardHat className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-gray-900 block">
                      {navSettings?.siteName || settings?.header?.logoText || "PKonstruct"}
                    </span>
                    <span className="text-xs text-blue-600 font-medium">Building Excellence</span>
                  </div>
                </Link>
              </div>
              
              {/* Nav Links */}
              <nav className="flex-1 py-6 px-3">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                  >
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        className="flex items-center justify-between mx-3 px-4 py-3.5 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all group"
                      >
                        <span>{link.label}</span>
                        <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                        </div>
                      </Link>
                    </SheetClose>
                  </motion.div>
                ))}
              </nav>
              
              {/* Buttons */}
              {headerButtons.length > 0 && (
                <div className="p-6 bg-gray-50/50 border-t border-gray-100 space-y-3">
                  {headerButtons.map((btn, index) => (
                    <SheetClose key={btn.id} asChild>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <Button 
                          variant={btn.variant}
                          className={btn.variant === "default" 
                            ? "w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/25 text-white border-0 rounded-full h-12 font-semibold text-base" 
                            : "w-full text-gray-700 hover:text-blue-600 hover:bg-white border-2 border-gray-200 hover:border-blue-300 rounded-full h-12 font-medium"
                          }
                          asChild
                        >
                          <Link href={btn.link} className="flex items-center justify-center gap-2">
                            {btn.label}
                            {btn.variant === "default" && <ArrowRight className="w-4 h-4" />}
                          </Link>
                        </Button>
                      </motion.div>
                    </SheetClose>
                  ))}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  )
}
