"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useFAQ } from "@/hooks/use-faq"

export default function FAQPage() {
  const { faqs, loading, error } = useFAQ()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = [...new Set(faqs.map((faq) => faq.category))]

  if (loading) {
    return (
      <main className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-full mx-auto mb-12" />
          <Skeleton className="h-12 w-full mb-8" />
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full mb-4" />
          ))}
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">Failed to load FAQs. Please try again later.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto">
            Find answers to common questions about our construction services, process, and more.
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {searchQuery ? (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Search Results ({filteredFAQs.length})
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border rounded-lg px-4 bg-white"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {filteredFAQs.length === 0 && (
              <p className="text-stone-500 text-center py-8">
                No questions found matching your search.
              </p>
            )}
          </div>
        ) : (
          categories.map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold text-stone-900 mb-4 capitalize">
                {category}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs
                  .filter((faq) => faq.category === category)
                  .map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border rounded-lg px-4 bg-white"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-stone-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          ))
        )}

        <div className="mt-12 p-6 bg-amber-50 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-stone-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-stone-600 mb-4">
            Contact us directly and we&apos;ll be happy to help.
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  )
}
