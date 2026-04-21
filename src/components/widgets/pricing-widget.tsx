"use client"

import { useState } from "react"
import { Check, X, Sparkles, Zap, Crown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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

const planIcons: Record<string, React.ReactNode> = {
  "basic": <Zap className="w-5 h-5" />,
  "professional": <Sparkles className="w-5 h-5" />,
  "enterprise": <Crown className="w-5 h-5" />,
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

  const contentText = typeof section.content === 'string' 
    ? section.content 
    : section.content?.text || ''

  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header - Premium Style */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
          
          {section.title && (
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              {section.title}
            </h2>
          )}
          
          {contentText && (
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
              {contentText}
            </p>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => {
            const isHovered = hoveredPlan === plan.id
            const Icon = planIcons[plan.id] || planIcons["basic"]
            
            return (
              <div
                key={plan.id}
                className={`relative group ${plan.isPopular ? 'md:-mt-4 md:mb-4' : ''}`}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Card */}
                <div className={`relative h-full rounded-2xl overflow-hidden transition-all duration-500 ${
                  plan.isPopular ? 'scale-[1.02]' : ''
                } ${isHovered ? 'scale-[1.02] -translate-y-2' : ''}`}>
                  {/* Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-muted/50" />
                  <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 transition-opacity duration-500 ${
                    isHovered || plan.isPopular ? 'opacity-100' : 'opacity-0'
                  }`} />
                  
                  {/* Border */}
                  <div className={`absolute inset-0 rounded-2xl border-2 transition-colors duration-300 ${
                    plan.isPopular 
                      ? 'border-primary/50' 
                      : isHovered 
                        ? 'border-primary/30' 
                        : 'border-border/50'
                  }`} />

                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-primary transition-all duration-500 ${
                    plan.isPopular || isHovered ? 'opacity-100' : 'opacity-0'
                  }`} />

                  <div className="relative p-8 flex flex-col h-full">
                    {/* Plan Icon & Name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        plan.isPopular || isHovered 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {Icon}
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-muted-foreground">/{plan.period}</span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            plan.isPopular || isHovered 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                      {plan.notIncluded?.map((feature, idx) => (
                        <li key={`not-${idx}`} className="flex items-start gap-3 opacity-50">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-muted">
                            <X className="w-3 h-3 text-muted-foreground" />
                          </div>
                          <span className="text-muted-foreground line-through">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button 
                      className={`w-full py-6 font-semibold transition-all duration-300 ${
                        plan.isPopular 
                          ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]' 
                          : isHovered
                            ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      {plan.buttonText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {/* Glow effect */}
                  <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-xl transition-opacity duration-500 -z-10 ${
                    isHovered || plan.isPopular ? 'opacity-100' : 'opacity-0'
                  }`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span className="text-sm">No hidden fees</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span className="text-sm">Free consultation</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span className="text-sm">Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}
