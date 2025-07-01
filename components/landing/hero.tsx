'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import {
  motion,
  AnimatePresence,
  useAnimation,
  type Variants,
} from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatedDropdown } from '@/components/animations/animation-dropdown'
import { LoadingSpinner } from '@/components/animations/loading-spinner'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const searchFormRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const controls = useAnimation()

  enum PriceFilter {
    UNDER_10M = '0m-10m',
    BETWEEN_10M_25M = '10m-25m',
    BETWEEN_25M_50M = '25m-50m',
    BETWEEN_50M_100M = '50m-100m',
    ABOVE_100M = '100m-999m',
  }

  const [selectedPrice, setSelectedPrice] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedPropertyType, setSelectedPropertyType] = useState<
    string | null
  >(null)
  const [isSearching, setIsSearching] = useState(false)

  const priceOptions = [
    { label: 'Under N10M', value: PriceFilter.UNDER_10M },
    { label: 'N10M - N25M', value: PriceFilter.BETWEEN_10M_25M },
    { label: 'N25M - N50M', value: PriceFilter.BETWEEN_25M_50M },
    { label: 'N50M - N100M', value: PriceFilter.BETWEEN_50M_100M },
    { label: 'Above N100M', value: PriceFilter.ABOVE_100M },
  ]

  const houseImages = [
    '/assets/images/Component 3.png',
    '/assets/images/house-2.png',
    '/assets/images/house-3.png',
    '/assets/images/house-4.png',
    '/assets/images/house-5.png',
  ]

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const slideInRight: Variants = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const staggerChildren: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const formFieldVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const imageVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      },
    }),
  }

  const floatAnimation: Variants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    },
  }

  const pulseAnimation: Variants = {
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    },
  }

  const [[page, direction], setPage] = useState([0, 0])

  useEffect(() => {
    const interval = setInterval(() => {
      const newPage = (page + 1) % houseImages.length
      setPage([newPage, 1])
    }, 5000)

    return () => clearInterval(interval)
  }, [page, houseImages.length])

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
        .from('#hero-img', { scale: 1.3 })

      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        searchFormRef.current,
        { opacity: 0, x: -100, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          delay: 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: searchFormRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: 100, scale: 0.8 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.2,
          delay: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    },
    { scope: ref }
  )

  useEffect(() => {
    controls.start('visible')
  }, [controls])

  const handleSearch = () => {
    setIsSearching(true)
    const query = new URLSearchParams()
    if (selectedPrice) query.append('price', selectedPrice)
    if (selectedLocation) query.append('location', selectedLocation)
    if (selectedPropertyType) query.append('type', selectedPropertyType)

    router.push(`/listings?${query.toString()}`)
    // Optionally, set isSearching to false after navigation or after a timeout
    // setTimeout(() => setIsSearching(false), 1000);
  }

  return (
    <section
      className="w-full py-6 sm:py-8 md:py-12 relative overflow-hidden"
      ref={ref}
    >
      <motion.div
        className="absolute top-0 left-0 w-1/2 sm:w-1/3 h-1/2 sm:h-2/3 bg-[#F7A192] rounded-br-[30%] -z-10"
        initial={{ opacity: 0, scale: 0.8, x: -100 }}
        animate={{ opacity: 0.7, scale: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Title - Shows first on mobile only */}
        <motion.div
          className="lg:hidden mb-6"
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
        >
          <motion.h1
            ref={titleRef}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-normal leading-tight text-center"
            variants={fadeInUp}
          >
            Simplifying Your Path{' '}
            <span className="block mt-2">to Homeownership</span>
          </motion.h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Desktop Content - Shows on left for desktop */}
          <motion.div
            className="space-y-6 sm:space-y-8 order-3 lg:order-1"
            initial="hidden"
            animate={controls}
            variants={staggerChildren}
          >
            {/* Desktop Title - Hidden on mobile */}
            <motion.div
              className="space-y-4 sm:space-y-6 lg:space-y-8 hidden lg:block"
              variants={slideInLeft}
            >
              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold tracking-normal leading-tight sm:leading-normal lg:leading-tight"
                variants={fadeInUp}
              >
                Simplifying Your Path{' '}
                <span className="block mt-2 sm:mt-3">to Homeownership</span>
              </motion.h1>
              <motion.p
                ref={descriptionRef}
                className="text-sm sm:text-base text-muted-foreground max-w-[600px]"
                variants={fadeInUp}
              >
                Discover how easy it can be to find your dream home and secure
                the right financing. Let us guide you every step of the way to
                make homeownership a reality.
              </motion.p>
            </motion.div>

            {/* Mobile Description - Shows after image on mobile */}
            <motion.div className="lg:hidden space-y-4" variants={fadeInUp}>
              <motion.p
                className="text-sm sm:text-base text-muted-foreground text-center"
                variants={fadeInUp}
              >
                Discover how easy it can be to find your dream home and secure
                the right financing. Let us guide you every step of the way to
                make homeownership a reality.
              </motion.p>
            </motion.div>

            {/* Enhanced Search Form with Responsive Layout */}
            <div className="relative flex flex-col">
              <motion.div
                ref={searchFormRef}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4 relative z-10 w-full max-w-md lg:max-w-lg mx-auto lg:mx-0"
                variants={slideInLeft}
              >
                <motion.div
                  className="space-y-4 flex flex-col"
                  variants={staggerChildren}
                >
                  {/* Mobile: Stack all fields vertically, Desktop: First row with location and property type */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <motion.div
                      className="relative flex-1"
                      variants={formFieldVariants}
                    >
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <motion.input
                        type="text"
                        placeholder="Search Location"
                        className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:bg-white transition-all"
                        value={selectedLocation || ''}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                      />
                    </motion.div>

                    <div className="flex-1">
                      <AnimatedDropdown
                        label="Property Type"
                        options={[
                          { label: 'Apartment', value: 'apartment' },
                          { label: 'House', value: 'house' },
                          { label: 'Duplex', value: 'duplex' },
                          { label: 'Bungalow', value: 'bungalow' },
                          { label: 'Penthouse', value: 'penthouse' },
                        ]}
                        selected={selectedPropertyType}
                        setSelected={setSelectedPropertyType}
                      />
                    </div>
                  </div>

                  {/* Price Range - Full width on all screens */}
                  <AnimatedDropdown
                    label="Price Range (₦)"
                    options={priceOptions}
                    selected={selectedPrice}
                    setSelected={setSelectedPrice}
                  />

                  <motion.div variants={formFieldVariants}>
                    <motion.button
                      className="w-full h-10 sm:h-12 bg-[#6B8E23] hover:bg-[#5A7A1F] text-white font-medium rounded-lg shadow-sm transition-all text-sm sm:text-base flex items-center justify-center"
                      onClick={handleSearch}
                      whileHover={{ y: -1 }}
                      whileTap={{ y: 0 }}
                      transition={{ duration: 0.1 }}
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <>
                          <LoadingSpinner size={18} color="#fff" />
                          <span className="ml-2">Searching...</span>
                        </>
                      ) : (
                        'Search'
                      )}
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Image Section */}
          <motion.div
            ref={imageRef}
            className="relative order-2"
            initial="hidden"
            animate="visible"
            variants={slideInRight}
          >
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={page}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute w-full h-full"
                >
                  <Image
                    src={houseImages[page] || '/placeholder.svg'}
                    alt={`House ${page + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    id="hero-img"
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Enhanced Floating Cards - Show on all devices with responsive positioning */}
            <motion.div
              className="floating-card absolute -bottom-3 sm:-bottom-6 -left-2 sm:-left-14 bg-white rounded-lg py-3 sm:py-8 pl-2 sm:pl-4 pr-12 sm:pr-28 shadow-lg flex items-center gap-2 sm:gap-4 max-w-[200px] sm:max-w-[500px]"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1, ...floatAnimation.float }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.15)',
                y: -2,
              }}
            >
              <div className="flex -space-x-1 sm:-space-x-4">
                <motion.div
                  whileHover={{ y: -2, zIndex: 10, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src="/assets/images/person-3.png"
                    width={24}
                    height={24}
                    alt="User avatar"
                    className="rounded-full border-2 border-white sm:w-10 sm:h-10"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ y: -2, zIndex: 10, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src="/assets/images/person-2.png"
                    width={24}
                    height={24}
                    alt="User avatar"
                    className="rounded-full border-2 border-white sm:w-10 sm:h-10"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ y: -2, zIndex: 10, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src="/assets/images/person-1.png"
                    width={24}
                    height={24}
                    alt="User avatar"
                    className="rounded-full border-2 border-white sm:w-10 sm:h-10"
                  />
                </motion.div>
              </div>
              <div>
                <motion.p
                  className="font-extrabold text-[10px] sm:text-[13px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  1k+ People
                </motion.p>
                <motion.p
                  className="text-[8px] sm:text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  Successfully gotten homes
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              className="floating-card absolute bottom-4 sm:bottom-10 -right-1 sm:-right-2 bg-white rounded-lg p-2 sm:p-4 py-3 sm:py-8 shadow-lg flex items-center gap-1 sm:gap-4 max-w-[100px] sm:max-w-[150px]"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1, ...floatAnimation.float }}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.15)',
                rotate: 1,
              }}
            >
              <Image
                src="/assets/images/person-4.png"
                width={24}
                height={24}
                alt="User avatar"
                className="rounded-full border-2 border-white sm:w-10 sm:h-10"
              />
              <div>
                <motion.p
                  className="font-extrabold text-[10px] sm:text-[13px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  112 Houses
                </motion.p>
                <motion.p
                  className="text-[8px] sm:text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  Bought Monthly
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              className="floating-card absolute top-1 sm:top-4 right-1 sm:right-4 bg-white rounded-lg p-2 sm:p-3 shadow-lg"
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1, ...pulseAnimation.pulse }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.15)',
                rotate: -1,
              }}
            >
              <motion.p
                className="font-extrabold text-[10px] sm:text-[13px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                ID Homes
              </motion.p>
              <motion.p
                className="text-[8px] sm:text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                Design: Modern
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
