"use client"

import { useState, useCallback, useEffect } from "react"
import { db } from "@/lib/firebase"
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  serverTimestamp,
  getDocs,
  where,
  limit
} from "firebase/firestore"

export interface ChatMessage {
  id: string
  type: 'user' | 'bot' | 'ai'
  content: string
  timestamp: Timestamp
  metadata?: { 
    source: 'qa' | 'ai' | 'fallback' | 'human'
    matchedQuestion?: string
  }
}

export interface ChatSession {
  id: string
  sessionId: string
  userId?: string
  messages: ChatMessage[]
  pageUrl: string
  status: 'active' | 'closed' | 'human_takeover'
  createdAt: Timestamp
  updatedAt: Timestamp
  lastReadByClient?: Timestamp
  lastReadByAdmin?: Timestamp
}

export interface ChatbotConfig {
  enabled: boolean
  welcomeMessage: string
  systemPrompt: string
  avatar: string
  position: 'bottom-right' | 'bottom-left'
  primaryColor: string
  workingHours: {
    enabled: boolean
    start: string
    end: string
    timezone: string
    offlineMessage: string
  }
  showOnPages: 'all' | 'specific'
  allowedPages?: string[]
}

export interface QAPair {
  id: string
  question: string
  answer: string
  keywords: string[]
  enabled: boolean
  order: number
}

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Helper to safely convert timestamp to Date (handles both Firestore Timestamp and plain objects)
export const toDate = (timestamp: any): Date => {
  if (!timestamp) return new Date()
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate()
  }
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000)
  }
  return new Date(timestamp)
}

