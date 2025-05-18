'use client'

import ContactForm from '@/components/landing/contact-form'
import ContactInfo from '@/components/landing/contact-info'
import dynamic from 'next/dynamic'
import Footer from '@/components/landing/footer'
import Header from '@/components/landing/header'

// Import LiveMap with no SSR to avoid hydration issues
const LiveMap = dynamic(() => import('@/components/landing/live-map'), {
  ssr: false,
  loading: () => (
    <div
      className="bg-gray-100 flex items-center justify-center rounded-lg"
      style={{ height: '300px' }}
    >
      <div className="animate-pulse">Loading map...</div>
    </div>
  ),
})

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Get in Touch with Us</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We&apos;re here to help you find your perfect home. Reach out to
              us with any questions...
            </p>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <ContactForm />
              </div>
              <div>
                <ContactInfo />
                <div className="mt-8 rounded-lg overflow-hidden shadow-sm">
                  <LiveMap
                    address="15 Cedar Avenue, Ikoyi, Lagos, Nigeria"
                    height={300}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
