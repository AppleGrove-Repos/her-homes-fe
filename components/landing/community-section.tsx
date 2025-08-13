'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { PiggyBank, Users, TrendingUp } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CommunitySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
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

      // Cards stagger animation
      gsap.fromTo(
        '.community-card',
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
      img: '/assets/images/piggy-icon.png',
      title: 'Group Savings',
      description: 'Pool resources with like-minded individuals',
    },
    {
      img: '/assets/images/growth-icon.png',
      title: 'Shared Benefits',
      description: 'Access to exclusive community discounts and amenities',
    },
    {
      img: '/assets/images/growth-icon.png',
      title: 'Community Growth',
      description: 'Build sustainable neighborhoods together',
    },
  ]

  return (
    <section ref={sectionRef} className="w-full py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <motion.h2
              ref={titleRef}
              className="text-2xl md:text-3xl lg:text-[40px] font-semibold tracking-normal leading-10 text-gray-900"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
            >
              Empowering Communities Through Home Ownership
            </motion.h2>

            <motion.p
              ref={subtitleRef}
              className="text-[14px] sm:text-[17px] text-gray-600 max-w-2xl mx-auto leading-relaxed md:pt-5 pt-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
            >
              Join our community-driven program and build sustainable
              neighborhoods together
            </motion.p>
          </div>

          {/* Feature Cards */}
          <motion.div
            ref={cardsRef}
            className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="community-card p-6  shadow-md border border-gray-200 rounded-lg items-start justify-start space-y-4"
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: 'easeOut' },
                }}
              >
                {/* Icon/Image Container */}
                <motion.div className="" transition={{ duration: 0.3 }}>
                  <img
                    src={feature.img}
                    alt={feature.title}
                    className="md:w-10 md:h-10 object-contain w-6 h-6 md:items-start items-center"
                  />
               
                </motion.div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl md:text-[17px] font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            ref={buttonRef}
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-[#8B2635] hover:bg-[#7A1F2B] text-white px-8 py-4 text-[15px] font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Onboard Your Community
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
