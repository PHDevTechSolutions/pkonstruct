import { ProjectDetailClient } from "./ProjectDetailClient"

export function generateStaticParams() {
  return [
    { id: "villa-complex" },
    { id: "tech-hub-tower" },
    { id: "manufacturing-facility" },
    { id: "riverside-apartments" },
    { id: "shopping-mall" },
    { id: "warehouse-distribution" },
  ]
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProjectDetailClient id={id} />
}
