import Hero from '@/components/landing/hero'
import WhyHerHomes from '@/components/landing/why-her-homes'
import DreamHome from '@/components/landing/dream-home'
import FinanceSection from '@/components/landing/finance-section'
import Testimonial from '@/components/landing/testimonial'
import PlatformBenefits from '@/components/landing/platform-benefits'
import Footer from '@/components/landing/footer'
import Header from '@/components/landing/header'
// import Features from '@/components/landing/features'
// import CallToAction from '@/components/landing/call-to-action'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white overflow-hidden">
      <Header />
      <main className="flex-1">
        <Hero />
        <WhyHerHomes />
        <DreamHome />
        <FinanceSection />
        {/* <Features/> */}
        {/* <CallToAction/> */}
        <Testimonial />
        <PlatformBenefits />
      </main>
      <Footer />
    </div>
  )
}
