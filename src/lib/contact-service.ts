import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  projectType?: string
  message: string
}

export async function submitContactForm(data: ContactFormData) {
  try {
    const docRef = await addDoc(collection(db, "contactSubmissions"), {
      ...data,
      status: "new",
      createdAt: serverTimestamp()
    })
    
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    throw new Error("Failed to submit contact form")
  }
}

export interface QuoteRequestData {
  name: string
  email: string
  phone: string
  projectType: string
  budget: string
  timeline: string
  details: string
}

export async function submitQuoteRequest(data: QuoteRequestData) {
  try {
    const docRef = await addDoc(collection(db, "quoteRequests"), {
      ...data,
      status: "pending",
      createdAt: serverTimestamp()
    })
    
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error submitting quote request:", error)
    throw new Error("Failed to submit quote request")
  }
}
