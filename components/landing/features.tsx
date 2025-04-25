import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Home, Calculator, Search, Clock, Shield, Award } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: <Calculator className="h-10 w-10 text-primary" />,
      title: 'Mortgage Calculator',
      description:
        'Calculate your monthly payments, interest rates, and loan terms with our easy-to-use mortgage calculator.',
    },
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: 'Property Search',
      description:
        'Browse thousands of properties that match your criteria, with detailed information and high-quality images.',
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: 'Fast Approval',
      description:
        'Get pre-approved for a mortgage in minutes, not days, with our streamlined application process.',
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: 'Secure Process',
      description:
        'Your data is protected with bank-level security throughout the entire mortgage application process.',
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: 'Best Rates',
      description:
        'We compare rates from multiple lenders to ensure you get the best possible deal on your mortgage.',
    },
    {
      icon: <Home className="h-10 w-10 text-primary" />,
      title: 'Property Valuation',
      description:
        'Get accurate property valuations based on market data, location, and property features.',
    },
  ]

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Our Features
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Everything you need to find and finance your dream home in one
              place.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 border-muted">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
