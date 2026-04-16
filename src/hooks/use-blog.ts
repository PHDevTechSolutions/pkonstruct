"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, doc, getDoc, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

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
  published: boolean
}

export function useBlogPosts(category?: string) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        let q = query(
          collection(db, "blogPosts"),
          where("published", "==", true),
          orderBy("date", "desc")
        )
        
        if (category && category !== "All") {
          q = query(q, where("category", "==", category))
        }

        const snapshot = await getDocs(q)
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as BlogPost[]
        
        setPosts(postsData)
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

export function useBlogPost(id: string) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const docRef = doc(db, "blogPosts", id)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost)
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
  }, [id])

  return { post, loading, error }
}
