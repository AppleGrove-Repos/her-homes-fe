'use client'
import { useState, useEffect } from 'react'
import PropertyCard from '@/components/applicants/PropertyCard'
import Image from 'next/image'
import { Search, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Footer from '@/components/landing/footer'
import Header from '@/components/landing/header'
import {
  motion,
  AnimatePresence,
  useAnimation,
  type Variants,
} from 'framer-motion'

export default function ListingsPage() {
  const houseImages = [
    '/assets/images/listingBG-1.png',
    '/assets/images/listingBG-2.png',
    '/assets/images/listingBG-3.png',
    '/assets/images/listingBG-4.png',
  ]
  const [[page, direction], setPage] = useState([0, 0])

  useEffect(() => {
    const interval = setInterval(() => {
      const newPage = (page + 1) % houseImages.length
      setPage([newPage, 1])
    }, 5000)

    return () => clearInterval(interval)
  }, [page, houseImages.length])

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
  return (
    <div className="flex min-h-screen flex-col bg-[#F1F1F1] overflow-hidden">
      <Header />
      {/* Hero Section */}
      <div className="relative w-full h-[400px] bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center mb-36">
        <div className="absolute inset-0 z-0">
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
                className="object-cover opacity-40"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <h1 className="text-4xl md:text-5xl text-white font-bold z-10 text-left">
          Homes for Sale in Nigeria
        </h1>
      </div>

      {/* Search + Filter Card */}
      <div className="absolute top-[400px] left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-2 ">
        <div className="bg-white rounded-xl shadow-lg p-6 md:h-[160px]">
          {/* Search Input */}
          <div className="flex w-full mb-4 relative">
            <Input
              type="text"
              placeholder="Search homes by type, location..."
              className="pr-20 rounded-md h-[35px] bg-white flex-grow"
            />
            <Button
              className="absolute right-1 top-1/2  h-[30px] w-[100px] -translate-y-1/2 bg-[#546B2F] hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm"
              size="sm"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-white py-4 px-4 border-b">
            <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
              <select className="px-3 py-2 border rounded-md text-sm">
                <option>Home Type</option>
                <option>Duplex</option>
                <option>Detached House</option>
                <option>Apartment</option>
              </select>
              <select className="px-3 py-2 border rounded-md text-sm">
                <option>Price Range</option>
                <option>₦50M - ₦100M</option>
                <option>₦100M - ₦200M</option>
                <option>₦200M+</option>
              </select>
              <select className="px-3 py-2 border rounded-md text-sm">
                <option>Financing Plan</option>
                <option>Mortgage</option>
                <option>Cash</option>
                <option>Installment</option>
              </select>
              <select className="px-3 py-2 border rounded-md text-sm">
                <option>Bedrooms</option>
                <option>1+</option>
                <option>2+</option>
                <option>3+</option>
                <option>4+</option>
              </select>
              <select className="px-3 py-2 border rounded-md text-sm">
                <option>Location</option>
                <option>Lagos</option>
                <option>Abuja</option>
                <option>Port Harcourt</option>
              </select>
              <select className="px-3 py-2 border rounded-md text-sm">
                <option>More Filters</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#F1F1F1] py-3 px-4 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm">All (373 Results)</div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium">Set alert</button>
            <div className="flex items-center gap-2">
              <span className="text-sm">Show financing only</span>
              <div className="w-10 h-5 bg-gray-300 rounded-full p-1 flex items-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="bg-[#F1F1F1] flex-grow py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Property Card 1 */}
          <PropertyCard
            type="3-Bedroom Terrace Duplex"
            location="Lekki Phase 1, Lagos"
            price="₦85,000,000"
            monthlyPayment="₦1,980,000"
            rating={4.5}
            tags={['Newly Built', 'Swimming Pool', 'Gym']}
            imageUrl="/assets/images/homes-1.png"
          />

          {/* Property Card 2 */}
          <PropertyCard
            type="4-Bedroom Detached House"
            location="Lekki Phase 1, Lagos"
            price="₦85,000,000"
            monthlyPayment="₦1,980,000"
            rating={4}
            tags={['Newly Built', 'Swimming Pool', 'Gym']}
            imageUrl="/placeholder.svg?height=300&width=400"
          />

          {/* Property Card 3 */}
          <PropertyCard
            type="3-Bedroom Terrace Duplex"
            location="Lekki Phase 1, Lagos"
            price="₦85,000,000"
            monthlyPayment="₦1,980,000"
            rating={4.5}
            tags={['Newly Built', 'Swimming Pool', 'Gym']}
            imageUrl="/placeholder.svg?height=300&width=400"
          />

          {/* Property Card 4 */}
          <PropertyCard
            type="3-Bedroom Terrace Duplex"
            location="Lekki Phase 1, Lagos"
            price="₦85,000,000"
            monthlyPayment="₦1,980,000"
            rating={4.5}
            tags={['Newly Built', 'Swimming Pool', 'Gym']}
            imageUrl="/placeholder.svg?height=300&width=400"
          />

          {/* Property Card 5 */}
          <PropertyCard
            type="3-Bedroom Terrace Duplex"
            location="Lekki Phase 1, Lagos"
            price="₦85,000,000"
            monthlyPayment="₦1,980,000"
            rating={4.5}
            tags={['Newly Built', 'Swimming Pool', 'Gym']}
            imageUrl="/placeholder.svg?height=300&width=400"
          />

          {/* Property Card 6 */}
          <PropertyCard
            type="3-Bedroom Terrace Duplex"
            location="Lekki Phase 1, Lagos"
            price="₦85,000,000"
            monthlyPayment="₦1,980,000"
            rating={4.5}
            tags={['Newly Built', 'Swimming Pool', 'Gym']}
            imageUrl="/placeholder.svg?height=300&width=400"
          />
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-8">
          <Button className="bg-[#5D0F1D] hover:bg-[#4A0C17] text-white px-6">
            View More
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