export function useChatbot(pageUrl: string = '') {
  const [session, setSession] = useState<ChatSession | null>(null)
  const [config, setConfig] = useState<ChatbotConfig | null>(null)
  const [qaPairs, setQAPairs] = useState<QAPair[]>([])
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

  // Create new session in Firestore
  const createNewSession = useCallback(async () => {
    const newSessionId = generateSessionId()
    const newSession: Omit<ChatSession, 'id'> = {
      sessionId: newSessionId,
      pageUrl,
      messages: [{
        id: `msg_${Date.now()}`,
        type: 'bot',
        content: config?.welcomeMessage || 'Hello! How can I help you today?',
        timestamp: Timestamp.now(),
        metadata: { source: 'fallback' }
      }],
      status: 'active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    try {
      const docRef = await addDoc(collection(db, "chatSessions"), {
        ...newSession,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      const sessionWithId = { ...newSession, id: docRef.id } as ChatSession
      setSession(sessionWithId)
      localStorage.setItem('chatbot_session_id', newSessionId)
      localStorage.setItem('chatbot_session_data', JSON.stringify(sessionWithId))
    } catch (err) {
      console.error("Error creating session:", err)
    }
  }, [pageUrl, config?.welcomeMessage])

  // Load or create session
  useEffect(() => {
    const initSession = async () => {
      const storedSessionId = localStorage.getItem('chatbot_session_id')
      const storedSessionData = localStorage.getItem('chatbot_session_data')
      
      if (storedSessionId && storedSessionData) {
        const parsed = JSON.parse(storedSessionData)
        // Verify the session has a Firestore ID
        if (parsed.id) {
          setSession(parsed)
        } else {
          // Create new session if no ID
          localStorage.removeItem('chatbot_session_id')
          localStorage.removeItem('chatbot_session_data')
          await createNewSession()
        }
      } else {
        await createNewSession()
      }
      setLoading(false)
    }

    initSession()
  }, [createNewSession])

  // Listen to session changes (for real-time updates from admin)
  useEffect(() => {
    if (!session?.id) return

    const unsubscribe = onSnapshot(
      doc(db, "chatSessions", session.id),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as ChatSession
          // Only update if messages changed (admin sent a message)
          if (data.messages && data.messages.length !== session.messages.length) {
            setSession({ ...data, id: doc.id })
            localStorage.setItem('chatbot_session_data', JSON.stringify({ ...data, id: doc.id }))
          }
        }
      },
      (err) => console.error("Error listening to session:", err)
    )

    return () => unsubscribe()
  }, [session?.id, session?.messages.length])

  // Listen to config changes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "chatbotConfig", "settings"),
      (doc) => {
        if (doc.exists()) {
          setConfig(doc.data() as ChatbotConfig)
        }
      },
      (err) => console.error("Error loading config:", err)
    )

    return () => unsubscribe()
  }, [])

  // Load Q&A pairs
  useEffect(() => {
    const loadQAPairs = async () => {
      try {
        // Simple query without orderBy to avoid index requirement
        const q = query(
          collection(db, "chatbotQA"),
          where("enabled", "==", true)
        )
        const snapshot = await getDocs(q)
        const pairs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as QAPair[]
        // Sort in memory instead
        pairs.sort((a, b) => (a.order || 0) - (b.order || 0))
        setQAPairs(pairs)
      } catch (err) {
        console.error("Error loading Q&A:", err)
      }
    }

    loadQAPairs()
  }, [])

  // Find matching Q&A
  const findQAMatch = useCallback((input: string): QAPair | null => {
    const lowerInput = input.toLowerCase()
    
    for (const qa of qaPairs) {
      // Check keywords
      if (qa.keywords.some(keyword => lowerInput.includes(keyword.toLowerCase()))) {
        return qa
      }
      // Check question similarity (simple contains)
      if (lowerInput.includes(qa.question.toLowerCase().substring(0, 10))) {
        return qa
      }
    }
    return null
  }, [qaPairs])

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!session) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content,
      timestamp: Timestamp.now()
    }

    const updatedMessages = [...session.messages, userMessage]
    const updatedSession = { ...session, messages: updatedMessages }
    
    setSession(updatedSession)
    localStorage.setItem('chatbot_session_data', JSON.stringify(updatedSession))

    // Update Firestore
    try {
      await updateDoc(doc(db, "chatSessions", session.id), {
        messages: updatedMessages,
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      console.error("Error updating session:", err)
    }

    // Check if human has taken over
    if (session.status === 'human_takeover') {
      return // Don't respond, human will reply
    }

    setIsTyping(true)

    // Try Q&A match first
    const qaMatch = findQAMatch(content)
    
    if (qaMatch) {
      // Use predefined answer
      setTimeout(async () => {
        const botMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          type: 'bot',
          content: qaMatch.answer,
          timestamp: Timestamp.now(),
          metadata: { source: 'qa', matchedQuestion: qaMatch.question }
        }

        const finalMessages = [...updatedMessages, botMessage]
        setSession(prev => prev ? { ...prev, messages: finalMessages } : null)
        localStorage.setItem('chatbot_session_data', JSON.stringify({ ...updatedSession, messages: finalMessages }))

        await updateDoc(doc(db, "chatSessions", session.id), {
          messages: finalMessages,
          updatedAt: serverTimestamp()
        })
        
        setIsTyping(false)
      }, 1000)
    } else {
      // Use AI
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            history: updatedMessages.slice(-10), // Last 10 messages for context
            systemPrompt: config?.systemPrompt
          })
        })

        if (!response.ok) throw new Error('AI response failed')

        const data = await response.json()
        
        const aiMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          type: 'ai',
          content: data.response || "I'm sorry, I couldn't process that. Please try again.",
          timestamp: Timestamp.now(),
          metadata: { source: data.source || 'ai' }
        }

        const finalMessages = [...updatedMessages, aiMessage]
        setSession(prev => prev ? { ...prev, messages: finalMessages } : null)
        localStorage.setItem('chatbot_session_data', JSON.stringify({ ...updatedSession, messages: finalMessages }))

        await updateDoc(doc(db, "chatSessions", session.id), {
          messages: finalMessages,
          updatedAt: serverTimestamp()
        })
      } catch (err) {
        console.error("AI error:", err)
        
        // Fallback message
        const fallbackMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          type: 'bot',
          content: "I'm having trouble connecting. Please try again later or contact us directly.",
          timestamp: Timestamp.now(),
          metadata: { source: 'fallback' }
        }

        const finalMessages = [...updatedMessages, fallbackMessage]
        setSession(prev => prev ? { ...prev, messages: finalMessages } : null)
        localStorage.setItem('chatbot_session_data', JSON.stringify({ ...updatedSession, messages: finalMessages }))

        await updateDoc(doc(db, "chatSessions", session.id), {
          messages: finalMessages,
          updatedAt: serverTimestamp()
        })
      } finally {
        setIsTyping(false)
      }
    }
  }, [session, config, findQAMatch])

  // Clear session
  const clearSession = useCallback(async () => {
    if (session) {
      try {
        await updateDoc(doc(db, "chatSessions", session.id), {
          status: 'closed',
          updatedAt: serverTimestamp()
        })
      } catch (err) {
        console.error("Error closing session:", err)
      }
    }
    localStorage.removeItem('chatbot_session_id')
    localStorage.removeItem('chatbot_session_data')
    setSession(null)
  }, [session])

  // Check if chatbot should be visible on current page
  const shouldShow = useCallback(() => {
    // Default to showing if no config exists (enabled by default)
    if (!config) return true
    if (config.enabled === false) return false
    if (config.showOnPages === 'all') return true
    if (config.showOnPages === 'specific' && config.allowedPages) {
      return config.allowedPages.some(page => pageUrl.includes(page))
    }
    return true
  }, [config, pageUrl])

  return {
    session,
    config,
    qaPairs,
    loading,
    isTyping,
    sendMessage,
    clearSession,
    shouldShow,
    isEnabled: config?.enabled ?? true // Default to enabled
  }
}
