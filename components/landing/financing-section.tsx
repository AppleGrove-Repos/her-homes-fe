'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Clock, FileText, Shield } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FinancingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  // GSAP ScrollTrigger animations
  useGSAP(
    () => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Cards stagger animation
      gsap.fromTo(
        '.feature-card',
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Button animation
      gsap.fromTo(
        buttonRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: buttonRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    },
    { scope: sectionRef }
  )

  const features = [
    {
      icon: Clock,
      title: 'Quick Approval',
      description: 'Get approved in 72 hours with our digital process',
    },
    {
      icon: FileText,
      title: 'Paperless Process',
      description: 'Complete your application from the comfort of your home',
    },
    {
      icon: Shield,
      title: 'Transparent Time',
      description: 'Clear requirements and competitive interest rates',
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 sm:py-16 lg:py-24 bg-[#546B2F]/5"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <motion.h2
            ref={titleRef}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold tracking-normal leading-tight sm:leading-normal text-center text-gray-900 mb-12 sm:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            Home Financing Made Simple
          </motion.h2>

          {/* Feature Cards */}
          <motion.div
            ref={cardsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card text-center space-y-4 p-4 sm:p-6"
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: 'easeOut' },
                }}
              >
                {/* Icon Container */}
                <motion.div
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-[#6B8E23] rounded-full flex items-center justify-center"
                  whileHover={{
                    scale: 1.1,
                    boxShadow: '0 10px 30px -10px rgba(107, 142, 35, 0.4)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-xl md:text-[18px] font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed max-w-[280px] mx-auto px-2 sm:px-0">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            ref={buttonRef}
            className="text-center px-4 sm:px-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-[#8B2635] hover:bg-[#7A1F2B] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-[15px] font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              >
                Get Pre-qualified Today
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
