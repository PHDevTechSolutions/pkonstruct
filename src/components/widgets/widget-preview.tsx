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
  if (loading) return <div className="text-xs text-muted-foreground p-2">Loading projects...</div>
  if (error) return <div className="text-xs text-destructive p-2">Error: {error}</div>
  if (projects.length === 0) return <div className="text-xs text-muted-foreground p-2">No published projects found</div>
  
  return (
    <div className="grid grid-cols-2 gap-2">
      {projects.slice(0, 4).map((project) => (
        <div key={project.id} className="bg-muted rounded p-2 overflow-hidden">
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
            <div className="h-16 bg-muted/70 rounded mb-1 flex items-center justify-center text-muted-foreground text-lg">🏗️</div>
          )}
          <div className="text-xs font-medium truncate text-foreground">{project.title}</div>
          <div className="text-xs text-muted-foreground truncate">{project.category}</div>
        </div>
      ))}
    </div>
  )
}

function ServicesPreview() {
  const { services, loading, error } = useServices()
  if (loading) return <div className="text-xs text-muted-foreground p-2">Loading services...</div>
  if (error) return <div className="text-xs text-destructive p-2">Error: {error}</div>
  if (services.length === 0) return <div className="text-xs text-muted-foreground p-2">No services found</div>
  
  return (
    <div className="grid grid-cols-3 gap-2">
      {services.slice(0, 3).map((service) => (
        <div key={service.id} className="bg-card border border-border rounded p-2 text-center">
          {service.icon ? (
            // Check if icon is an emoji or text
            service.icon.match(/[\u{1F300}-\u{1F9FF}]/u) ? (
              <div className="text-2xl mb-1">{service.icon}</div>
            ) : service.icon.startsWith("http") ? (
              <img src={service.icon} alt="" className="h-8 w-8 mx-auto mb-1 object-contain" />
            ) : (
              <div className="h-8 w-8 mx-auto mb-1 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs uppercase">
                {service.icon.slice(0, 3)}
              </div>
            )
          ) : (
            <div className="text-2xl mb-1">🛠️</div>
          )}
          <div className="text-xs truncate text-card-foreground">{service.title}</div>
        </div>
      ))}
    </div>
  )
}

function TeamPreview() {
  const { members, loading, error } = useTeam()
  if (loading) return <div className="text-xs text-muted-foreground p-2">Loading team...</div>
  if (error) return <div className="text-xs text-destructive p-2">Error: {error}</div>
  if (members.length === 0) return <div className="text-xs text-muted-foreground p-2">No team members found</div>
  
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
            <div className="w-10 h-10 rounded-full bg-muted mb-1 mx-auto flex items-center justify-center text-muted-foreground text-xs">👤</div>
          )}
          <div className="text-xs truncate max-w-[60px] text-foreground">{member.name?.split(" ")[0] || "Member"}</div>
        </div>
      ))}
    </div>
  )
}

function TestimonialsPreview() {
  const { testimonials, loading } = useTestimonials()
  if (loading) return <div className="text-xs text-muted-foreground p-2">Loading testimonials...</div>
  if (testimonials.length === 0) return <div className="text-xs text-muted-foreground p-2">No testimonials found</div>
  
  const testimonial = testimonials[0]
  return (
    <div className="bg-muted/50 rounded p-3 border border-border">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">👤</div>
        <div className="text-xs">
          <div className="font-medium text-foreground">{testimonial.name}</div>
          <div className="text-muted-foreground">{testimonial.role || "Client"}</div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground italic line-clamp-2">"{testimonial.text?.slice(0, 80)}..."</div>
      <div className="text-primary text-xs mt-1">{"★".repeat(testimonial.rating || 5)}</div>
    </div>
  )
}

