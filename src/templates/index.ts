export const AVAILABLE_TEMPLATES = [
  {
    id: "construction",
    name: "Construction & Building",
    description: "Professional template for construction companies with sections for projects, services, and team",
    folder: "construction",
  },
  {
    id: "cleaning-services",
    name: "Cleaning Services",
    description: "Template for cleaning and maintenance companies with eco-friendly focus",
    folder: "cleaning-services",
  },
  {
    id: "it-consultant",
    name: "IT Consultant & Technology",
    description: "Premium template for IT consulting firms with dark theme, digital transformation focus, and enterprise solutions",
    folder: "it-consultant",
  },
] as const

export type TemplateId = typeof AVAILABLE_TEMPLATES[number]["id"]

export interface Template {
  id: string
  name: string
  description: string
  thumbnail?: string
  pages: Record<string, TemplatePage>
  navigation: TemplateNavigation
  styles: TemplateStyles
}

export interface TemplatePage {
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  sections: PageSection[]
  showInHeader: boolean
  showInFooter: boolean
  isPublished: boolean
}

export interface PageSection {
  id: string
  type: string
  title: string
  isActive: boolean
  order: number
  content: Record<string, any>
}

export interface TemplateNavigation {
  siteName: string
  headerLogo?: string
  headerBgColor: string
  headerTextColor: string
  footerDescription: string
  footerCopyright: string
  footerBgColor: string
  footerTextColor: string
  socialLinks: SocialLink[]
  footerColumns: FooterColumn[]
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
  isActive: boolean
}

export interface FooterColumn {
  title: string
  links: { label: string; url: string }[]
}

export interface TemplateStyles {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
}

export async function loadTemplate(templateId: string): Promise<Template | null> {
  try {
    const templateMeta = AVAILABLE_TEMPLATES.find(t => t.id === templateId)
    if (!templateMeta) return null

    const response = await fetch(`/templates/${templateMeta.folder}/template.json`)
    if (!response.ok) throw new Error(`Failed to load template ${templateId}`)
    
    const data = await response.json()
    return {
      ...data,
      id: templateMeta.id,
      name: templateMeta.name,
      description: templateMeta.description,
    }
  } catch (error) {
    console.error(`Error loading template ${templateId}:`, error)
    return null
  }
}
