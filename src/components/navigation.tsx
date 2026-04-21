"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, HardHat, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
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
  const { headerNav, loading: navLoading } = useNavigation()
  const { settings, loading: settingsLoading } = useSettings()
  const [navSettings, setNavSettings] = useState<NavSettings | null>(null)
  const [navSettingsLoading, setNavSettingsLoading] = useState(true)

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
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <HardHat className="h-7 w-7 text-gray-900" />
            <span className="text-lg font-bold text-gray-900">
              {navSettings?.siteName || settings?.header?.logoText || "PKonstruct"}
            </span>
          </Link>
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Clean Logo */}
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
              <HardHat className="h-7 w-7 text-gray-900" />
            )}
            <span className="text-lg font-bold text-gray-900">
              {navSettings?.siteName || settings?.header?.logoText || "PKonstruct"}
            </span>
          </Link>
        )}

        {/* Desktop Navigation - Clean Minimal Style */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative group"
            >
              {link.label}
              {/* Simple underline on hover */}
              <span className="absolute bottom-0 left-4 right-4 h-px bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
          
          {/* Divider */}
          {headerButtons.length > 0 && navLinks.length > 0 && (
            <div className="w-px h-5 bg-gray-200 mx-2" />
          )}
          
          {/* Clean Header Buttons */}
          {headerButtons.map((btn) => (
            <Button 
              key={btn.id} 
              variant={btn.variant} 
              asChild
              className={btn.variant === "default" 
                ? "bg-gray-900 hover:bg-gray-800 text-white border-0 rounded-none px-5" 
                : "text-gray-900 hover:bg-gray-100 border-gray-200 rounded-none px-5"
              }
            >
              <Link href={btn.link}>{btn.label}</Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation - Clean Style */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-gray-100 rounded-none"
            >
              <Menu className="h-5 w-5 text-gray-900" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-white border-l border-gray-200 p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                {settings?.header?.showLogo !== false && (
                  <Link href="/" className="flex items-center gap-2">
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
                      <HardHat className="h-7 w-7 text-gray-900" />
                    )}
                    <span className="text-lg font-bold text-gray-900">
                      {navSettings?.siteName || settings?.header?.logoText || "PKonstruct"}
                    </span>
                  </Link>
                )}
              </div>
              
              {/* Nav Links */}
              <nav className="flex-1 py-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="block px-6 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors border-l-2 border-transparent hover:border-gray-900"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              
              {/* Buttons */}
              {headerButtons.length > 0 && (
                <div className="p-6 border-t border-gray-200 space-y-3">
                  {headerButtons.map((btn) => (
                    <SheetClose key={btn.id} asChild>
                      <Button 
                        variant={btn.variant}
                        className={btn.variant === "default" 
                          ? "w-full bg-gray-900 hover:bg-gray-800 text-white border-0 rounded-none" 
                          : "w-full text-gray-900 hover:bg-gray-100 border-gray-200 rounded-none"
                        }
                        asChild
                      >
                        <Link href={btn.link}>{btn.label}</Link>
                      </Button>
                    </SheetClose>
                  ))}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
