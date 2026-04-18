import { Metadata } from "next"
import { notFound } from "next/navigation"
import ServiceDetailClient from "./ServiceDetailClient"

interface ServicePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { id } = await params
  
  const serviceTitles: Record<string, string> = {
    "residential-construction": "Residential Construction Services | PKonstruct",
    "commercial-building": "Commercial Building Services | PKonstruct",
    "industrial-projects": "Industrial Construction Services | PKonstruct",
    "renovations": "Renovation Services | PKonstruct",
    "interior-exterior-finishing": "Interior & Exterior Finishing | PKonstruct",
    "project-management": "Project Management Services | PKonstruct",
    "architectural-design": "Architectural Design Services | PKonstruct",
    "site-preparation": "Site Preparation Services | PKonstruct",
  }

  return {
    title: serviceTitles[id] || "Service Details | PKonstruct",
    description: "Professional construction services by PKonstruct.",
  }
}

export function generateStaticParams() {
  return [
    { id: "residential-construction" },
    { id: "commercial-building" },
    { id: "industrial-projects" },
    { id: "renovations" },
    { id: "interior-exterior-finishing" },
    { id: "project-management" },
    { id: "architectural-design" },
    { id: "site-preparation" },
  ]
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params
  
  const validIds = [
    "residential-construction",
    "commercial-building",
    "industrial-projects",
    "renovations",
    "interior-exterior-finishing",
    "project-management",
    "architectural-design",
    "site-preparation",
  ]
  
  if (!validIds.includes(id)) {
    notFound()
  }

  return <ServiceDetailClient serviceId={id} />
}
