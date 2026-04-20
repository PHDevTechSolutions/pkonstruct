// Widget Exports - Centralized widget registry
export { HeroWidget } from "./hero-widget"
export { TextWidget } from "./text-widget"
export { ImageWidget } from "./image-widget"
export { GalleryWidget } from "./gallery-widget"
export { VideoWidget } from "./video-widget"
export { ProjectsWidget } from "./projects-widget"
export { ServicesWidget } from "./services-widget"
export { TestimonialsWidget } from "./testimonials-widget"
export { TeamWidget } from "./team-widget"
export { BlogWidget } from "./blog-widget"
export { ClientsWidget } from "./clients-widget"
export { ContactWidget } from "./contact-widget"
export { CTAWidget } from "./cta-widget"
export { StatsWidget } from "./stats-widget"
export { FeaturesWidget } from "./features-widget"
export { FAQWidget } from "./faq-widget"
export { AwardsWidget } from "./awards-widget"
export { BeforeAfterWidget } from "./before-after-widget"
export { PricingWidget } from "./pricing-widget"
export { ProcessWidget } from "./process-widget"
export { LocationWidget } from "./location-widget"
export { NewsletterWidget } from "./newsletter-widget"
export { DownloadsWidget } from "./downloads-widget"
export { SocialLinksWidget } from "./social-links-widget"
export { PartnersWidget } from "./partners-widget"
export { ComparisonWidget } from "./comparison-widget"

// Widget metadata for admin gallery
export interface WidgetMeta {
  type: string
  label: string
  icon: string
  category: "content" | "dynamic" | "interactive"
  description?: string
}

export const widgetRegistry: WidgetMeta[] = [
  // Content Widgets
  { type: "hero", label: "Hero Banner", icon: "🖼️", category: "content" },
  { type: "text", label: "Text Content", icon: "📝", category: "content" },
  { type: "image", label: "Single Image", icon: "🖼️", category: "content" },
  { type: "gallery", label: "Image Gallery", icon: "🖼️", category: "content" },
  { type: "video", label: "Video Embed", icon: "🎬", category: "content" },
  
  // Dynamic Data Widgets
  { type: "projects", label: "Projects Grid", icon: "🏗️", category: "dynamic", description: "Auto-fetches from Projects collection" },
  { type: "services", label: "Services Grid", icon: "🛠️", category: "dynamic", description: "Auto-fetches from Services collection" },
  { type: "testimonials", label: "Testimonials Slider", icon: "💬", category: "dynamic", description: "Auto-fetches from Testimonials collection" },
  { type: "team", label: "Team Members", icon: "👥", category: "dynamic", description: "Auto-fetches from Team collection" },
  { type: "blog", label: "Blog Posts Grid", icon: "📰", category: "dynamic", description: "Auto-fetches latest blog posts" },
  { type: "clients", label: "Client Logos", icon: "🏢", category: "dynamic", description: "Auto-fetches from Clients collection" },
  
  // Interactive Widgets
  { type: "contact", label: "Contact Form", icon: "📧", category: "interactive" },
  { type: "cta", label: "Call to Action", icon: "🎯", category: "interactive" },
  { type: "stats", label: "Statistics Counters", icon: "📊", category: "interactive" },
  { type: "features", label: "Features Grid", icon: "⚡", category: "interactive" },
  { type: "faq", label: "FAQ Accordion", icon: "❓", category: "interactive" },
  { type: "awards", label: "Awards & Recognition", icon: "🏆", category: "interactive" },
  { type: "before-after", label: "Before & After", icon: "🔄", category: "interactive" },
  { type: "pricing", label: "Pricing Table", icon: "💰", category: "interactive" },
  { type: "process", label: "Process Steps", icon: "📋", category: "interactive" },
  { type: "location", label: "Location/Map", icon: "📍", category: "interactive" },
  { type: "newsletter", label: "Newsletter Signup", icon: "📬", category: "interactive" },
  { type: "downloads", label: "Downloads", icon: "📥", category: "interactive" },
  { type: "social-links", label: "Social Links", icon: "🔗", category: "interactive" },
  { type: "partners", label: "Partners", icon: "🤝", category: "interactive" },
  { type: "comparison", label: "Comparison Table", icon: "⚖️", category: "interactive" },
]
