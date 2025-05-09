import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function WhyHerHomes() {
  return (
    <section className="w-full py-16 md:py-24 relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Why Her Homes?
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">
              Discover properties that match your lifestyle
            </h3>
            <p className="text-muted-foreground">
              Explore a curated selection of homes, each meticulously chosen to
              match your familys needs and preferences through trusted
              developers.
            </p>
            <Link href="/listings">
              <Button className="bg-[#6e1a2c] hover:bg-[#5a1523] text-white rounded-md">
                Browse Listings
              </Button>
            </Link>
          </div>

          <div>
            <Image
              src="/assets/images/why-her.png"
              width={500}
              height={400}
              alt="Person browsing properties on laptop"
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
