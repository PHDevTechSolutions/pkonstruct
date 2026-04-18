"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { FileText, FolderKanban, Briefcase, Users, TrendingUp, Eye } from "lucide-react"

interface Stats {
  blogPosts: number
  projects: number
  services: number
  team: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    blogPosts: 0,
    projects: 0,
    services: 0,
    team: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    { title: "Blog Posts", value: stats.blogPosts, icon: FileText, color: "bg-blue-500" },
    { title: "Projects", value: stats.projects, icon: FolderKanban, color: "bg-green-500" },
    { title: "Services", value: stats.services, icon: Briefcase, color: "bg-amber-500" },
    { title: "Team Members", value: stats.team, icon: Users, color: "bg-purple-500" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">Dashboard</h2>
        <p className="text-stone-500">Overview of your website content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-stone-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-stone-900">
                      {loading ? "-" : stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <QuickActionLink href="/admin/blog/new" label="Create New Blog Post" />
            <QuickActionLink href="/admin/projects/new" label="Add New Project" />
            <QuickActionLink href="/admin/services/new" label="Add New Service" />
            <QuickActionLink href="/admin/team/new" label="Add Team Member" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Website Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Home Page</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">Published</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Services Page</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">Published</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Blog</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Contact Form</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function QuickActionLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors"
    >
      <span className="text-stone-700">{label}</span>
      <span className="text-amber-600">→</span>
    </a>
  )
}