function BlogPreview() {
  const { posts, loading } = useBlogPosts()
  if (loading) return <div className="text-xs text-muted-foreground p-2">Loading posts...</div>
  if (posts.length === 0) return <div className="text-xs text-muted-foreground p-2">No blog posts found</div>
  
  return (
    <div className="space-y-2">
      {posts.slice(0, 2).map((post) => (
        <div key={post.id} className="flex gap-2 bg-card border border-border rounded p-2">
          {post.image ? (
            <img src={post.image} alt="" className="w-14 h-10 object-cover rounded flex-shrink-0" />
          ) : (
            <div className="w-14 h-10 bg-muted rounded flex-shrink-0" />
          )}
          <div className="text-xs overflow-hidden">
            <div className="font-medium truncate text-card-foreground">{post.title}</div>
            <div className="text-muted-foreground">{post.category} • {post.date}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ClientsPreview() {
  const { clients, loading, error } = useClients()
  if (loading) return <div className="text-xs text-muted-foreground p-2">Loading clients...</div>
  if (error) return <div className="text-xs text-destructive p-2">Error: {error}</div>
  if (clients.length === 0) return <div className="text-xs text-muted-foreground p-2">No clients found</div>
  
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {clients.slice(0, 6).map((client) => (
        <div key={client.id} className="h-10 px-2 bg-muted rounded flex items-center justify-center">
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
            <span className="text-xs font-medium text-muted-foreground truncate max-w-[80px]">{client.name}</span>
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
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 rounded">
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
          <div className="bg-card p-3 rounded border border-border">
            <div className="font-medium text-sm mb-1 text-card-foreground">{section.title || "Text Section"}</div>
            <div className="text-xs text-muted-foreground line-clamp-2">
              {isTextContentJson ? "Text content with formatting..." : (textContentStr || "Content preview...")}
            </div>
          </div>
        )

      case "image":
        return (
          <div className="bg-muted rounded overflow-hidden">
            {section.image ? (
              <img src={section.image} alt="" className="w-full h-24 object-cover" />
            ) : (
              <div className="h-24 flex items-center justify-center text-muted-foreground text-3xl">🖼️</div>
            )}
            <div className="p-2 text-xs text-muted-foreground truncate">{section.title || "Image caption"}</div>
          </div>
        )

      case "gallery":
        return (
          <div className="grid grid-cols-3 gap-1">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-muted h-12 rounded flex items-center justify-center text-muted-foreground text-xs">
                🖼️
              </div>
            ))}
          </div>
        )

      case "video":
        return (
          <div className="bg-muted rounded overflow-hidden border border-border">
            <div className="h-24 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-xl">▶</span>
              </div>
            </div>
            <div className="p-2 text-xs text-muted-foreground truncate">{section.title || "Video title"}</div>
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
          <div className="bg-card border border-border rounded p-3 space-y-2">
            <div className="h-8 bg-muted rounded" />
            <div className="h-8 bg-muted rounded" />
            <div className="h-20 bg-muted rounded" />
            <div className="h-8 bg-primary rounded w-24" />
          </div>
        )

      case "cta":
        const ctaContentStr = typeof section.content === 'string' ? section.content : ''
        return (
          <div className="bg-primary text-primary-foreground p-4 rounded text-center">
            <div className="font-bold mb-1">{section.title || "Call to Action"}</div>
            <div className="text-sm opacity-90">{ctaContentStr.slice(0, 40) || "Description text..."}</div>
            <div className="mt-2 inline-block px-4 py-1 bg-background text-foreground rounded text-sm font-medium">
              Get Started
            </div>
          </div>
        )

      case "stats":
        return (
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map((i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-bold text-primary">{i}00+</div>
                <div className="text-xs text-muted-foreground">Stat</div>
              </div>
            ))}
          </div>
        )

      case "features":
        return (
          <div className="grid grid-cols-2 gap-2">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-start gap-2 bg-card border border-border rounded p-2">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary text-xs">✓</div>
                <div className="text-xs text-card-foreground">Feature {i}</div>
              </div>
            ))}
          </div>
        )

      case "faq":
        return (
          <div className="space-y-1">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-card border border-border rounded p-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-card-foreground">Question {i}?</span>
                  <span className="text-muted-foreground">▼</span>
                </div>
              </div>
            ))}
          </div>
        )

      case "before-after":
        return (
          <div className="relative h-24 bg-muted rounded overflow-hidden border border-border">
            <div className="absolute inset-0 flex">
              <div className="w-1/2 bg-muted/70 flex items-center justify-center text-xs text-muted-foreground">Before</div>
              <div className="w-1/2 bg-primary/10 flex items-center justify-center text-xs text-primary">After</div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-card rounded-full flex items-center justify-center shadow text-xs text-foreground border border-border">↔</div>
          </div>
        )

      case "pricing":
        return (
          <div className="grid grid-cols-3 gap-1">
            {["Basic", "Pro", "Enterprise"].map((plan, i) => (
              <div key={plan} className={`rounded p-2 text-center ${i === 1 ? "bg-primary/10 border-2 border-primary" : "bg-card border border-border"}`}>
                <div className="text-xs font-medium text-card-foreground">{plan}</div>
                <div className={`text-sm font-bold ${i === 1 ? "text-primary" : "text-card-foreground"}`}>₱{i === 2 ? "Custom" : `${(i+1)*50}K`}</div>
              </div>
            ))}
          </div>
        )

      case "process":
        return (
          <div className="flex items-center justify-center gap-1">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {i}
                </div>
                {i < 4 && <div className="w-4 h-0.5 bg-primary/20" />}
              </div>
            ))}
          </div>
        )

      case "location":
        return (
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted rounded h-20 flex items-center justify-center text-muted-foreground text-2xl">🗺️</div>
            <div className="space-y-1 text-xs text-foreground">
              <div className="flex items-center gap-1"><span>📍</span> Address</div>
              <div className="flex items-center gap-1"><span>📞</span> Phone</div>
              <div className="flex items-center gap-1"><span>✉️</span> Email</div>
            </div>
          </div>
        )

      case "newsletter":
        return (
          <div className="bg-primary text-primary-foreground p-3 rounded text-center">
            <div className="text-sm font-medium mb-1">📬 Newsletter</div>
            <div className="flex gap-1">
              <div className="flex-1 h-6 bg-primary-foreground/20 rounded" />
              <div className="h-6 px-2 bg-secondary rounded text-xs flex items-center text-secondary-foreground">Subscribe</div>
            </div>
          </div>
        )

      case "awards":
        return (
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map((i) => (
              <div key={i} className="text-center">
                <div className="text-2xl mb-1 text-primary">🏆</div>
                <div className="text-xs text-muted-foreground">Award {i}</div>
              </div>
            ))}
          </div>
        )

      case "downloads":
        return (
          <div className="space-y-1">
            {[1,2].map((i) => (
              <div key={i} className="flex items-center gap-2 bg-card border border-border rounded p-2">
                <div className="w-8 h-8 bg-destructive/10 rounded flex items-center justify-center text-destructive text-xs">PDF</div>
                <div className="flex-1 text-xs truncate text-card-foreground">Document {i}.pdf</div>
                <div className="text-muted-foreground">↓</div>
              </div>
            ))}
          </div>
        )

      case "social-links":
        return (
          <div className="flex justify-center gap-2">
            {["FB", "IG", "LI", "YT"].map((social) => (
              <div key={social} className="w-8 h-8 rounded bg-muted border border-border text-foreground flex items-center justify-center text-xs font-bold">
                {social}
              </div>
            ))}
          </div>
        )

      case "partners":
        return (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Materials</div>
            <div className="flex gap-2 opacity-50">
              {[1,2].map((i) => <div key={i} className="h-6 w-16 bg-muted rounded" />)}
            </div>
          </div>
        )

      case "comparison":
        return (
          <div className="bg-card border border-border rounded overflow-hidden text-xs">
            <div className="grid grid-cols-3 border-b bg-muted/50">
              <div className="p-1 font-medium text-card-foreground">Feature</div>
              <div className="p-1 text-center text-card-foreground">Option A</div>
              <div className="p-1 text-center text-card-foreground">Option B</div>
            </div>
            {[1,2,3].map((i) => (
              <div key={i} className="grid grid-cols-3 border-b border-border">
                <div className="p-1 text-card-foreground">Feature {i}</div>
                <div className="p-1 text-center text-green-500">✓</div>
                <div className="p-1 text-center text-green-500">✓</div>
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="bg-muted rounded p-3 text-center text-muted-foreground text-sm border border-border">
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
