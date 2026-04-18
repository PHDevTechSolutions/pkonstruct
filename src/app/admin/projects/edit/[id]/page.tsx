import EditProjectClient from "./EditProjectClient"

// Static IDs for pre-rendering at build time
export function generateStaticParams() {
  return [
    { id: "skyline-tower" },
    { id: "riverside-commons" },
    { id: "harbor-industrial-park" },
    { id: "oakwood-estates" },
    { id: "metro-transit-hub" },
    { id: "greenfield-renovation" },
    { id: "villa-complex" },
    { id: "project-1" },
    { id: "project-2" },
    { id: "project-3" },
    { id: "project-4" },
    { id: "project-5" },
    { id: "new" },
  ]
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditProjectClient id={id} />
}
