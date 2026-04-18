"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin")

  return (
    <>
      {!isAdminPage && <Navigation />}
      {children}
      {!isAdminPage && <Footer />}
      {!isAdminPage && <BackToTop />}
    </>
  )
}
