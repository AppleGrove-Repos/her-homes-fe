'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import clsx from 'clsx'
import { useRef } from 'react'
import {
  motion,
  AnimatePresence,
  useAnimation,
  type Variants,
} from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)


export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const houseImages = [
    '/assets/images/Component 3.png',
    '/assets/images/house-2.png',
    '/assets/images/house-3.png',
    '/assets/images/house-4.png',
    '/assets/images/house-5.png',
  ]
  enum PriceFilter {
    UNDER_10M = '0m-10m',
    BETWEEN_10M_25M = '10m-25m',
    BETWEEN_25M_50M = '25m-50m',
    BETWEEN_50M_100M = '50m-100m',
    ABOVE_100M = '100m-999m',
  }
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      timeline.from('#hero-img', { scale: 1.3 })
    },
    { scope: ref }
  )
  
  // const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()
  const controls = useAnimation()

  const [selectedPrice, setSelectedPrice] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const priceOptions = [
    { label: 'Under N10M', value: PriceFilter.UNDER_10M },
    { label: 'N10M - N25M', value: PriceFilter.BETWEEN_10M_25M },
    { label: 'N25M - N50M', value: PriceFilter.BETWEEN_25M_50M },
    { label: 'N50M - N100M', value: PriceFilter.BETWEEN_50M_100M },
    { label: 'Above N100M', value: PriceFilter.ABOVE_100M },
  ]
  const locationOptions = [
    { label: 'Lagos', image: '/assets/images/lagos.png' },
    { label: 'Ibadan', image: '/assets/images/ibadan.png' },
    { label: 'Abuja', image: '/assets/images/abuja.png' },
    { label: 'Port Harcourt', image: '/assets/images/port-harcourt.png' },
    { label: 'Abeokuta', image: '/assets/images/abeokuta.png' },
  ]

  // Animation variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const staggerChildren: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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

  // Direction tracking for image slider
  const [[page, direction], setPage] = useState([0, 0])

  useEffect(() => {
    const interval = setInterval(() => {
      const newPage = (page + 1) % houseImages.length
      setPage([newPage, 1])
    }, 5000)

    return () => clearInterval(interval)
  }, [page, houseImages.length])

  const handleSearch = () => {
    const query = new URLSearchParams()
    if (selectedPrice) query.append('price', selectedPrice)
    if (selectedLocation) query.append('location', selectedLocation)
    router.push(`/listings?${query.toString()}`)
  }

  // Animate in on mount
  useEffect(() => {
    controls.start('visible')
  }, [controls])

  return (
    <section className="w-full py-8 md:py-12 relative overflow-hidden ref={ref}">
      <motion.div
        className="absolute top-0 left-0 w-1/3 h-2/3 bg-[#F7A192] rounded-br-[30%] -z-10"
        initial={{ opacity: 0, scale: 0.8, x: -100 }}
        animate={{ opacity: 0.7, scale: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate={controls}
            variants={staggerChildren}
          >
            <motion.div className="space-y-4" variants={fadeInUp}>
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight"
                variants={fadeInUp}
              >
                Simplifying Your Path to Homeownership
              </motion.h1>
              <motion.p
                className="text-base text-muted-foreground max-w-[600px]"
                variants={fadeInUp}
              >
                Discover how easy it can be to find your dream home and secure
                the right financing. Let us guide you every step of the way to
                make homeownership a reality.
              </motion.p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 space-y-6 relative z-10 max-w-md"
              variants={fadeInUp}
              whileHover={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.h2
                className="text-xl md:ml-16 font-semibold"
                variants={fadeInUp}
              >
                Find your dream home
              </motion.h2>

              <motion.div className="space-y-4" variants={staggerChildren}>
                <motion.div className="space-y-2" variants={fadeInUp}>
                  <p className="text-sm font-medium">By Price</p>
                  <div className="grid grid-cols-3 gap-2">
                    {priceOptions.slice(0, 3).map((option, index) => (
                      <motion.div
                        key={option.value}
                        variants={fadeInUp}
                        custom={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          className={clsx(
                            'text-xs h-8 rounded-md w-full',
                            selectedPrice === option.value
                              ? 'bg-[#546B2F] text-white pointer-events-none'
                              : 'hover:bg-[#546B2F] hover:text-white'
                          )}
                          onClick={() => setSelectedPrice(option.value)}
                        >
                          {option.label}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {priceOptions.slice(3).map((option, index) => (
                      <motion.div
                        key={option.value}
                        variants={fadeInUp}
                        custom={index + 3}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          className={clsx(
                            'text-xs h-8 rounded-md w-full',
                            selectedPrice === option.value
                              ? 'bg-[#546B2F] text-white pointer-events-none'
                              : 'hover:bg-[#546B2F] hover:text-white'
                          )}
                          onClick={() => setSelectedPrice(option.value)}
                        >
                          {option.label}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div className="space-y-2" variants={fadeInUp}>
                  <p className="text-sm font-medium">By Location</p>
                  <div className="grid grid-cols-3 gap-2">
                    {locationOptions.slice(0, 3).map((option, index) => (
                      <motion.div
                        key={option.label}
                        variants={fadeInUp}
                        custom={index}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          className={clsx(
                            'relative overflow-hidden text-white text-[10px] hover:text-[#546B2F] h-8 rounded-md px-4 py-8 w-full',
                            selectedLocation === option.label &&
                              'border-2 border-[#546B2F] pointer-events-none'
                          )}
                          onClick={() => setSelectedLocation(option.label)}
                        >
                          <span
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${option.image})` }}
                          />
                          <span className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px] hover:backdrop-blur-[2px] hover:bg-black/40" />
                          <span className="relative z-10">{option.label}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {locationOptions.slice(3).map((option, index) => (
                      <motion.div
                        key={option.label}
                        variants={fadeInUp}
                        custom={index + 3}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          className={clsx(
                            'relative overflow-hidden text-white hover:text-[#546B2F] text-[10px] h-8 rounded-md px-4 py-8 w-full',
                            selectedLocation === option.label &&
                              'border-2 border-[#546B2F] pointer-events-none'
                          )}
                          onClick={() => setSelectedLocation(option.label)}
                        >
                          <span
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${option.image})` }}
                          />
                          <span className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px] hover:backdrop-blur-[2px] hover:bg-black/40" />
                          <span className="relative z-10">{option.label}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    className="w-full bg-[#5a7a3e] hover:bg-[#4a6534] text-white rounded-md"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full h-[600px] overflow-hidden rounded-2xl">
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
                    sizes="100vw"
                    id="hero-img"
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              className="absolute -bottom-6 -left-14 bg-white rounded-lg py-8 pl-4 pr-28 shadow-lg flex items-center gap-4 max-w-[500px]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, ...floatAnimation.float }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex -space-x-4">
                <motion.div
                  whileHover={{ y: -5, zIndex: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src="/assets/images/person-3.png"
                    width={40}
                    height={40}
                    alt="User avatar"
                    className="rounded-full border-2 border-white"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ y: -5, zIndex: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src="/assets/images/person-2.png"
                    width={40}
                    height={40}
                    alt="User avatar"
                    className="rounded-full border-2 border-white"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ y: -5, zIndex: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src="/assets/images/person-1.png"
                    width={40}
                    height={40}
                    alt="User avatar"
                    className="rounded-full border-2 border-white"
                  />
                </motion.div>
              </div>
              <div>
                <motion.p
                  className="font-extrabold text-[13px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  1k+ People
                </motion.p>
                <motion.p
                  className="text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  Successfully gotten homes
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-10 -right-2 bg-white rounded-lg p-4 py-8 shadow-lg flex items-center gap-4 max-w-[150px]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, ...floatAnimation.float }}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ scale: 1.1 }}
            >
              <Image
                src="/assets/images/person-4.png"
                width={40}
                height={40}
                alt="User avatar"
                className="rounded-full border-2 border-white"
              />
              <div>
                <motion.p
                  className="font-extrabold text-[13px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  112 Houses
                </motion.p>
                <motion.p
                  className="text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  Bought Monthly
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, ...pulseAnimation.pulse }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.p
                className="font-extrabold text-[13px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                ID Homes
              </motion.p>
              <motion.p
                className="text-muted-foreground"
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
