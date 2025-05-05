'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion, useAnimation, type Variants } from 'framer-motion'

export default function Testimonial() {
  const [isInView, setIsInView] = useState(false)
  const controls = useAnimation()

  const testimonialText =
    'Thanks to this platform, we found our dream home effortlessly! The support and guidance made all the difference in our journey to homeownership.'

  // Character-by-character typing animation
  const textVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.025,
        delayChildren: 0.3,
      },
    },
  }

  const characterVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
  }

  // Cursor blinking animation
  const cursorVariants: Variants = {
    blinking: {
      opacity: [0, 1, 0],
      transition: {
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: 'loop',
        ease: 'linear',
      },
    },
  }

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <section className="w-full py-16 md:py-24 bg-[#fdf0ed] relative mb-[-300px]">
      <div className="absolute -top-[200px] -left-[60px] w-[400px] h-72 z-0 pointer-events-none filter blur-lg">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#F7A192"
            fillOpacity="0.3"
            d="M54.6,-75.3C71.2,-67.3,85.2,-52.6,90.8,-35.4C96.4,-18.2,93.6,1.5,87.4,19.8C81.2,38.1,71.6,55,57.5,65.9C43.4,76.8,24.8,81.7,5.9,79.9C-13,78.1,-26,69.6,-39.9,60.5C-53.8,51.4,-68.6,41.7,-76.2,27.7C-83.8,13.7,-84.2,-4.6,-78.3,-20.1C-72.4,-35.6,-60.2,-48.3,-46.1,-57.1C-32,-65.9,-16,-70.8,1.2,-72.5C18.4,-74.2,36.8,-72.7,54.6,-75.3Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <div className="absolute top-[400px] -right-[100px] w-[400px] h-72 z-0 pointer-events-none filter blur-md">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#F7A192"
            fillOpacity="0.3"
            d="M42.8,-65.2C54.9,-56.3,63.8,-43.2,70.2,-28.7C76.7,-14.2,80.8,1.7,77.7,16.3C74.6,30.9,64.3,44.2,51.5,54.1C38.7,64,23.3,70.5,7.4,72.1C-8.5,73.7,-24.9,70.4,-39.7,63C-54.5,55.6,-67.7,44.1,-74.4,29.4C-81.1,14.7,-81.3,-3.2,-76.2,-19.1C-71.1,-35,-60.7,-48.9,-47.4,-57.7C-34.1,-66.5,-17,-70.2,-0.6,-69.3C15.9,-68.4,30.7,-74.1,42.8,-65.2Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          onViewportEnter={() => setIsInView(true)}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <blockquote className="text-xl md:text-2xl font-medium italic relative">
            <span className="text-[#F7A192] text-3xl absolute -left-6 top-0">
              &quot;
            </span>
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={controls}
              className="inline"
            >
              {testimonialText.split('').map((char, index) => (
                <motion.span
                  key={index}
                  variants={characterVariants}
                  className="inline-block"
                  style={{
                    display: char === ' ' ? 'inline' : 'inline-block',
                    whiteSpace: char === ' ' ? 'pre' : 'normal',
                  }}
                >
                  {char}
                </motion.span>
              ))}
              <motion.span
                variants={cursorVariants}
                animate="blinking"
                className="inline-block w-0.5 h-6 bg-[#F7A192] ml-1 align-middle"
              />
            </motion.div>
            <span className="text-[#F7A192] text-3xl absolute -right-6 bottom-0">
              &quot;
            </span>
          </blockquote>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-2"
          >
            <Avatar className="h-16 w-16">
              <AvatarImage src="/assets/images/emily.png" alt="Emily Johnson" />
              <AvatarFallback>EJ</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Emily Johnson</p>
              <p className="text-sm text-muted-foreground">
                Homebuyer, Happy Family
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
