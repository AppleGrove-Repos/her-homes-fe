import  Header  from '@/components/landing/header'
import { PartnershipContent } from '@/components/landing/partnership'
import  Footer  from '@/components/landing/footer'

export default function PartnershipPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header />
      <main>
        <PartnershipContent />
      </main>
      <Footer />
    </div>
  )
}
