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
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Subtle gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        {/* Logo with glow effect */}
        {settings?.header?.showLogo !== false && (
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {navSettings?.headerLogo ? (
                <img 
                  src={navSettings.headerLogo} 
                  alt="Logo" 
                  className="h-8 w-auto relative z-10"
                />
              ) : settings?.header?.logoImage ? (
                <img 
                  src={settings.header.logoImage} 
                  alt="Logo" 
                  className="h-8 w-auto relative z-10"
                />
              ) : (
                <div className="relative z-10 p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg border border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                  <HardHat className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:to-foreground transition-all duration-300">
              {navSettings?.siteName || settings?.header?.logoText || "PKonstruct"}
            </span>
          </Link>
        )}

        {/* Desktop Navigation - Premium Blackbox Style */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 group"
            >
              {/* Hover background effect */}
              <span className="absolute inset-0 bg-muted/50 rounded-lg scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" />
              {/* Active indicator line */}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover:w-1/2 transition-all duration-300 rounded-full" />
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
          
          {/* Divider */}
          {headerButtons.length > 0 && navLinks.length > 0 && (
            <div className="w-px h-6 bg-border/50 mx-2" />
          )}
          
          {/* Dynamic Header Buttons with premium styling */}
          {headerButtons.map((btn) => (
            <Button 
              key={btn.id} 
              variant={btn.variant} 
              asChild
              className={btn.variant === "default" 
                ? "relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] transition-all duration-300 border-0" 
                : "hover:bg-muted/80 transition-all duration-300"
              }
            >
              <Link href={btn.link}>{btn.label}</Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation - Premium Blackbox Style */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-muted/80 transition-colors"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px] bg-background/95 backdrop-blur-xl border-l border-border/50">
            {/* Gradient accent at top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-primary/50 to-transparent" />
            
            <div className="flex flex-col gap-6 mt-8">
              {settings?.header?.showLogo !== false && (
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {navSettings?.headerLogo ? (
                      <img 
                        src={navSettings.headerLogo} 
                        alt="Logo" 
                        className="h-8 w-auto relative z-10"
                      />
                    ) : settings?.header?.logoImage ? (
                      <img 
                        src={settings.header.logoImage} 
                        alt="Logo" 
                        className="h-8 w-auto relative z-10"
                      />
                    ) : (
                      <div className="relative z-10 p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg border border-primary/20">
                        <HardHat className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {navSettings?.siteName || settings?.header?.logoText || "PKonstruct"}
                  </span>
                </Link>
              )}
              
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="group relative px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg overflow-hidden"
                    >
                      {/* Hover background */}
                      <span className="absolute inset-0 bg-gradient-to-r from-muted/50 to-muted/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Left accent line */}
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-full group-hover:h-6 transition-all duration-300" />
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              
              {/* Divider */}
              {headerButtons.length > 0 && (
                <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              )}
              
              {/* Mobile Buttons - Premium Style */}
              {headerButtons.map((btn) => (
                <SheetClose key={btn.id} asChild>
                  <Button 
                    variant={btn.variant}
                    className={btn.variant === "default" 
                      ? "w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all duration-300 border-0" 
                      : "w-full hover:bg-muted/80 transition-all duration-300"
                    }
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
