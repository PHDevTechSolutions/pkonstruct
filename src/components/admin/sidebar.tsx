"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Briefcase,
  Users,
  Settings,
  LogOut,
  Sparkles,
  LayoutTemplate,
  Code2,
  Database,
  Globe,
  Mail,
  MessageCircle,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, category: "overview" },
  { href: "/admin/inquiries", label: "Inquiries", icon: Mail, category: "overview" },
  { href: "/admin/messages", label: "Messages", icon: MessageCircle, category: "overview" },
  { href: "/admin/pages", label: "Pages", icon: Globe, category: "content" },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText, category: "content" },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, category: "content" },
  { href: "/admin/services", label: "Services", icon: Briefcase, category: "content" },
  { href: "/admin/team", label: "Team", icon: Users, category: "content" },
  { href: "/admin/settings/templates", label: "Templates", icon: LayoutTemplate, category: "system" },
  { href: "/admin/settings/general", label: "Settings", icon: Settings, category: "system" },
]

const categoryLabels: Record<string, string> = {
  overview: "Overview",
  content: "Content Management",
  system: "System",
}

interface AdminSidebarProps {
  mobile?: boolean
}

export function AdminSidebar({ mobile }: AdminSidebarProps) {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  // Group nav items by category
  const groupedItems = navItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof navItems>)

  const categoryOrder = ["overview", "content", "system"]

  return (
    <div className={cn(
      "h-full bg-[#111111] text-white flex flex-col border-r border-[#222222]",
      mobile ? "w-full" : "w-72 fixed left-0 top-0 h-screen"
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-[#222222]">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-lg blur-xl" />
            <div className="relative p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30">
              <Sparkles className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              PKonstruct
            </span>
            <span className="text-xs text-gray-500 font-mono">AI Admin Console</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-auto">
        {categoryOrder.map((category) => {
          const items = groupedItems[category]
          if (!items || items.length === 0) return null

          return (
            <div key={category}>
              <div className="px-4 mb-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
                <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                  {categoryLabels[category]}
                </span>
              </div>
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                        isActive
                          ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                          : "text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-200 border border-transparent"
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-cyan-400" : "text-gray-500 group-hover:text-gray-300"
                      )} />
                      <span className="font-medium text-sm">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-[#222222] space-y-3">
        <div className="px-4 py-3 bg-[#1a1a1a] rounded-xl border border-[#333333]">
          <div className="flex items-center gap-2 mb-1">
            <Code2 className="h-3 w-3 text-cyan-500" />
            <span className="text-xs text-gray-500 font-mono">session.active</span>
          </div>
          <p className="text-sm text-gray-300 truncate font-mono">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 rounded-xl transition-all duration-200"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-mono text-sm">terminate_session()</span>
        </Button>
      </div>
    </div>
  )
}
