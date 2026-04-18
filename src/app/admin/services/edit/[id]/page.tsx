import EditServiceClient from "./EditServiceClient"

// Static IDs for pre-rendering at build time
export function generateStaticParams() {
  return [
    { id: "service-1" },
    { id: "service-2" },
    { id: "service-3" },
    { id: "service-4" },
    { id: "service-5" },
    { id: "service-6" },
  ]
}

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditServiceClient id={id} />
}
