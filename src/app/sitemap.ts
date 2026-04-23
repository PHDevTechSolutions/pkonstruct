import type { MetadataRoute } from "next"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

export const dynamic = "force-dynamic"

const BASE_URL = "https://pkonstruct.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ]

  // Fetch products
  let productPages: MetadataRoute.Sitemap = []
  try {
    const productsQuery = query(
      collection(db, "products"),
      where("status", "==", "active")
    )
    const productsSnapshot = await getDocs(productsQuery)
    productPages = productsSnapshot.docs.map((doc) => ({
      url: `${BASE_URL}/product/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error("Error fetching products for sitemap:", error)
  }

  // Fetch categories
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const categoriesSnapshot = await getDocs(collection(db, "categories"))
    categoryPages = categoriesSnapshot.docs.map((doc) => ({
      url: `${BASE_URL}/category/${doc.data().slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error)
  }

  return [...staticPages, ...productPages, ...categoryPages]
}
