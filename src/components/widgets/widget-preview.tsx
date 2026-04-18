"use client"

import { useProjects } from "@/hooks/use-projects"
import { useServices } from "@/hooks/use-services"
import { useTeam } from "@/hooks/use-team"
import { useTestimonials } from "@/hooks/use-testimonials"
import { useBlogPosts } from "@/hooks/use-blog"
import { useClients } from "@/hooks/use-clients"
import type { PageSection } from "./types"

interface WidgetPreviewProps {
  section: PageSection
}

// Dynamic widget preview with real data
function ProjectsPreview() {
  const { projects, loading, error } = useProjects()
  if (loading) return <div className="text-xs text-stone-400 p-2">Loading projects...</div>
  if (error) return <div className="text-xs text-red-500 p-2">Error: {error}</div>
  if (projects.length === 0) return <div className="text-xs text-stone-400 p-2">No published projects found</div>
  
  return (
    <div className="grid grid-cols-2 gap-2">
      {projects.slice(0, 4).map((project) => (
        <div key={project.id} className="bg-stone-100 rounded p-2 overflow-hidden">
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.title}
              className="h-16 w-full object-cover rounded mb-1"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="h-16 bg-stone-200 rounded mb-1 flex items-center justify-center text-stone-400 text-lg">🏗️</div>
          )}
          <div className="text-xs font-medium truncate">{project.title}</div>
          <div className="text-xs text-stone-500 truncate">{project.category}</div>
        </div>
      ))}
    </div>
  )
}

function ServicesPreview() {
  const { services, loading, error } = useServices()
  if (loading) return <div className="text-xs text-stone-400 p-2">Loading services...</div>
  if (error) return <div className="text-xs text-red-500 p-2">Error: {error}</div>
  if (services.length === 0) return <div className="text-xs text-stone-400 p-2">No services found</div>
  
  return (
    <div className="grid grid-cols-3 gap-2">
      {services.slice(0, 3).map((service) => (
        <div key={service.id} className="bg-white border rounded p-2 text-center">
          {service.icon ? (
            // Check if icon is an emoji or text
            service.icon.match(/[\u{1F300}-\u{1F9FF}]/u) ? (
              <div className="text-2xl mb-1">{service.icon}</div>
            ) : service.icon.startsWith("http") ? (
              <img src={service.icon} alt="" className="h-8 w-8 mx-auto mb-1 object-contain" />
            ) : (
              <div className="h-8 w-8 mx-auto mb-1 bg-stone-100 rounded flex items-center justify-center text-stone-400 text-xs uppercase">
                {service.icon.slice(0, 3)}
              </div>
            )
          ) : (
            <div className="text-2xl mb-1">🛠️</div>
          )}
          <div className="text-xs truncate">{service.title}</div>
        </div>
      ))}
    </div>
  )
}

function TeamPreview() {
  const { members, loading, error } = useTeam()
  if (loading) return <div className="text-xs text-stone-400 p-2">Loading team...</div>
  if (error) return <div className="text-xs text-red-500 p-2">Error: {error}</div>
  if (members.length === 0) return <div className="text-xs text-stone-400 p-2">No team members found</div>
  
  return (
    <div className="flex gap-2 justify-center">
      {members.slice(0, 4).map((member) => (
        <div key={member.id} className="text-center">
          {member.image ? (
            <img 
              src={member.image} 
              alt={member.name} 
              className="w-10 h-10 rounded-full object-cover mb-1 mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = ''
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-stone-200 mb-1 mx-auto flex items-center justify-center text-stone-400 text-xs">👤</div>
          )}
          <div className="text-xs truncate max-w-[60px]">{member.name?.split(" ")[0] || "Member"}</div>
        </div>
      ))}
    </div>
  )
}

function TestimonialsPreview() {
  const { testimonials, loading } = useTestimonials()
  if (loading) return <div className="text-xs text-stone-400 p-2">Loading testimonials...</div>
  if (testimonials.length === 0) return <div className="text-xs text-stone-400 p-2">No testimonials found</div>
  
  const testimonial = testimonials[0]
  return (
    <div className="bg-stone-50 rounded p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-xs">👤</div>
        <div className="text-xs">
          <div className="font-medium">{testimonial.name}</div>
          <div className="text-stone-500">{testimonial.role || "Client"}</div>
        </div>
      </div>
      <div className="text-xs text-stone-600 italic line-clamp-2">"{testimonial.text?.slice(0, 80)}..."</div>
      <div className="text-amber-500 text-xs mt-1">{"★".repeat(testimonial.rating || 5)}</div>
    </div>
  )
}

