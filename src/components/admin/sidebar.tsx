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
  HardHat,
  LayoutTemplate,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/settings/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/admin/settings/general", label: "Settings", icon: Settings },
]

interface AdminSidebarProps {
  mobile?: boolean
}

export function AdminSidebar({ mobile }: AdminSidebarProps) {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <div className={cn(
      "h-full bg-stone-900 text-white flex flex-col",
      mobile ? "w-full" : "w-64 fixed left-0 top-0 h-screen"
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-stone-800">
        <Link href="/admin" className="flex items-center gap-2">
          <HardHat className="h-8 w-8 text-amber-500" />
          <span className="text-xl font-bold">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-amber-600 text-white"
                  : "text-stone-400 hover:bg-stone-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-stone-800">
        <div className="mb-4 px-4">
          <p className="text-sm text-stone-400">Logged in as</p>
          <p className="text-sm font-medium text-white truncate">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-stone-400 hover:text-white hover:bg-stone-800"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )
}
