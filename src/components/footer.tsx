"use client"

import Link from "next/link"
import { HardHat, MessageCircle, Globe, Camera, Link2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
  services: [
    { label: "Residential", href: "#services" },
    { label: "Commercial", href: "#services" },
    { label: "Industrial", href: "#services" },
    { label: "Renovations", href: "#services" },
    { label: "Project Management", href: "#services" }
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Our Projects", href: "#projects" },
    { label: "Careers", href: "#" },
    { label: "News", href: "#" },
    { label: "Contact", href: "#contact" }
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" }
  ]
}

const socialLinks = [
  { icon: MessageCircle, href: "#", label: "Facebook" },
  { icon: Globe, href: "#", label: "Twitter" },
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: Link2, href: "#", label: "LinkedIn" }
]

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <HardHat className="h-8 w-8 text-amber-500" />
              <span className="text-xl font-bold text-white">PKonstruct</span>
            </Link>
            <p className="text-stone-400 mb-6 max-w-sm">
              Building excellence since 2005. We transform your vision into reality with quality craftsmanship and innovative solutions.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-amber-600 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-amber-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-amber-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-amber-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-stone-800 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-500">
            © {new Date().getFullYear()} PKonstruct. All rights reserved.
          </p>
          <p className="text-sm text-stone-500">
            Designed and built with excellence.
          </p>
        </div>
      </div>
    </footer>
  )
}
