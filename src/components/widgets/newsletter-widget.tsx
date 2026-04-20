"use client"

import { useState } from "react"
import { Mail, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { PageSection } from "./types"

interface NewsletterWidgetProps {
  section: PageSection
}

export function NewsletterWidget({ section }: NewsletterWidgetProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  // Handle content as string or object
  const contentText = typeof section.content === 'string' 
    ? section.content 
    : section.content?.text || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    // Simulate API call - replace with actual newsletter signup
    setTimeout(() => {
      setStatus("success")
      setEmail("")
    }, 1500)
  }

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>
          
          {section.title && (
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              {section.title}
            </h2>
          )}
          
          {contentText && (
            <p className="text-primary-foreground/80 text-lg mb-8">
              {contentText}
            </p>
          )}

          {status === "success" ? (
            <div className="flex items-center justify-center gap-2 text-primary-foreground">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg">Thank you for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-background border-0 h-12 text-foreground"
              />
              <Button 
                type="submit" 
                disabled={status === "loading"}
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground h-12 px-8"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          )}

          <p className="text-primary-foreground/60 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
