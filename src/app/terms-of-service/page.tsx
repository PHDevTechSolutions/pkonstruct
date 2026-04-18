import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | PKonstruct",
  description: "Terms of service for PKonstruct construction services.",
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-stone-500">Last updated: April 2026</p>
        </div>

        <div className="prose prose-stone max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-stone-600 mb-4">
              By accessing or using PKonstruct&apos;s website and services, you agree to be bound by 
              these Terms of Service. If you do not agree to these terms, please do not use our 
              website or services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">2. Description of Services</h2>
            <p className="text-stone-600 mb-4">
              PKonstruct provides construction services including but not limited to residential 
              construction, commercial building, industrial projects, renovations, and project 
              management. All services are subject to separate written contracts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">3. Use of Website</h2>
            <p className="text-stone-600 mb-4">
              You agree to use our website only for lawful purposes and in a way that does not 
              infringe the rights of others or restrict their use and enjoyment of the website. 
              Prohibited activities include:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>Using the website in any way that causes damage or impairment</li>
              <li>Attempting to gain unauthorized access to any part of the website</li>
              <li>Using the website to transmit harmful code or materials</li>
              <li>Engaging in any data mining or harvesting activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">4. Intellectual Property</h2>
            <p className="text-stone-600 mb-4">
              All content on this website, including text, graphics, logos, images, and software, 
              is the property of PKonstruct and is protected by copyright and other intellectual 
              property laws. You may not reproduce, distribute, or create derivative works without 
              our express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">5. Project Contracts</h2>
            <p className="text-stone-600 mb-4">
              Any construction services will be governed by separate written contracts. These Terms 
              of Service do not create any contractor-client relationship. All project-specific terms, 
              including payment schedules, timelines, and warranties, will be detailed in individual 
              project contracts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-stone-600 mb-4">
              To the maximum extent permitted by law, PKonstruct shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising out of or relating 
              to your use of the website or services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">7. Warranty Disclaimer</h2>
            <p className="text-stone-600 mb-4">
              The website and its content are provided &ldquo;as is&rdquo; without warranties of any kind, 
              either express or implied. PKonstruct does not warrant that the website will be 
              uninterrupted or error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">8. Governing Law</h2>
            <p className="text-stone-600 mb-4">
              These Terms of Service shall be governed by and construed in accordance with the laws 
              of the State of California, without regard to its conflict of law provisions. Any 
              disputes shall be resolved in the courts of California.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">9. Changes to Terms</h2>
            <p className="text-stone-600 mb-4">
              We reserve the right to modify these Terms of Service at any time. Changes will be 
              effective immediately upon posting to the website. Your continued use of the website 
              after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">10. Contact Information</h2>
            <p className="text-stone-600 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <p className="text-stone-600">
              Email: legal@pkonstruct.com<br />
              Phone: +1 (555) 123-4567<br />
              Address: 123 Construction Ave, Building City, BC 12345
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
