import EditBlogPostClient from "./EditBlogPostClient"

export function generateStaticParams() {
  return [
    { id: "trends-2024" },
    { id: "choose-contractor" },
    { id: "commercial-residential" },
    { id: "tech-hub-spotlight" },
    { id: "safety-standards" },
    { id: "smart-buildings" },
  ]
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditBlogPostClient id={id} />
}
