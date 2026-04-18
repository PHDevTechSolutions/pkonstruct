"use client"

import type { PageSection } from "./types"

interface VideoWidgetProps {
  section: PageSection
}

export function VideoWidget({ section }: VideoWidgetProps) {
  // Extract video URL from content (supports YouTube, Vimeo, or direct video URLs)
  // Handle content as string or object
  const contentUrl = typeof section.content === 'string' ? section.content : section.content?.url || ''
  const videoUrl = contentUrl || section.image

  const getEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('v=') 
        ? url.split('v=')[1]?.split('&')[0]
        : url.split('/').pop()
      return `https://www.youtube.com/embed/${videoId}`
    }
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop()
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-8 text-center">{section.title}</h2>}
        {embedUrl ? (
          <div className="relative aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              title={section.title || "Video"}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="text-center text-stone-500">No video URL provided</div>
        )}
      </div>
    </section>
  )
}
