import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Fill out the application',
      description:
        'Complete our simple online application with your personal and financial information.',
    },
    {
      number: '02',
      title: 'Get pre-approved',
      description:
        "Receive your pre-approval letter within minutes, showing sellers you're a serious buyer.",
    },
    {
      number: '03',
      title: 'Browse properties',
      description:
        'Search for properties that match your budget and preferences with our advanced search tools.',
    },
    {
      number: '04',
      title: 'Make an offer',
      description:
        'When you find the perfect home, make an offer with the help of our real estate experts.',
    },
    {
      number: '05',
      title: 'Close the deal',
      description:
        'Complete the mortgage process and close on your new home with our guidance every step of the way.',
    },
  ]

  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              How It Works
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our simple 5-step process to help you find and finance your dream
              home.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl mt-12">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 mb-8">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold">
                {step.number}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg" asChild>
              <Link href="#apply-now">Apply Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#contact">Contact Us</Link>
            </Button>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckCircle className="mr-2 h-4 w-4 text-primary" />
            <span>No obligation. Free consultation.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
