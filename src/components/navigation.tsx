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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <HardHat className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              {navSettings?.siteName || settings?.header?.logoText || "PKonstruct"}
            </span>
          </Link>
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        {settings?.header?.showLogo !== false && (
          <Link href="/" className="flex items-center gap-2">
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
            <span className="text-xl font-bold text-foreground">
              {navSettings?.siteName || settings?.header?.logoText || "PKonstruct"}
            </span>
          </Link>
        )}

        {/* Desktop Navigation - Only Dynamic Pages */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {/* Dynamic Header Buttons */}
          {headerButtons.map((btn) => (
            <Button 
              key={btn.id} 
              variant={btn.variant} 
              asChild
              className={btn.variant === "default" ? "bg-primary hover:bg-primary/90" : ""}
            >
              <Link href={btn.link}>{btn.label}</Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex flex-col gap-6 mt-8">
              {settings?.header?.showLogo !== false && (
                <Link href="/" className="flex items-center gap-2">
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
                  <span className="text-xl font-bold text-foreground">
                    {navSettings?.siteName || settings?.header?.logoText || "PKonstruct"}
                  </span>
                </Link>
              )}
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              {/* Mobile Buttons */}
              {headerButtons.map((btn) => (
                <SheetClose key={btn.id} asChild>
                  <Button 
                    variant={btn.variant}
                    className={btn.variant === "default" ? "bg-primary hover:bg-primary/90" : ""}
                    asChild
                  >
                    <Link href={btn.link}>{btn.label}</Link>
                  </Button>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
