"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { PageSection } from "./types"

interface FAQWidgetProps {
  section: PageSection
}

export function FAQWidget({ section }: FAQWidgetProps) {
  let faqs = []
  try {
    const contentToParse = typeof section.content === 'string' ? section.content : JSON.stringify(section.content)
    faqs = JSON.parse(contentToParse || "[]")
  } catch {
    faqs = [
      { question: "What services do you offer?", answer: "We offer comprehensive construction services including residential, commercial, and industrial projects." },
      { question: "How long does a typical project take?", answer: "Project timelines vary based on scope and complexity. We provide detailed timelines during the consultation phase." },
      { question: "Do you provide free estimates?", answer: "Yes, we provide free initial consultations and estimates for all projects." },
    ]
  }

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 bg-stone-50">
      <div className="container mx-auto px-4">
        {section.title && <h2 className="text-3xl font-bold mb-12 text-center">{section.title}</h2>}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-sm">
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-stone-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
