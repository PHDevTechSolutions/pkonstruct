"use client"

import { useState, useEffect, useCallback } from "react"
import { db } from "@/lib/firebase"
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  updateDoc,
  doc,
  Timestamp,
  serverTimestamp,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  setDoc
} from "firebase/firestore"
import { ChatSession, ChatMessage, ChatbotConfig, QAPair, toDate } from "./use-chatbot"

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null)
  const [config, setConfig] = useState<ChatbotConfig | null>(null)
  const [qaPairs, setQAPairs] = useState<QAPair[]>([])
  const [loading, setLoading] = useState(true)

  // Subscribe to all active sessions
  useEffect(() => {
    const q = query(
      collection(db, "chatSessions"),
      orderBy("updatedAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatSession[]
      setSessions(data)
      setLoading(false)
    }, (err) => {
      console.error("Error loading sessions:", err)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Sync activeSession when sessions update (real-time status changes)
  useEffect(() => {
    if (activeSession) {
      const updated = sessions.find(s => s.id === activeSession.id)
      if (updated) {
        setActiveSession(updated)
      }
    }
  }, [sessions, activeSession])

  // Load config
  useEffect(() => {
    const loadConfig = async () => {
      const docRef = doc(db, "chatbotConfig", "settings")
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setConfig(doc.data() as ChatbotConfig)
        } else {
          // Default config
          setConfig({
            enabled: true,
            welcomeMessage: 'Hello! How can I help you today?',
            systemPrompt: 'You are a helpful assistant for a construction company website. Answer questions about services, projects, and company information professionally.',
            avatar: '',
            position: 'bottom-right',
            primaryColor: '#06b6d4',
            workingHours: {
              enabled: false,
              start: '09:00',
              end: '18:00',
              timezone: 'Asia/Manila',
              offlineMessage: 'Our team is currently offline. We\'ll get back to you during business hours.'
            },
            showOnPages: 'all'
          })
        }
      })

      return () => unsubscribe()
    }

    loadConfig()
  }, [])

  // Load Q&A pairs
  const loadQAPairs = useCallback(async () => {
    try {
      const q = query(collection(db, "chatbotQA"), orderBy("order", "asc"))
      const snapshot = await getDocs(q)
      const pairs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as QAPair[]
      setQAPairs(pairs)
      return pairs
    } catch (err) {
      console.error("Error loading Q&A:", err)
      return []
    }
  }, [])

  useEffect(() => {
    loadQAPairs()
  }, [loadQAPairs])

  // Update config (creates if doesn't exist)
  const updateConfig = async (newConfig: Partial<ChatbotConfig>) => {
    try {
      await setDoc(doc(db, "chatbotConfig", "settings"), {
        ...newConfig,
        updatedAt: serverTimestamp()
      }, { merge: true })
    } catch (err) {
      console.error("Error updating config:", err)
      throw err
    }
  }

  // Create default config if not exists
  const initConfig = async () => {
    try {
      const configRef = doc(db, "chatbotConfig", "settings")
      await setDoc(configRef, {
        enabled: true,
        welcomeMessage: 'Hello! How can I help you today?',
        systemPrompt: 'You are a helpful assistant for a construction company website.',
        position: 'bottom-right',
        primaryColor: '#06b6d4',
        workingHours: {
          enabled: false,
          start: '09:00',
          end: '18:00',
          timezone: 'Asia/Manila',
          offlineMessage: 'Our team is currently offline.'
        },
        showOnPages: 'all',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      // Config might already exist
      console.log("Config init:", err)
    }
  }

  // Take over session (human)
  const takeOverSession = async (sessionId: string) => {
    try {
      await updateDoc(doc(db, "chatSessions", sessionId), {
        status: 'human_takeover',
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      console.error("Error taking over session:", err)
      throw err
    }
  }

  // Return to bot
  const returnToBot = async (sessionId: string) => {
    try {
      await updateDoc(doc(db, "chatSessions", sessionId), {
        status: 'active',
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      console.error("Error returning to bot:", err)
      throw err
    }
  }

  // Send message as admin
  const sendAdminMessage = async (sessionId: string, content: string) => {
    try {
      const sessionRef = doc(db, "chatSessions", sessionId)
      const session = sessions.find(s => s.id === sessionId)
      
      if (!session) return

      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        type: 'bot',
        content,
        timestamp: Timestamp.now(),
        metadata: { source: 'human' }
      }

      const updatedMessages = [...session.messages, newMessage]

      await updateDoc(sessionRef, {
        messages: updatedMessages,
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      console.error("Error sending admin message:", err)
      throw err
    }
  }

  // Mark session as read by admin
  const markSessionAsRead = async (sessionId: string) => {
    try {
      await updateDoc(doc(db, "chatSessions", sessionId), {
        lastReadByAdmin: serverTimestamp()
      })
    } catch (err) {
      console.error("Error marking session as read:", err)
    }
  }

  // Add Q&A pair
  const addQAPair = async (qa: Omit<QAPair, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, "chatbotQA"), {
        ...qa,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      await loadQAPairs()
      return docRef.id
    } catch (err) {
      console.error("Error adding Q&A:", err)
      throw err
    }
  }

  // Update Q&A pair
  const updateQAPair = async (id: string, qa: Partial<QAPair>) => {
    try {
      await updateDoc(doc(db, "chatbotQA", id), {
        ...qa,
        updatedAt: serverTimestamp()
      })
      await loadQAPairs()
    } catch (err) {
      console.error("Error updating Q&A:", err)
      throw err
    }
  }

  // Delete Q&A pair
  const deleteQAPair = async (id: string) => {
    try {
      await deleteDoc(doc(db, "chatbotQA", id))
      await loadQAPairs()
    } catch (err) {
      console.error("Error deleting Q&A:", err)
      throw err
    }
  }

  // Delete session
  const deleteSession = async (id: string) => {
    try {
      await deleteDoc(doc(db, "chatSessions", id))
    } catch (err) {
      console.error("Error deleting session:", err)
      throw err
    }
  }

  // Stats
  const stats = {
    total: sessions.length,
    active: sessions.filter(s => s.status === 'active').length,
    humanTakeover: sessions.filter(s => s.status === 'human_takeover').length,
    closed: sessions.filter(s => s.status === 'closed').length,
    today: sessions.filter(s => {
      const today = new Date()
      const sessionDate = s.createdAt.toDate()
      return sessionDate.toDateString() === today.toDateString()
    }).length
  }

  // Calculate unread count for each session
  const getUnreadCount = (session: ChatSession): number => {
    if (!session.lastReadByAdmin) return session.messages.filter(m => m.type === 'user').length
    return session.messages.filter(
      m => m.type === 'user' && toDate(m.timestamp).getTime() > toDate(session.lastReadByAdmin!).getTime()
    ).length
  }

  return {
    sessions,
    activeSession,
    setActiveSession,
    config,
    qaPairs,
    loading,
    stats,
    updateConfig,
    initConfig,
    takeOverSession,
    returnToBot,
    sendAdminMessage,
    markSessionAsRead,
    getUnreadCount,
    addQAPair,
    updateQAPair,
    deleteQAPair,
    deleteSession,
    refreshQAPairs: loadQAPairs
  }
}
