export interface PageSection {
  id: string
  type: string
  title: string
  content: string | Record<string, any>
  image?: string
  order: number
  isActive: boolean
}
