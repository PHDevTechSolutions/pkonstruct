/**
 * Convert a string to a URL-friendly slug
 * Example: "Modern Villa Complex" -> "modern-villa-complex"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")           // Replace spaces with -
    .replace(/&/g, "-and-")         // Replace & with 'and'
    .replace(/[^\w\-]+/g, "")       // Remove all non-word characters
    .replace(/\-\-+/g, "-")          // Replace multiple - with single -
    .replace(/^-+/, "")              // Trim - from start
    .replace(/-+$/, "")              // Trim - from end
}

/**
 * Create a unique slug with optional prefix (for dates, etc.)
 * Example: "2024 Construction Trends" -> "2024-construction-trends"
 */
export function createSlug(title: string, prefix?: string): string {
  const baseSlug = slugify(title)
  return prefix ? `${prefix}-${baseSlug}` : baseSlug
}
