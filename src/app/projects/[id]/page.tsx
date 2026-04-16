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

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return <ProjectDetailClient id={params.id} />
}
