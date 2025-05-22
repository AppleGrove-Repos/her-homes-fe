'use client'

import type React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft,
  MapPin,
  Bed,
  Home,
  Calendar,
  Heart,
  Share2,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Footer from '@/components/landing/footer'
import { useAuth } from '@/lib/store/auth.store'
import {
  useGetProperty,
  useSaveProperty,
  useRemoveFromFavorites,
  useGetPropertyListings,
} from '@/lib/hooks/usePropertyApi'
import toast from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

// Wrapper component with QueryClientProvider
export default function PropertyDetailPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <PropertyDetailPage />
    </QueryClientProvider>
  )
}

function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [userRating, setUserRating] = useState<number>(0)
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { user } = useAuth()
  const propertyId = params.id as string
  const [isGalleryAutoPlaying, setIsGalleryAutoPlaying] = useState(true)
  const [isSimilarAutoPlaying, setIsSimilarAutoPlaying] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Use React Query hooks - no auth required for viewing property details
  const {
    data: propertyResponse,
    isLoading,
    error: queryError,
  } = useGetProperty(propertyId)

  const property = propertyResponse?.data
  const error = queryError ? (queryError as Error).message : null

  // These mutations require authentication
  const savePropertyMutation = useSaveProperty()
  const removeFromFavoritesMutation = useRemoveFromFavorites()

  // For demo purposes, using placeholder images if property has no images
  const propertyMedia = [
    ...(property?.images || []),
    ...(property?.videos || []),
  ]

  // Fallback if no media
  const galleryMedia = propertyMedia.length
    ? propertyMedia
    : [
        '/placeholder.svg?height=600&width=800',
        '/placeholder.svg?height=600&width=800',
        '/placeholder.svg?height=600&width=800',
      ]

  // Check if current media is a video
  const isCurrentMediaVideo = galleryMedia[currentImageIndex]?.endsWith('.mp4')

  const handleManualImageChange = (newIndex: number) => {
    // Temporarily pause autoplay when user interacts
    setIsGalleryAutoPlaying(false)
    setCurrentImageIndex(newIndex)

    // Check if the new media is a video
    const isVideo = galleryMedia[newIndex]?.endsWith('.mp4')
    setIsVideoPlaying(isVideo)

    // Resume autoplay after 10 seconds of inactivity, but only if not on a video
    if (!isVideo) {
      const resumeTimeout = setTimeout(() => {
        setIsGalleryAutoPlaying(true)
      }, 10000)

      return () => clearTimeout(resumeTimeout)
    }
  }

  const handlePrevImage = () => {
    handleManualImageChange(
      currentImageIndex === 0 ? galleryMedia.length - 1 : currentImageIndex - 1
    )
  }

  const handleNextImage = () => {
    handleManualImageChange(
      currentImageIndex === galleryMedia.length - 1 ? 0 : currentImageIndex + 1
    )
  }

  const handleManualSimilarChange = (newIndex: number) => {
    // Temporarily pause autoplay when user interacts
    setIsSimilarAutoPlaying(false)
    setSimilarIndex(newIndex)

    // Resume autoplay after 10 seconds of inactivity
    const resumeTimeout = setTimeout(() => {
      setIsSimilarAutoPlaying(true)
    }, 10000)

    return () => clearTimeout(resumeTimeout)
  }

  const handleGoBack = () => {
    router.back()
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!user) {
      router.push(`/login?redirect=/listing/${propertyId}&action=favorite`)
      return
    }

    if (isFavorite) {
      removeFromFavoritesMutation.mutate(
        { propertyId },
        {
          onSuccess: () => setIsFavorite(false),
        }
      )
    } else {
      savePropertyMutation.mutate(
        { propertyId },
        {
          onSuccess: () => setIsFavorite(true),
        }
      )
    }
  }

  // Fetch all properties
  const { data: allPropertiesResponse } = useGetPropertyListings()
  const allProperties = allPropertiesResponse?.data || []

  // Filter similar properties (excluding the current one)
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, '')
      .trim()

  const getLocationParts = (location: string | undefined) => {
    if (!location) return []
    return location
      .split(',')
      .map((p) =>
        p
          .toLowerCase()
          .replace(/[^a-z0-9\s]/gi, '')
          .trim()
      )
      .filter(Boolean)
  }

  const locationsOverlap = (
    locA: string | undefined,
    locB: string | undefined
  ) => {
    const partsA = getLocationParts(locA)
    const partsB = getLocationParts(locB)
    return partsA.some((part) => partsB.includes(part))
  }

  const similarProperties = property
    ? allProperties
        .filter((p) => {
          if (p.id === property.id) return false

          let matchCount = 0

          // Location: overlap on any part (city, area, etc)
          if (locationsOverlap(p.location, property.location)) matchCount++

          // Developer: robust check
          if (
            p.developer?._id &&
            property.developer?._id &&
            p.developer._id === property.developer._id
          )
            matchCount++

          // Bedrooms: allow +/- 1 bedroom as similar
          if (
            typeof p.bedrooms === 'number' &&
            typeof property.bedrooms === 'number' &&
            Math.abs(p.bedrooms - property.bedrooms) <= 1
          )
            matchCount++

          // Property type: optional, but can help
          if (
            p.propertyType &&
            property.propertyType &&
            p.propertyType.toLowerCase() === property.propertyType.toLowerCase()
          )
            matchCount++

          // Optionally, define match variables for debugging
          const locationMatch = locationsOverlap(p.location, property.location)
          const developerMatch =
            p.developer?._id &&
            property.developer?._id &&
            p.developer._id === property.developer._id
          const bedroomsMatch =
            typeof p.bedrooms === 'number' &&
            typeof property.bedrooms === 'number' &&
            Math.abs(p.bedrooms - property.bedrooms) <= 1
          const typeMatch =
            p.propertyType &&
            property.propertyType &&
            p.propertyType.toLowerCase() === property.propertyType.toLowerCase()

          console.log({
            id: p.id,
            name: p.name,
            location: p.location,
            propertyLocation: property.location,
            locationParts: {
              p: getLocationParts(p.location),
              property: getLocationParts(property.location),
            },
            locationMatch,
            developerMatch,
            bedroomsMatch,
            typeMatch,
            matchCount,
          })
          // At least 2 out of 4 criteria
          return matchCount >= 2
        })
        .slice(0, 4)
    : []
  const [similarIndex, setSimilarIndex] = useState(0)
  const visibleCount = 2 // Number of cards visible at once (adjust for desktop/mobile)
  const maxIndex = Math.max(0, similarProperties.length - visibleCount)
  const handleActionClick = (action: string, e: React.MouseEvent) => {
    e.preventDefault()

    if (!user) {
      // Store the intended action and property ID in query params
      router.push(`/login?redirect=/listing/${propertyId}&action=${action}`)
      return
    }

    // If authenticated, navigate to the appropriate page
    switch (action) {
      case 'contact':
        router.push(`/listings/${propertyId}/contact`)
        break
      case 'mortgage':
        router.push(`/listings/${propertyId}/mortgage`)
        break
      default:
        // Do nothing, stay on the page
        break
    }
  }

  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: property?.name || 'Property Listing',
          text: `Check out this property: ${property?.name}`,
          url: window.location.href,
        })
        .catch(() => {
          // Fallback if share fails
          toast.success('Link copied to clipboard!')
          navigator.clipboard.writeText(window.location.href)
        })
    } else {
      // Fallback for browsers that don't support sharing
      toast.success('Link copied to clipboard!')
      navigator.clipboard.writeText(window.location.href)
    }
  }

  // Calculate down payment amount
  const downPaymentAmount =
    property
      ? (property.price * (property.minDownPaymentPercent || 30)) / 100
      : 0

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Handle video playback state
  useEffect(() => {
    // If current media is a video, pause auto-slideshow
    if (isCurrentMediaVideo) {
      setIsGalleryAutoPlaying(false)
      setIsVideoPlaying(true)
    }
  }, [currentImageIndex, isCurrentMediaVideo])

  // Image gallery auto slideshow
  useEffect(() => {
    let slideInterval: NodeJS.Timeout | undefined

    // Only auto-play if enabled and current media is not a video
    if (
      isGalleryAutoPlaying &&
      !isCurrentMediaVideo &&
      galleryMedia.length > 1
    ) {
      slideInterval = setInterval(() => {
        // Find next non-video index if possible
        let nextIndex = currentImageIndex
        let loopCount = 0
        const maxLoops = galleryMedia.length // Prevent infinite loop

        do {
          nextIndex = (nextIndex + 1) % galleryMedia.length
          loopCount++

          // If we've checked all items and they're all videos, just move to next
          if (loopCount >= maxLoops) {
            break
          }
        } while (
          galleryMedia[nextIndex]?.endsWith('.mp4') &&
          loopCount < maxLoops
        )

        setCurrentImageIndex(nextIndex)
      }, 5000)
    }

    return () => {
      if (slideInterval) clearInterval(slideInterval)
    }
  }, [
    isGalleryAutoPlaying,
    galleryMedia.length,
    currentImageIndex,
    isCurrentMediaVideo,
  ])

  // Similar properties auto slideshow
  useEffect(() => {
    let similarInterval: NodeJS.Timeout | undefined

    if (isSimilarAutoPlaying && similarProperties.length > visibleCount) {
      similarInterval = setInterval(() => {
        setSimilarIndex((prevIndex) => {
          // If we're at the max index, loop back to 0
          if (prevIndex >= maxIndex) {
            return 0
          }
          // Otherwise, advance to the next index
          return prevIndex + 1
        })
      }, 7000) // Slightly longer interval than the image gallery
    }

    return () => {
      if (similarInterval) clearInterval(similarInterval)
    }
  }, [isSimilarAutoPlaying, similarProperties.length, maxIndex, visibleCount])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f1f1f1] overflow-hidden">
        {/* <Header /> */}
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#546B2F] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f1f1f1] overflow-hidden">
        {/* <Header /> */}
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Property
          </h2>
          <p className="mb-6">{error || 'Property not found'}</p>
          <Button
            onClick={handleGoBack}
            className="bg-[#546B2F] hover:bg-green-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f1f1] overflow-hidden">
      {/* <Header /> */}

      <main className="flex-grow container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Back button and breadcrumb */}
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            className="p-0 mr-2 hover:bg-transparent"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-5 w-5 text-[#546B2F]" />
          </Button>
          <div className="text-sm text-gray-500">
            <span
              className="hover:underline cursor-pointer"
              onClick={() => router.push('/applicant')}
            >
              Listings
            </span>
            <span className="mx-2">/</span>
            <span className="text-[#546B2F]">{property.name}</span>
          </div>
        </div>

        {/* Property title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {property.name}
            </h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1 text-[#546B2F]" />
              <span>{property.location}</span>
              <div className="flex items-center ml-4">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span>{property.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            <Button
              variant="outline"
              className="border-[#546B2F] text-[#546B2F] hover:bg-[#546B2F] hover:text-white"
              onClick={(e) => toggleFavorite(e)}
              disabled={
                savePropertyMutation.isPending ||
                removeFromFavoritesMutation.isPending
              }
            >
              <Heart
                className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-[#546B2F]' : ''}`}
              />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
            <Button
              variant="outline"
              className="border-[#546B2F] text-[#546B2F] hover:bg-[#546B2F] hover:text-white"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Property image gallery */}
        <div className="relative mb-8 bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="relative h-[300px] md:h-[500px] w-full">
            <AnimatePresence initial={false} custom={currentImageIndex}>
              <motion.div
                key={currentImageIndex}
                custom={currentImageIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  duration: 0.5,
                }}
                className="absolute inset-0"
              >
                {galleryMedia[currentImageIndex]?.endsWith('.mp4') ? (
                  <video
                    src={galleryMedia[currentImageIndex]}
                    controls
                    autoPlay
                    className="object-cover w-full h-full"
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: 'inherit',
                    }}
                    onPlay={() => {
                      setIsVideoPlaying(true)
                      setIsGalleryAutoPlaying(false)
                    }}
                    onPause={() => setIsVideoPlaying(false)}
                    onEnded={() => {
                      setIsVideoPlaying(false)
                      // Move to next item after video ends
                      handleNextImage()
                      // Resume auto-slideshow
                      setIsGalleryAutoPlaying(true)
                    }}
                  />
                ) : (
                  <Image
                    src={galleryMedia[currentImageIndex] || '/placeholder.svg'}
                    alt={property.name}
                    fill
                    className="object-cover"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Popular badge */}
            <div className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-semibold px-3 py-1 rounded-full">
              Popular
            </div>

            {/* Favorite button */}
            <button
              className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md hover:scale-110 transition"
              onClick={(e) => toggleFavorite(e)}
              disabled={
                savePropertyMutation.isPending ||
                removeFromFavoritesMutation.isPending
              }
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`}
              />
            </button>

            {/* Image navigation buttons */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 transition-transform duration-200 hover:scale-110"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 transition-transform duration-200 hover:scale-110"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {propertyMedia.length}
            </div>
          </div>

          {/* Thumbnail gallery */}
          <div className="flex overflow-x-auto p-4 gap-2 bg-white">
            {galleryMedia.map((media, index) => {
              const isVideo = media.endsWith('.mp4')
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`relative h-16 w-24 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 ${
                    index === currentImageIndex
                      ? 'border-[#546B2F]'
                      : 'border-transparent'
                  }`}
                  onClick={() => handleManualImageChange(index)}
                >
                  {isVideo ? (
                    <>
                      <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center">
                        <div className="bg-white/80 rounded-full p-1">
                          <Play className="h-4 w-4 text-[#546B2F] fill-[#546B2F]" />
                        </div>
                      </div>
                      <video
                        src={media}
                        className="object-cover h-full w-full"
                      />
                    </>
                  ) : (
                    <Image
                      src={media || '/placeholder.svg?height=120&width=160'}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Property details grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Left column - Property details */}
          <div className="md:col-span-2 space-y-6">
            {/* Key details */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Bed className="h-6 w-6 text-[#546B2F] mb-2" />
                  <span className="text-sm text-gray-500">Bedrooms</span>
                  <span className="font-semibold">{property.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Home className="h-6 w-6 text-[#546B2F] mb-2" />
                  <span className="text-sm text-gray-500">Property Type</span>
                  <span className="font-semibold">{property.propertyType}</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-[#546B2F] mb-2" />
                  <span className="text-sm text-gray-500">Location</span>
                  <span className="font-semibold">{property.location}</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-[#546B2F] mb-2" />
                  <span className="text-sm text-gray-500">Listed</span>
                  <span className="font-semibold">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <div className="text-gray-700 leading-relaxed max-w-2xl space-y-3 text-base">
                {property.description
                  .split('\n')
                  .filter(Boolean)
                  .map((para, idx) => (
                    <p key={idx} className="mb-0">
                      {para.trim()}
                    </p>
                  ))}
              </div>
            </div>

            {/* Tags/Features */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">Features & Amenities</h2>

              {/* Tags section */}
              <div className="flex flex-wrap gap-2 mb-6">
                {property.tags && property.tags.length > 0 ? (
                  property.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#546B2F] text-white text-[8px] font-semibold px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="bg-[#546B2F] text-white text-[8px] font-semibold px-2 py-1 rounded-full">
                      24/7 Security
                    </span>
                    <span className="bg-[#546B2F] text-white text-[8px] font-semibold px-2 py-1 rounded-full">
                      Swimming Pool
                    </span>
                    <span className="bg-[#546B2F] text-white text-[8px] font-semibold px-2 py-1 rounded-full">
                      Gym
                    </span>
                    <span className="bg-[#546B2F] text-white text-[8px] font-semibold px-2 py-1 rounded-full">
                      Parking Space
                    </span>
                  </>
                )}
              </div>

              {/* Detailed amenities */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#546B2F] mr-2" />
                  <span>24/7 Security</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#546B2F] mr-2" />
                  <span>Swimming Pool</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#546B2F] mr-2" />
                  <span>Gym</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#546B2F] mr-2" />
                  <span>Parking Space</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#546B2F] mr-2" />
                  <span>Garden</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-[#546B2F] mr-2" />
                  <span>Power Backup</span>
                </div>
              </div>
            </div>

            {/* Location map placeholder */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">Location</h2>
              <div className="h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map view of {property.location}</p>
              </div>
              <p className="mt-3 text-gray-700">{property.location}</p>
            </div>
          </div>

          {/* Right column - Pricing and contact */}
          <div className="space-y-6">
            {/* Pricing card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-transform hover:scale-105 duration-300 sticky top-4">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(property.price)}
                </h2>
                <p className="text-gray-600">
                  {formatCurrency(property.minMonthlyPayment)} monthly payment
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Down Payment ({property.minDownPaymentPercent}%)
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(downPaymentAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Payment</span>
                  <span className="font-semibold">
                    {formatCurrency(property.minMonthlyPayment)}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 text-right">
                  ({property.minDownPaymentPercent}%)
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button
                  className="w-full bg-[#7C0A02] hover:bg-[#600000]"
                  onClick={(e) => handleActionClick('mortgage', e)}
                >
                  Apply for Mortgage
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-black text-black hover:bg-black hover:text-white"
                  onClick={(e) => handleActionClick('contact', e)}
                >
                  Contact Agent
                </Button>
              </div>

              <div className="mt-6 text-center flex flex-col items-center">
                {property.developer?.companyLogo && (
                  <Image
                    src={property.developer.companyLogo || '/placeholder.svg'}
                    alt={property.developer.companyName}
                    width={40}
                    height={40}
                    className="rounded-full mb-2"
                  />
                )}
                <p className="text-sm text-gray-500">
                  Listed by {property.developer?.companyName || 'Her Homes'}
                </p>
              </div>
            </div>

            {/* Similar properties teaser */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">Similar Properties</h2>
              {similarProperties.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No similar properties found.
                </p>
              ) : (
                <div className="relative">
                  {/* Arrow buttons */}
                  {similarProperties.length > visibleCount && (
                    <>
                      <motion.button
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                        onClick={() =>
                          handleManualSimilarChange(
                            Math.max(0, similarIndex - 1)
                          )
                        }
                        disabled={similarIndex === 0}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0.6 }}
                        animate={{
                          opacity: similarIndex === 0 ? 0.4 : 1,
                          x: similarIndex === 0 ? -5 : 0,
                        }}
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-800" />
                      </motion.button>
                      <motion.button
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                        onClick={() =>
                          handleManualSimilarChange(
                            Math.min(maxIndex, similarIndex + 1)
                          )
                        }
                        disabled={similarIndex === maxIndex}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0.6 }}
                        animate={{
                          opacity: similarIndex === maxIndex ? 0.4 : 1,
                          x: similarIndex === maxIndex ? 5 : 0,
                        }}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-800" />
                      </motion.button>
                    </>
                  )}
                  <div className="overflow-hidden">
                    <motion.div
                      className="flex gap-4"
                      animate={{
                        x: `-${similarIndex * 280}px`,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        duration: 0.5,
                      }}
                      style={{
                        minWidth: `${similarProperties.length * 260}px`,
                      }}
                    >
                      {similarProperties.map((simProp, idx) => (
                        <motion.div
                          key={simProp.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale:
                              idx >= similarIndex &&
                              idx < similarIndex + visibleCount
                                ? 1
                                : 0.95,
                          }}
                          transition={{
                            delay: idx * 0.1,
                            duration: 0.3,
                          }}
                          whileHover={{
                            scale: 1.03,
                            y: -5,
                            transition: { duration: 0.2 },
                          }}
                          className="min-w-[260px] max-w-[260px] bg-gray-50 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 flex-shrink-0 flex flex-col"
                        >
                          <div
                            className="relative h-36 w-full rounded-t-xl overflow-hidden cursor-pointer"
                            onClick={() =>
                              router.push(`/applicant/listing/${simProp.id}`)
                            }
                          >
                            {simProp.images?.[0]?.endsWith('.mp4') ? (
                              <>
                                <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center">
                                  <div className="bg-white/80 rounded-full p-2">
                                    <Play className="h-5 w-5 text-[#546B2F] fill-[#546B2F]" />
                                  </div>
                                </div>
                                <video
                                  src={simProp.images[0]}
                                  className="object-cover h-full w-full"
                                />
                              </>
                            ) : (
                              <Image
                                src={
                                  simProp.images?.[0] ||
                                  '/placeholder.svg?height=120&width=160' ||
                                  '/placeholder.svg'
                                }
                                alt={simProp.name}
                                fill
                                className="object-cover"
                              />
                            )}
                            {simProp.developer?.companyLogo && (
                              <Image
                                src={
                                  simProp.developer.companyLogo ||
                                  '/placeholder.svg'
                                }
                                alt={simProp.developer.companyName}
                                width={32}
                                height={32}
                                className="absolute top-2 right-2 rounded-full border-2 border-white shadow"
                              />
                            )}
                          </div>
                          <div className="p-3 flex flex-col flex-grow">
                            <h3 className="font-semibold text-base mb-1 truncate">
                              {simProp.name}
                            </h3>
                            <div className="flex items-center text-xs text-gray-500 mb-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate">
                                {simProp.location}
                              </span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mb-1">
                              <Bed className="h-3 w-3 mr-1" />
                              <span>
                                {simProp.bedrooms} Bed
                                {simProp.bedrooms > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="text-[#546B2F] font-bold text-lg mb-2">
                              {formatCurrency(simProp.price)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              )}
              <div className="flex justify-end mt-2">
                <Button variant="link" className="text-[#546B2F] p-0 h-auto">
                  View more similar properties
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
