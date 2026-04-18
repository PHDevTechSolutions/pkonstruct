import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | PKonstruct",
  description: "Privacy policy for PKonstruct construction services.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-stone-500">Last updated: April 2026</p>
        </div>

        <div className="prose prose-stone max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">1. Introduction</h2>
            <p className="text-stone-600 mb-4">
              PKonstruct (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website or use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">2. Information We Collect</h2>
            <p className="text-stone-600 mb-4">
              We may collect information about you in a variety of ways including:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>
                <strong>Personal Data:</strong> Name, email address, phone number, and project details 
                you provide when contacting us or requesting quotes.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our website, including 
                IP address, browser type, and pages visited.
              </li>
              <li>
                <strong>Cookies:</strong> We use cookies to enhance your experience and analyze 
                website traffic.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-stone-600 mb-4">
              We may use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>Responding to your inquiries and providing customer support</li>
              <li>Processing quote requests and project proposals</li>
              <li>Sending promotional communications (with your consent)</li>
              <li>Improving our website and services</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">4. Sharing Your Information</h2>
            <p className="text-stone-600 mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>
                <strong>Service Providers:</strong> Third-party vendors who perform services 
                on our behalf (e.g., email delivery, analytics).
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">5. Data Security</h2>
            <p className="text-stone-600 mb-4">
              We implement appropriate technical and organizational security measures to protect 
              your personal information. However, no method of transmission over the internet is 
              100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">6. Your Rights</h2>
            <p className="text-stone-600 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, 
              including:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>Access to your personal data</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data</li>
              <li>Objection to processing</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">7. Contact Us</h2>
            <p className="text-stone-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-stone-600">
              Email: privacy@pkonstruct.com<br />
              Phone: +1 (555) 123-4567<br />
              Address: 123 Construction Ave, Building City, BC 12345
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
