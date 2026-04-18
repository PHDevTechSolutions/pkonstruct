"use client"

import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { PageSection } from "./types"

interface PricingWidgetProps {
  section: PageSection
}

interface PricingPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  notIncluded?: string[]
  isPopular?: boolean
  buttonText: string
}

export function PricingWidget({ section }: PricingWidgetProps) {
  let plans: PricingPlan[] = []
  try {
    // Parse content - handle both string and object
    let parsedContent: any
    if (typeof section.content === 'string') {
      parsedContent = JSON.parse(section.content || "[]")
    } else {
      parsedContent = section.content
    }
    
    // Content might be { plans: [...] } or just [...]
    plans = parsedContent?.plans || parsedContent || []
    
    // Ensure it's an array
    if (!Array.isArray(plans)) {
      plans = []
    }
  } catch {
    plans = [
      {
        id: "basic",
        name: "Basic",
        price: "₱50,000",
        period: "starting",
        description: "Perfect for small renovation projects",
        features: [
          "Site assessment",
          "Basic materials",
          "Standard timeline",
          "1-year warranty",
          "Email support"
        ],
        buttonText: "Get Started"
      },
      {
        id: "professional",
        name: "Professional",
        price: "₱150,000",
        period: "starting",
        description: "Ideal for medium-scale construction",
        features: [
          "Everything in Basic",
          "Premium materials",
          "Priority scheduling",
          "3-year warranty",
          "24/7 phone support",
          "Project manager"
        ],
        isPopular: true,
        buttonText: "Most Popular"
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "Large commercial and industrial projects",
        features: [
          "Everything in Professional",
          "Custom solutions",
          "Dedicated team",
          "5-year warranty",
          "VIP support",
          "Maintenance plans"
        ],
        buttonText: "Contact Us"
      }
    ]
  }

  // Handle content as string or object
  const contentText = typeof section.content === 'string' 
    ? section.content 
    : section.content?.text || ''

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-4 text-center">{section.title}</h2>}
        {contentText && <p className="text-stone-600 text-center max-w-2xl mx-auto mb-12">{contentText}</p>}
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.isPopular ? "border-amber-500 border-2 shadow-lg" : ""}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <h3 className="text-xl font-semibold text-stone-900">{plan.name}</h3>
                <p className="text-stone-600 text-sm mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-stone-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-stone-500 ml-1">/{plan.period}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-stone-700">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded?.map((feature, idx) => (
                    <li key={`not-${idx}`} className="flex items-start gap-2 opacity-50">
                      <X className="h-5 w-5 text-stone-400 shrink-0 mt-0.5" />
                      <span className="text-stone-500 line-through">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full mt-6 ${
                    plan.isPopular 
                      ? "bg-amber-600 hover:bg-amber-700 text-white" 
                      : "bg-stone-100 hover:bg-stone-200 text-stone-900"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
