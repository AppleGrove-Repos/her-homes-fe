'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ConnectBuyersSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

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

  const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const listItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  // GSAP ScrollTrigger animations
  useGSAP(
    () => {
      // Image animation
      gsap.fromTo(
        imageRef.current,
        {
          opacity: 0,
          x: -100,
          scale: 0.9,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

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

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // List items stagger animation
      gsap.fromTo(
        '.benefit-item',
        {
          opacity: 0,
          x: 30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    },
    { scope: sectionRef }
  )

  const benefits = [
    'List your property with ease and speed.',
    'Reach verified, ready-to-buy users.',
    'Offer flexible investment and saving options.',
    'Access verified home buyers and real estate investors.',
  ]

  return (
    <section ref={sectionRef} className="w-full py-16 lg:py-24 bg-[#546B2F]/5">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left side - Image */}
          <motion.div
            ref={imageRef}
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={slideInLeft}
          >
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl">
              <Image
                src="/assets/images/developers-placeholder.png"
                alt="Modern apartment complex with contemporary architecture and landscaped grounds"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover"
                priority
              />
            </div>

            {/* Floating accent elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-20 h-20 bg-[#6B8E23] rounded-full opacity-20"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute -bottom-6 -left-6 w-16 h-16 bg-[#8B2635] rounded-full opacity-20"
              animate={{
                y: [0, 10, 0],
                scale: [1, 0.9, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: 1,
              }}
            />
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            ref={contentRef}
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={slideInRight}
          >
            {/* Header */}
            <div className="space-y-4">
              <motion.h2
                ref={titleRef}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold tracking-normal leading-10 sm:leading-normal text-center sm:text-left text-gray-900"
                variants={fadeInUp}
              >
                Connect with Qualified Home Buyers
              </motion.h2>

              <motion.p
                ref={subtitleRef}
                className="text-[14px] sm:text-[17px] text-gray-600 leading-relaxed"
                variants={fadeInUp}
              >
                Join our community-driven program and build sustainable
                neighborhoods together
              </motion.p>
            </div>

            {/* Benefits List */}
            <motion.div
              ref={listRef}
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="benefit-item flex items-start gap-4"
                  variants={listItemVariants}
                  whileHover={{
                    x: 8,
                    transition: { duration: 0.2, ease: 'easeOut' },
                  }}
                >
                  {/* Check Icon */}
                  <motion.div
                    className="flex-shrink-0 w-6 h-6 bg-[#6B8E23] rounded-full flex items-center justify-center mt-0.5"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: '0 4px 12px -2px rgba(107, 142, 35, 0.4)',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>

                  {/* Benefit Text */}
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {benefit}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
