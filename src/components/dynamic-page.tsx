"use client"

import { useProjects } from "@/hooks/use-projects"
import { useServices } from "@/hooks/use-services"
import { useTestimonials } from "@/hooks/use-testimonials"
import { useTeam } from "@/hooks/use-team"
import { useBlogPosts } from "@/hooks/use-blog"
import { useClients } from "@/hooks/use-clients"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Widget imports
import { HeroWidget } from "@/components/widgets/hero-widget"
import { TextWidget } from "@/components/widgets/text-widget"
import { ImageWidget } from "@/components/widgets/image-widget"
import { GalleryWidget } from "@/components/widgets/gallery-widget"
import { VideoWidget } from "@/components/widgets/video-widget"
import { ProjectsWidget } from "@/components/widgets/projects-widget"
import { ServicesWidget } from "@/components/widgets/services-widget"
import { TestimonialsWidget } from "@/components/widgets/testimonials-widget"
import { TeamWidget } from "@/components/widgets/team-widget"
import { BlogWidget } from "@/components/widgets/blog-widget"
import { ClientsWidget } from "@/components/widgets/clients-widget"
import { ContactWidget } from "@/components/widgets/contact-widget"
import { CTAWidget } from "@/components/widgets/cta-widget"
import { StatsWidget } from "@/components/widgets/stats-widget"
import { FeaturesWidget } from "@/components/widgets/features-widget"
import { FAQWidget } from "@/components/widgets/faq-widget"
import { BeforeAfterWidget } from "@/components/widgets/before-after-widget"
import { PricingWidget } from "@/components/widgets/pricing-widget"
import { ProcessWidget } from "@/components/widgets/process-widget"
import { LocationWidget } from "@/components/widgets/location-widget"
import { NewsletterWidget } from "@/components/widgets/newsletter-widget"
import { AwardsWidget } from "@/components/widgets/awards-widget"
import { DownloadsWidget } from "@/components/widgets/downloads-widget"
import { SocialLinksWidget } from "@/components/widgets/social-links-widget"
import { PartnersWidget } from "@/components/widgets/partners-widget"
import { ComparisonWidget } from "@/components/widgets/comparison-widget"

interface PageSection {
  id: string
  type: string
  title: string
  content: string | Record<string, any>
  image?: string
  order: number
  isActive: boolean
}

interface DynamicPageProps {
  page: {
    sections: PageSection[]
  }
}

// Widget Renderers - All imported from @/components/widgets/

// Main Dynamic Page Renderer
export function DynamicPage({ page }: DynamicPageProps) {
  if (!page?.sections) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500">Page content not available</p>
      </div>
    )
  }

  const sortedSections = page.sections
    .filter((section) => section.isActive)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen">
      {sortedSections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  )
}

function SectionRenderer({ section }: { section: PageSection }) {
  switch (section.type) {
    case "hero":
      return <HeroWidget section={section} />
    case "text":
      return <TextWidget section={section} />
    case "image":
      return <ImageWidget section={section} />
    case "gallery":
      return <GalleryWidget section={section} />
    case "video":
      return <VideoWidget section={section} />
    case "projects":
      return <ProjectsWidget section={section} />
    case "services":
      return <ServicesWidget section={section} />
    case "testimonials":
      return <TestimonialsWidget section={section} />
    case "team":
      return <TeamWidget section={section} />
    case "blog":
      return <BlogWidget section={section} />
    case "clients":
      return <ClientsWidget section={section} />
    case "contact":
      return <ContactWidget section={section} />
    case "cta":
      return <CTAWidget section={section} />
    case "stats":
      return <StatsWidget section={section} />
    case "features":
      return <FeaturesWidget section={section} />
    case "faq":
      return <FAQWidget section={section} />
    case "before-after":
      return <BeforeAfterWidget section={section} />
    case "pricing":
      return <PricingWidget section={section} />
    case "process":
      return <ProcessWidget section={section} />
    case "location":
      return <LocationWidget section={section} />
    case "newsletter":
      return <NewsletterWidget section={section} />
    case "awards":
      return <AwardsWidget section={section} />
    case "downloads":
      return <DownloadsWidget section={section} />
    case "social-links":
      return <SocialLinksWidget section={section} />
    case "partners":
      return <PartnersWidget section={section} />
    case "comparison":
      return <ComparisonWidget section={section} />
    default:
      return (
        <section className="py-16 bg-stone-100">
          <div className="container mx-auto px-4">
            <p className="text-stone-500">Unknown section type: {section.type}</p>
          </div>
        </section>
      )
  }
}
