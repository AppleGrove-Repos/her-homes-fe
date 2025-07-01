import Hero from '@/components/landing/hero'
import PlatformBenefits from '@/components/landing/platform-benefits'
import Footer from '@/components/landing/footer'
import Header from '@/components/landing/header'
import InvestmentSection from '@/components/landing/investment-section'
import FinancingSection from '@/components/landing/financing-section'
import CommunitySection from '@/components/landing/community-section'
import ConnectBuyersSection from '@/components/landing/developers-section'
import PartnersSection from '@/components/landing/partners-section'

// import Features from '@/components/landing/features'
// import CallToAction from '@/components/landing/call-to-action'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white overflow-hidden">
      <Header />
      <main className="flex-1">
        <Hero />
        <InvestmentSection />
        <FinancingSection/>
        <CommunitySection/>
        <ConnectBuyersSection />  
        <PartnersSection/>
        <PlatformBenefits />
      </main>
      <Footer />
    </div>
  )
}
