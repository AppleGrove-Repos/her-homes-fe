'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'

// Variants
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const floatImageVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

const features = [
  {
    img: '/assets/images/piggy-icon.png',
    title: 'Systematic Savings',
    description: 'Save monthly towards your dream home',
  },
  {
    img: '/assets/images/growth-icon.png',
    title: 'Investment Growth',
    description: 'Watch your savings grow with smart investments',
  },
]

export default function InvestmentSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={containerVariants}
      className="w-full py-12 sm:py-16 lg:py-24 bg-[#ffffff]"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left side - Hero Image */}
          <motion.div
            variants={floatImageVariant}
            className="order-2 lg:order-1"
          >
            <Image
              src="/assets/images/savings.png"
              alt="Hands holding a small house model representing home ownership investment"
              width={600}
              height={400}
              className="w-full h-auto rounded-lg object-cover shadow-md"
              priority
            />
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            className="space-y-6 sm:space-y-8 order-1 lg:order-2"
            variants={containerVariants}
          >
            {/* Main Heading */}
            <motion.div
              className="space-y-3 sm:space-y-4"
              variants={fadeUpVariant}
            >
              <h2 className="text-center sm:text-left text-[20px] sm:text-2xl md:text-4xl lg:text-[40px] font-semibold text-gray-900 leading-tight sm:leading-10 tracking-normal">
                Build Your Future, Brick by{' '}
                <span className="block mt-1 sm:mt-3">Brick</span>
              </h2>
              <p className="text-center sm:text-left text-[12px] sm:text-[15px] text-gray-600 leading-relaxed max-w-lg">
                Start your journey to home ownership with our systematic savings
                and investment program
              </p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="space-y-3 bg-[#546B2F]/5 p-4 sm:p-6 rounded-lg shadow-md text-center sm:text-left"
                  variants={fadeUpVariant}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12  rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                    <img
                      src={feature.img}
                      alt={feature.title}
                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={fadeUpVariant} className="pt-2">
              <Link href="/listings">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-[#6e1a2c] hover:bg-[#5a1523] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-md transition-colors duration-200 w-full sm:w-auto"
                  >
                    Start Saving Today
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