function BlogPreview() {
  const { posts, loading } = useBlogPosts()
  if (loading) return <div className="text-xs text-stone-400 p-2">Loading posts...</div>
  if (posts.length === 0) return <div className="text-xs text-stone-400 p-2">No blog posts found</div>
  
  return (
    <div className="space-y-2">
      {posts.slice(0, 2).map((post) => (
        <div key={post.id} className="flex gap-2 bg-white border rounded p-2">
          {post.image ? (
            <img src={post.image} alt="" className="w-14 h-10 object-cover rounded flex-shrink-0" />
          ) : (
            <div className="w-14 h-10 bg-stone-200 rounded flex-shrink-0" />
          )}
          <div className="text-xs overflow-hidden">
            <div className="font-medium truncate">{post.title}</div>
            <div className="text-stone-500">{post.category} • {post.date}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ClientsPreview() {
  const { clients, loading, error } = useClients()
  if (loading) return <div className="text-xs text-stone-400 p-2">Loading clients...</div>
  if (error) return <div className="text-xs text-red-500 p-2">Error: {error}</div>
  if (clients.length === 0) return <div className="text-xs text-stone-400 p-2">No clients found</div>
  
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {clients.slice(0, 6).map((client) => (
        <div key={client.id} className="h-10 px-2 bg-stone-100 rounded flex items-center justify-center">
          {client.logo ? (
            <img 
              src={client.logo} 
              alt={client.name}
              className="h-6 max-w-[80px] object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <span className="text-xs font-medium text-stone-600 truncate max-w-[80px]">{client.name}</span>
          )}
        </div>
      ))}
    </div>
  )
}

export function WidgetPreview({ section }: WidgetPreviewProps) {
  // Get widget icon and label
  const widgetIcons: Record<string, string> = {
    hero: "🖼️",
    text: "📝",
    image: "🖼️",
    gallery: "🖼️",
    video: "🎬",
    projects: "🏗️",
    services: "🛠️",
    testimonials: "💬",
    team: "👥",
    blog: "📰",
    clients: "🏢",
    contact: "📧",
    cta: "🎯",
    stats: "📊",
    features: "⚡",
    faq: "❓",
    "before-after": "🔄",
    pricing: "💰",
    process: "⏱️",
    location: "📍",
    newsletter: "📬",
    awards: "🏆",
    downloads: "📥",
    "social-links": "🔗",
    partners: "🤝",
    comparison: "⚖️"
  }

  const widgetLabels: Record<string, string> = {
    hero: "Hero Banner",
    text: "Text Content",
    image: "Single Image",
    gallery: "Image Gallery",
    video: "Video Embed",
    projects: "Projects Grid",
    services: "Services Grid",
    testimonials: "Testimonials Slider",
    team: "Team Members",
    blog: "Blog Posts Grid",
    clients: "Client Logos",
    contact: "Contact Form",
    cta: "Call to Action",
    stats: "Statistics",
    features: "Features Grid",
    faq: "FAQ Accordion",
    "before-after": "Before/After Gallery",
    pricing: "Pricing Plans",
    process: "Process/Timeline",
    location: "Location/Map",
    newsletter: "Newsletter Subscribe",
    awards: "Awards/Certifications",
    downloads: "Downloads/Brochures",
    "social-links": "Social Media Links",
    partners: "Partners/Suppliers",
    comparison: "Comparison Table"
  }

  // Parse content for preview
  let parsedContent: any = null
  try {
    const contentToParse = typeof section.content === 'string' ? section.content : JSON.stringify(section.content)
    parsedContent = JSON.parse(contentToParse || "[]")
  } catch {
    parsedContent = null
  }

  const renderPreview = () => {
    switch (section.type) {
      case "hero":
        // Parse hero content to check for slides
        let heroSlides = []
        let heroSubtitle = ""
        try {
          const contentToParse = typeof section.content === 'string' ? section.content : JSON.stringify(section.content)
          const heroContent = JSON.parse(contentToParse || "{}")
          heroSlides = heroContent.slides || []
          heroSubtitle = heroContent.subtitle || ""
        } catch {
          // Use defaults
        }
        const heroContentStr = typeof section.content === 'string' ? section.content : ''
        const isHeroContentJson = heroContentStr.trim().startsWith('{') || heroContentStr.trim().startsWith('[')
        return (
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white p-4 rounded">
            <div className="text-lg font-bold truncate">{section.title || "Hero Title"}</div>
            <div className="text-sm opacity-80 truncate">
              {heroSlides.length > 0 
                ? `${heroSlides.length} slide(s)` 
                : isHeroContentJson 
                  ? (heroSubtitle || "Hero banner with advanced settings")
                  : (heroContentStr.slice(0, 50) || "Hero subtitle text...")}
            </div>
          </div>
        )

      case "text":
        // Don't show raw JSON in text preview
        const textContentStr = typeof section.content === 'string' ? section.content : ''
        const isTextContentJson = textContentStr.trim().startsWith('{') || textContentStr.trim().startsWith('[')
        return (
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-sm mb-1">{section.title || "Text Section"}</div>
            <div className="text-xs text-stone-500 line-clamp-2">
              {isTextContentJson ? "Text content with formatting..." : (textContentStr || "Content preview...")}
            </div>
          </div>
        )

      case "image":
        return (
          <div className="bg-stone-100 rounded overflow-hidden">
            {section.image ? (
              <img src={section.image} alt="" className="w-full h-24 object-cover" />
            ) : (
              <div className="h-24 flex items-center justify-center text-stone-400 text-3xl">🖼️</div>
            )}
            <div className="p-2 text-xs text-stone-500 truncate">{section.title || "Image caption"}</div>
          </div>
        )

      case "gallery":
        return (
          <div className="grid grid-cols-3 gap-1">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-stone-200 h-12 rounded flex items-center justify-center text-stone-400 text-xs">
                🖼️
              </div>
            ))}
          </div>
        )

      case "video":
        return (
          <div className="bg-stone-900 rounded overflow-hidden">
            <div className="h-24 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white text-xl">▶</span>
              </div>
            </div>
            <div className="p-2 text-xs text-white/70 truncate">{section.title || "Video title"}</div>
          </div>
        )

      case "projects":
        return <ProjectsPreview />

      case "services":
        return <ServicesPreview />

      case "testimonials":
        return <TestimonialsPreview />

      case "team":
        return <TeamPreview />

      case "blog":
        return <BlogPreview />

      case "clients":
        return <ClientsPreview />

      case "contact":
        return (
          <div className="bg-white border rounded p-3 space-y-2">
            <div className="h-8 bg-stone-100 rounded" />
            <div className="h-8 bg-stone-100 rounded" />
            <div className="h-20 bg-stone-100 rounded" />
            <div className="h-8 bg-amber-600 rounded w-24" />
          </div>
        )

      case "cta":
        const ctaContentStr = typeof section.content === 'string' ? section.content : ''
        return (
          <div className="bg-amber-600 text-white p-4 rounded text-center">
            <div className="font-bold mb-1">{section.title || "Call to Action"}</div>
            <div className="text-sm opacity-90">{ctaContentStr.slice(0, 40) || "Description text..."}</div>
            <div className="mt-2 inline-block px-4 py-1 bg-white text-amber-600 rounded text-sm font-medium">
              Get Started
            </div>
          </div>
        )

      case "stats":
        return (
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map((i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-bold text-amber-600">{i}00+</div>
                <div className="text-xs text-stone-500">Stat</div>
              </div>
            ))}
          </div>
        )

      case "features":
        return (
          <div className="grid grid-cols-2 gap-2">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-start gap-2 bg-white border rounded p-2">
                <div className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center text-amber-600 text-xs">✓</div>
                <div className="text-xs">Feature {i}</div>
              </div>
            ))}
          </div>
        )

      case "faq":
        return (
          <div className="space-y-1">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white border rounded p-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Question {i}?</span>
                  <span>▼</span>
                </div>
              </div>
            ))}
          </div>
        )

      case "before-after":
        return (
          <div className="relative h-24 bg-stone-200 rounded overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="w-1/2 bg-stone-300 flex items-center justify-center text-xs text-stone-600">Before</div>
              <div className="w-1/2 bg-amber-100 flex items-center justify-center text-xs text-amber-700">After</div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow text-xs">↔</div>
          </div>
        )

      case "pricing":
        return (
          <div className="grid grid-cols-3 gap-1">
            {["Basic", "Pro", "Enterprise"].map((plan, i) => (
              <div key={plan} className={`rounded p-2 text-center ${i === 1 ? "bg-amber-50 border-2 border-amber-500" : "bg-white border"}`}>
                <div className="text-xs font-medium">{plan}</div>
                <div className={`text-sm font-bold ${i === 1 ? "text-amber-600" : ""}`}>₱{i === 2 ? "Custom" : `${(i+1)*50}K`}</div>
              </div>
            ))}
          </div>
        )

      case "process":
        return (
          <div className="flex items-center justify-center gap-1">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                  {i}
                </div>
                {i < 4 && <div className="w-4 h-0.5 bg-amber-200" />}
              </div>
            ))}
          </div>
        )

      case "location":
        return (
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-stone-100 rounded h-20 flex items-center justify-center text-stone-400 text-2xl">🗺️</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1"><span>📍</span> Address</div>
              <div className="flex items-center gap-1"><span>📞</span> Phone</div>
              <div className="flex items-center gap-1"><span>✉️</span> Email</div>
            </div>
          </div>
        )

      case "newsletter":
        return (
          <div className="bg-amber-600 text-white p-3 rounded text-center">
            <div className="text-sm font-medium mb-1">📬 Newsletter</div>
            <div className="flex gap-1">
              <div className="flex-1 h-6 bg-white/20 rounded" />
              <div className="h-6 px-2 bg-stone-900 rounded text-xs flex items-center">Subscribe</div>
            </div>
          </div>
        )

      case "awards":
        return (
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map((i) => (
              <div key={i} className="text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-xs text-stone-500">Award {i}</div>
              </div>
            ))}
          </div>
        )

      case "downloads":
        return (
          <div className="space-y-1">
            {[1,2].map((i) => (
              <div key={i} className="flex items-center gap-2 bg-white border rounded p-2">
                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-500 text-xs">PDF</div>
                <div className="flex-1 text-xs truncate">Document {i}.pdf</div>
                <div className="text-stone-400">↓</div>
              </div>
            ))}
          </div>
        )

      case "social-links":
        return (
          <div className="flex justify-center gap-2">
            {["FB", "IG", "LI", "YT"].map((social) => (
              <div key={social} className="w-8 h-8 rounded bg-stone-800 text-white flex items-center justify-center text-xs font-bold">
                {social}
              </div>
            ))}
          </div>
        )

      case "partners":
        return (
          <div className="space-y-2">
            <div className="text-xs text-stone-500">Materials</div>
            <div className="flex gap-2 opacity-50">
              {[1,2].map((i) => <div key={i} className="h-6 w-16 bg-stone-300 rounded" />)}
            </div>
          </div>
        )

      case "comparison":
        return (
          <div className="bg-white border rounded overflow-hidden text-xs">
            <div className="grid grid-cols-3 border-b bg-stone-50">
              <div className="p-1 font-medium">Feature</div>
              <div className="p-1 text-center">Option A</div>
              <div className="p-1 text-center">Option B</div>
            </div>
            {[1,2,3].map((i) => (
              <div key={i} className="grid grid-cols-3 border-b">
                <div className="p-1">Feature {i}</div>
                <div className="p-1 text-center text-green-600">✓</div>
                <div className="p-1 text-center text-green-600">✓</div>
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="bg-stone-100 rounded p-3 text-center text-stone-400 text-sm">
            {widgetIcons[section.type] || "📦"} Widget Preview
          </div>
        )
    }
  }

  return (
    <div className="widget-preview">
      {renderPreview()}
    </div>
  )
}
