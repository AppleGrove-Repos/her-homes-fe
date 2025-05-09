'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
export default function FinanceSection() {
  return (
    <section className="w-full py-16 md:py-24 relative">
      {/* Pink blob decoration */}
      <div className="absolute bottom-0 right-0 w-1/3 h-2/3 bg-[#fdf0ed] rounded-tl-[30%] -z-10"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-6">
            Finance your home with ease
          </h2>
          <p className="text-muted-foreground mb-6">
            Apply for flexible home financing options through Her Homes.
            Complete a simple application and get approved for a plan that fits
            your lifestyle and budget.
          </p>
          <Link href="/applicant/apply-for-financing" passHref legacyBehavior>
            <Button className="bg-[#6e1a2c] hover:bg-[#5a1523] text-white rounded-md">
              Apply for financing
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
