'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function DreamHome() {
  return (
    <section className="w-full py-16 md:py-24 relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Image Animation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <Image
              src="/assets/images/dream.png"
              width={500}
              height={400}
              alt="Person using smartphone"
              className="rounded-lg object-cover w-full h-auto"
            />
          </motion.div>

          {/* Text Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold">
              Get your dream home without the stress
            </h3>
            <p className="text-muted-foreground">
              Whether you&apos;re searching for your first apartment or your
              forever home, our financing options make it easy to find a
              property that fits your lifestyle and your budget.
            </p>
            <Button className="bg-[#6e1a2c] hover:bg-[#5a1523] text-white rounded-md">
              Contact Us
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
