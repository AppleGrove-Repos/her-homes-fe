'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PlatformBenefits() {
  return (
    <section className="w-full md:pb-12 pb-12 relative pt-[-500px]">
      {/* Pink blob decoration */}
      <div className="absolute top-0 right-0 w-1/4 h-1/2 bg-[#fdf0ed] rounded-bl-[30%] -z-10" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-rows-1 lg:grid-rows-2 items-center md:gap-[-300px]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:-mb-64 p-8"
          >
            <h2 className="md:text-4xl font-extrabold md:w-[400px]">
              Unlock Your Path to Homeownership with Our Streamlined Platform
            </h2>
            <p className="text-muted-foreground">
              Experience the ease of finding your dream home with our
              user-friendly platform. Save valuable time by comparing financing
              options and connecting with trusted developers all in one place.
              Simplifying homeownership has never been easier.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative md:-mt-20"
          >
            <Image
              src="/assets/images/start.png"
              width={600}
              height={500}
              alt="Couple looking at home options"
              className="rounded-lg object-cover w-full h-auto"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#64111F]/70 to-transparent rounded-lg flex flex-col justify-end p-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-white md:space-y-6 space-y-2 md:mb-52"
              >
                <h3 className="text-2xl md:text-[35px] font-bold">
                  Start Your Home Journey{' '}
                  <span className="md:block md:pt-5">Today</span>
                </h3>
                <p className="text-white/80 text-[10px] md:text-[16px]">
                  Sign up now to discover personalized home options and get
                  expert
                  <span className="md:block md:pt-2">
                    mortgage advice tailored just for you.
                  </span>
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/signup" passHref legacyBehavior>
                    <Button className="bg-[#64111F] text-white hover:bg-white/90 hover:text-black md:p-8 rounded-[15px]">
                      Sign Up
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="text-white border-white hover:bg-white/20 md:p-8 rounded-[15px] bg-transparent"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
