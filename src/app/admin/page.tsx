"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import {
  FileText,
  FolderKanban,
  Briefcase,
  Users,
  Zap,
  Activity,
  Plus,
  ExternalLink,
  Terminal,
  Cpu,
  Database,
  Globe,
  ArrowUpRight,
  Sparkles,
  Code2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Stats {
  blogPosts: number
  projects: number
  services: number
  team: number
}

const gradients = [
  "from-cyan-500 to-blue-500",
  "from-purple-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    blogPosts: 0,
    projects: 0,
    services: 0,
    team: 0,
  })
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const fetchStats = async () => {
      try {
        const [blogSnap, projectsSnap, servicesSnap, teamSnap] = await Promise.all([
          getDocs(collection(db, "blogPosts")),
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "services")),
          getDocs(collection(db, "team")),
        ])

        setStats({
          blogPosts: blogSnap.size,
          projects: projectsSnap.size,
          services: servicesSnap.size,
          team: teamSnap.size,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      id: "blog",
      title: "Blog Posts",
      value: stats.blogPosts,
      icon: FileText,
      gradient: gradients[0],
      glowColor: "shadow-cyan-500/20",
      href: "/admin/blog",
    },
    {
      id: "projects",
      title: "Projects",
      value: stats.projects,
      icon: FolderKanban,
      gradient: gradients[1],
      glowColor: "shadow-purple-500/20",
      href: "/admin/projects",
    },
    {
      id: "services",
      title: "Services",
      value: stats.services,
      icon: Briefcase,
      gradient: gradients[2],
      glowColor: "shadow-amber-500/20",
      href: "/admin/services",
    },
    {
      id: "team",
      title: "Team Members",
      value: stats.team,
      icon: Users,
      gradient: gradients[3],
      glowColor: "shadow-emerald-500/20",
      href: "/admin/team",
    },
  ]

  const quickActions = [
    { href: "/admin/blog/new", label: "New Blog Post", icon: FileText, desc: "Create article" },
    { href: "/admin/projects/new", label: "New Project", icon: FolderKanban, desc: "Add project" },
    { href: "/admin/services/new", label: "New Service", icon: Briefcase, desc: "Add service" },
    { href: "/admin/team/new", label: "Team Member", icon: Users, desc: "Add member" },
  ]

  return (
    <div className={cn("space-y-8 transition-all duration-700", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30">
              <Terminal className="h-5 w-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400 font-mono text-sm">// System overview and content management</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-xl border border-[#333333]">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-sm text-gray-300">AI-Powered Admin</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const delay = index * 100
          return (
            <a
              key={stat.id}
              href={stat.href}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-[#111111] border border-[#222222] p-6 transition-all duration-500 hover:border-[#333333] hover:scale-[1.02]",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${delay}ms` }}
            >
              {/* Glow effect */}
              <div className={cn(
                "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                stat.glowColor,
                `bg-gradient-to-br ${stat.gradient}`
              )} />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "p-3 rounded-xl bg-gradient-to-br",
                    stat.gradient,
                    "bg-opacity-10"
                  )}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-400 font-mono">{stat.title}</p>
                  <p className="text-3xl font-bold text-white font-mono">
                    {loading ? (
                      <span className="inline-block w-8 h-8 rounded bg-[#222222] animate-pulse" />
                    ) : (
                      <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {stat.value.toString().padStart(2, '0')}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Bottom gradient line */}
              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r",
                stat.gradient,
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              )} />
            </a>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className={cn(
          "lg:col-span-2 rounded-2xl bg-[#111111] border border-[#222222] overflow-hidden transition-all duration-700",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )} style={{ transitionDelay: "200ms" }}>
          <div className="p-6 border-b border-[#222222]">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
            </div>
            <p className="text-sm text-gray-500 font-mono mt-1">// Execute common tasks</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <a
                    key={action.href}
                    href={action.href}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-[#1a1a1a] border border-[#333333] hover:border-cyan-500/50 hover:bg-[#222222] transition-all duration-300"
                    style={{ transitionDelay: `${300 + index * 50}ms` }}
                  >
                    <div className="p-3 rounded-lg bg-[#222222] group-hover:bg-cyan-500/20 transition-colors">
                      <Icon className="h-5 w-5 text-gray-400 group-hover:text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                        {action.label}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">{action.desc}</p>
                    </div>
                    <Plus className="h-4 w-4 text-gray-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className={cn(
          "rounded-2xl bg-[#111111] border border-[#222222] overflow-hidden transition-all duration-700",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )} style={{ transitionDelay: "300ms" }}>
          <div className="p-6 border-b border-[#222222]">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">System Status</h2>
            </div>
            <p className="text-sm text-gray-500 font-mono mt-1">// Real-time metrics</p>
          </div>

          <div className="p-6 space-y-4">
            <StatusItem
              icon={Globe}
              label="Website"
              status="online"
              value="100% uptime"
            />
            <StatusItem
              icon={Database}
              label="Database"
              status="online"
              value="Connected"
            />
            <StatusItem
              icon={Cpu}
              label="API Status"
              status="online"
              value="Operational"
            />
            <StatusItem
              icon={Code2}
              label="Build"
              status="ready"
              value="v1.0.0"
            />
          </div>

          {/* Terminal-like footer */}
          <div className="px-6 py-4 bg-[#0a0a0a] border-t border-[#222222]">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-cyan-500">➜</span>
              <span className="text-gray-400">~</span>
              <span className="text-gray-500">systemctl status all</span>
              <span className="text-green-400">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity / Console */}
      <div className={cn(
        "rounded-2xl bg-[#111111] border border-[#222222] overflow-hidden transition-all duration-700",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )} style={{ transitionDelay: "400ms" }}>
        <div className="p-6 border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Admin Console</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#333333]" />
            <div className="w-3 h-3 rounded-full bg-[#333333]" />
            <div className="w-3 h-3 rounded-full bg-[#333333]" />
          </div>
        </div>

        <div className="p-6 bg-[#0a0a0a] font-mono text-sm space-y-2">
          <div className="flex items-start gap-3">
            <span className="text-gray-600">[00:00:01]</span>
            <span className="text-cyan-500">INFO</span>
            <span className="text-gray-400">Admin dashboard initialized successfully</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-gray-600">[00:00:02]</span>
            <span className="text-purple-500">DB</span>
            <span className="text-gray-400">Connected to Firebase Firestore</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-gray-600">[00:00:03]</span>
            <span className="text-emerald-500">AUTH</span>
            <span className="text-gray-400">User session validated</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-gray-600">[00:00:04]</span>
            <span className="text-amber-500">CACHE</span>
            <span className="text-gray-400">Statistics loaded from database</span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-cyan-500 animate-pulse">➜</span>
            <span className="text-gray-500">_</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusItem({
  icon: Icon,
  label,
  status,
  value,
}: {
  icon: React.ElementType
  label: string
  status: "online" | "offline" | "ready" | "warning"
  value: string
}) {
  const statusColors = {
    online: "bg-emerald-500 shadow-emerald-500/50",
    offline: "bg-red-500 shadow-red-500/50",
    ready: "bg-blue-500 shadow-blue-500/50",
    warning: "bg-amber-500 shadow-amber-500/50",
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a1a1a] border border-[#333333]">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#222222]">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
        <div>
          <p className="text-sm text-white">{label}</p>
          <p className="text-xs text-gray-500 font-mono">{value}</p>
        </div>
      </div>
      <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px]", statusColors[status])} />
    </div>
  )
}
