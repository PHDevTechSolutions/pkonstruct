"use client"

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
  sections: PageSection[]
}

const widgetMap: Record<string, React.FC<{ section: PageSection }>> = {
  hero: HeroWidget,
  text: TextWidget,
  image: ImageWidget,
  gallery: GalleryWidget,
  video: VideoWidget,
  projects: ProjectsWidget,
  services: ServicesWidget,
  testimonials: TestimonialsWidget,
  team: TeamWidget,
  blog: BlogWidget,
  clients: ClientsWidget,
  contact: ContactWidget,
  cta: CTAWidget,
  stats: StatsWidget,
  features: FeaturesWidget,
  faq: FAQWidget,
  "before-after": BeforeAfterWidget,
  pricing: PricingWidget,
  process: ProcessWidget,
  location: LocationWidget,
  newsletter: NewsletterWidget,
  awards: AwardsWidget,
  downloads: DownloadsWidget,
  "social-links": SocialLinksWidget,
  partners: PartnersWidget,
  comparison: ComparisonWidget,
}

export function DynamicPage({ sections }: DynamicPageProps) {
  if (!sections?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500">Page content not available</p>
      </div>
    )
  }

  const sortedSections = sections
    .filter((s) => s.isActive)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen">
      {sortedSections.map((section) => {
        const Widget = widgetMap[section.type]
        if (!Widget) {
          return (
            <section key={section.id} className="py-16 bg-stone-100">
              <div className="container mx-auto px-4">
                <p className="text-stone-500">Unknown section type: {section.type}</p>
              </div>
            </section>
          )
        }
        return <Widget key={section.id} section={section} />
      })}
    </div>
  )
}
