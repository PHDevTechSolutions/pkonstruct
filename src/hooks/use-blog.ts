"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, doc, getDoc, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

export type BlogPostStatus = "draft" | "published" | "scheduled"

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  readTime: string
  image?: string
  tags?: string[]
  published: boolean // legacy field, kept for backward compatibility
  status?: BlogPostStatus // new field: draft | published | scheduled
  scheduledAt?: string // ISO date string for scheduled posts
  // Gallery
  gallery?: string[]
  // SEO Fields
  metaTitle?: string
  metaDescription?: string
  slug?: string
}

export function useBlogPosts(category?: string) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        // Get all posts and filter client-side for scheduled posts
        let q = query(
          collection(db, "blogPosts"),
          orderBy("date", "desc")
        )
        
        if (category && category !== "All") {
          q = query(q, where("category", "==", category))
        }

        const snapshot = await getDocs(q)
        const now = new Date().toISOString()
        
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as BlogPost[]
        
        // Filter posts: show published OR scheduled posts where scheduledAt <= now
        const visiblePosts = postsData.filter(post => {
          const status = post.status || (post.published ? "published" : "draft")
          
          // Published posts always show
          if (status === "published") return true
          
          // Scheduled posts only show if scheduledAt <= current time
          if (status === "scheduled" && post.scheduledAt) {
            return post.scheduledAt <= now
          }
          
          return false
        })
        
        setPosts(visiblePosts)
      } catch (err) {
        setError("Failed to fetch blog posts")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [category])

  return { posts, loading, error }
}

export function useBlogPost(idOrSlug: string) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      if (!idOrSlug) return
      
      try {
        setLoading(true)
        
        // First try to find by document ID
        const docRef = doc(db, "blogPosts", idOrSlug)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost)
          setLoading(false)
          return
        }
        
        // If not found, try to find by slug
        const q = query(collection(db, "blogPosts"), where("slug", "==", idOrSlug))
        const snapshot = await getDocs(q)
        
        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          setPost({ id: doc.id, ...doc.data() } as BlogPost)
        } else {
          setError("Post not found")
        }
      } catch (err) {
        setError("Failed to fetch blog post")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [idOrSlug])

  return { post, loading, error }
}
