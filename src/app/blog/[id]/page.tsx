import { BlogPostClient } from "./BlogPostClient"

// Static IDs for pre-rendering at build time
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

export default function BlogPostPage({ params }: { params: { id: string } }) {
  return <BlogPostClient id={params.id} />
}
