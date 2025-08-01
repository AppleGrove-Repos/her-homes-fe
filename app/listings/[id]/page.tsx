'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import CustomShareButton from '@/components/common/button/CustomShareButton'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft,
  MapPin,
  Bed,
  Home,
  Calendar,
  Heart,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  Bath,
  Car,
  Shield,
  Headphones,
  MessageCircle,
  Phone,
  Award,
  Landmark,
  LandPlot,
  ChefHat,
  Play,
  Share,
} from 'lucide-react'
import { getFeatureIcon, getSpecificationIcon, formatTextForDisplay } from '@/lib/utils/icon-utils'
import { Button } from '@/components/ui/button'
import Header from '@/components/landing/header'
import Footer from '@/components/landing/footer'
import { useAuth } from '@/lib/store/auth.store'
import {
  useGetProperties,
  useSaveProperty,
  useRemoveFromFavorites,
  useGetPropertiesByType,
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
  const [isGalleryAutoPlaying, setIsGalleryAutoPlaying] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { user } = useAuth()

  // Helper function to format feature names
  const formatFeatureName = (feature: string) => {
    return formatTextForDisplay(feature)
  }

  // Helper function to format specification names
  const formatSpecificationName = (specName: string) => {
    return formatTextForDisplay(specName)
  }

  // Helper function to format property type for display
  const formatPropertyType = (propertyType: string) => {
    if (!propertyType) return ''
    return propertyType.charAt(0).toUpperCase() + propertyType.slice(1).toLowerCase()
  }

  const propertyId = params.id as string

  // Use React Query hooks - no auth required for viewing property details
  const {
    data: propertyResponse,
    isLoading,
    error: queryError,
  } = useGetProperties(propertyId)

  const property = propertyResponse?.data
  const error = queryError ? (queryError as Error).message : null

  // Fetch similar properties with the same property type
  const {
    data: similarPropertiesResponse,
    isLoading: similarPropertiesLoading,
    error: similarPropertiesError,
  } = useGetPropertiesByType(property?.propertyType || '', property?._id)

  const similarProperties = similarPropertiesResponse?.data || []
  
  // Only show similar properties section if we have a property type
  const shouldShowSimilarProperties = property?.propertyType

  // Console log to see the data
  console.log('Property Data:', property)
  console.log('Features:', property?.features)
  console.log('Specifications:', property?.specifications)
  console.log('Similar Properties:', similarProperties)
  console.log('Property Type:', property?.propertyType)
  console.log('Similar Properties Loading:', similarPropertiesLoading)
  console.log('Similar Properties Length:', similarProperties.length)
  console.log('Should Show Similar Properties:', shouldShowSimilarProperties)

  // These mutations require authentication
  const savePropertyMutation = useSaveProperty()
  const removeFromFavoritesMutation = useRemoveFromFavorites()

  const propertyMedia = [
    ...(property?.images || []),
    ...(property?.videos || []),
  ]

  // For demo purposes, using placeholder images if property has no images
  const galleryMedia = propertyMedia.length
    ? propertyMedia
    : [
        '/placeholder.svg?height=600&width=800',
        '/placeholder.svg?height=600&width=800',
        '/placeholder.svg?height=600&width=800',
        '/placeholder.svg?height=600&width=800',
        '/placeholder.svg?height=600&width=800',
      ]
  const isCurrentMediaVideo = galleryMedia[currentImageIndex]?.endsWith('.mp4')

  const visibleCount = 3 // Number of cards visible at once
  // const maxIndex = Math.max(0, similarProperties.length - visibleCount)

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

  const toggleSimilarPropertyFavorite = (e: React.MouseEvent, similarPropertyId: string) => {
    e.stopPropagation()
    if (!user) {
      router.push(`/login?redirect=/listings/${propertyId}&action=favorite`)
      return
    }

    // For now, just log the action. You can implement the actual favorite toggle logic here
    console.log('Toggle favorite for similar property:', similarPropertyId)
    toast.success('Favorite functionality for similar properties coming soon!')
  }

  const handleActionClick = (action: string, e: React.MouseEvent) => {
    e.preventDefault()
     if (!user) {
       router.push(`/login?redirect=/listings/${propertyId}&action=${action}`)
       return
     }
    // No need to check for !user, since this is the authenticated page
    switch (action) {
      case 'contact':
        router.push(`/listings/${propertyId}/contact`)
        break
      case 'mortgage':
        router.push(`/listings/${propertyId}/mortgage`)
        break
      case 'callback':
        router.push(`/listings/${propertyId}/callback`)
        break
      default:
        break
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: property?.title || property?.name || 'Property Listing',
          text: `Check out this property: ${property?.title || property?.name || 'Property'}`,
          url: window.location.href,
        })
        .catch(() => {
          toast.success('Link copied to clipboard!')
          navigator.clipboard.writeText(window.location.href)
        })
    } else {
      toast.success('Link copied to clipboard!')
      navigator.clipboard.writeText(window.location.href)
    }
  }
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
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white overflow-hidden">
        <Header />
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
      <div className="flex min-h-screen flex-col bg-white overflow-hidden">
        <Header />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Property
          </h2>
          <p className="mb-6">{error || 'Property not found'}</p>
          <Button onClick={handleGoBack} className="bg-[#546B2F]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  // Calculate down payment amount
  const downPaymentAmount =
    (property.price * (property.minDownPaymentPercent || 30)) / 100

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white overflow-hidden">
      <Header />

      <main className="flex-grow bg-[#F5F5F0]">
        {/* Back button */}
        <div className=" px-6 py-4 flex items-center justify-between mx-0 md:mx-24">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              className="p-0 mr-2 hover:bg-transparent"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-5 w-5 text-[#64111F]" />
            </Button>
            <div className="text-[12px] text-[#64111F]">
              <span
                className="hover:underline cursor-pointer"
                onClick={() => router.push('/listings')}
              >
                Listings
              </span>
              <span className="mx-2">/</span>
                              <span className="text-[#64111F]">{property.title || property.name || ''}</span>
            </div>
          </div>
          {/* <Button
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent max-w-[100px]"
            onClick={handleShare}
            type="button"
          >
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button> */}
          <CustomShareButton onClick={handleShare} />
        </div>

        {/* Main content container */}
        <div className="px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Top section: Image + Property Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Left: Main Image with thumbnails overlaid at bottom */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl overflow-hidden">
                  {/* Main image with overlaid thumbnails */}
                  <div className="relative h-[400px] md:h-[500px] w-full">
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
                            src={
                              galleryMedia[currentImageIndex] ||
                              '/placeholder.svg?height=600&width=800'
                            }
                            alt={property.title || property.name || ''}
                            fill
                            className="object-cover"
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                    {/* Image navigation buttons */}
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md"
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-800" />
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="h-5 w-5 text-gray-800" />
                    </button>

                    {/* Thumbnail gallery overlaid at bottom */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex gap-2 overflow-x-auto">
                        {galleryMedia.map((media, index) => {
                          const isVideo = media.endsWith('.mp4')
                          return (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              className={`relative h-16 w-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 ${
                                index === currentImageIndex
                                  ? 'border-white'
                                  : 'border-white/50'
                              } shadow-lg`}
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
                                  src={
                                    media ||
                                    '/placeholder.svg?height=120&width=160'
                                  }
                                  alt={`Thumbnail ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </motion.div>
                          )
                        })}
                        {/* {galleryMedia.slice(0, 5).map((image, index) => (
                          <div
                            key={index}
                            className={`relative h-16 w-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 ${
                              index === currentImageIndex
                                ? 'border-white'
                                : 'border-white/50'
                            } shadow-lg`}
                            onClick={() => setCurrentImageIndex(index)}
                          >
                            <Image
                              src={
                                image || '/placeholder.svg?height=120&width=160'
                              }
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover w-full h-full"
                              sizes="80px"
                            />
                          </div>
                        ))} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Property Details Card */}
              <div className="bg-white p-8 rounded-2xl h-[500px]">
                <h1 className="text-2xl font-medium text-gray-900 mb-2">
                  {property.title || property.name || 'Property Title'}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin
                    className="h-4 w-4 text-[#546B2F] mr-2"
                    strokeWidth={4}
                  />
                  <span className="text-sm">{property.propertyAddress || property.location || 'Location not specified'}</span>
                </div>

                <div className="text-3xl font-medium text-[#546B2F] mb-6">
                  ₦{property.price?.toLocaleString() || 'N/A'}
                </div>

                <div className="flex flex-col gap-3 mb-6 sm:flex-row">
                  <Button
                    className="flex-1 bg-[#7C0A02] hover:bg-[#600000] text-white"
                    onClick={(e) => handleActionClick('mortgage', e)}
                  >
                    <Home className="h-4 w-4 mr-2" strokeWidth={4} />
                    Apply for Mortgage
                  </Button>
                  <div className="flex flex-1 gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 w-7 text-[#546B2F] text-[11px] hover:bg-gray-50 bg-transparent"
                      onClick={(e) => toggleFavorite(e)}
                    >
                      <Heart
                        className={`h-2 w-2 mr-2 ${
                          isFavorite ? 'fill-current text-red-500' : ''
                        }`}
                        strokeWidth={3}
                      />
                      Save Property
                    </Button>
                  </div>
                </div>

                {/* Property specs */}
                <div className="grid grid-rows-2 gap-4 text-sm">
                  {property.specifications && typeof property.specifications === 'object' ? (
                    Object.entries(property.specifications)
                      .slice(0, 4)
                      .map(([specName, specValue], index) => (
                        <div key={index} className="flex items-center">
                          {getSpecificationIcon(specName)}
                          <span>{formatSpecificationName(specName)}: {specValue}</span>
                        </div>
                      ))
                  ) : (
                    // Fallback to basic specs if no specifications object
                    <>
                      <div className="flex items-center">
                        <Bed
                          className="h-4 w-4 text-[#546B2F] mr-2"
                          strokeWidth={3}
                        />
                        <span>{property.bedrooms || 0} Bedrooms</span>
                      </div>
                      <div className="flex items-center">
                        <Home
                          className="h-4 w-4 text-[#546B2F] mr-2"
                          strokeWidth={3}
                        />
                        <span>N/A</span>
                      </div>
                      <div className="flex items-center">
                        <Bath
                          className="h-4 w-4 text-[#546B2F] mr-2"
                          strokeWidth={3}
                        />
                        <span>N/A</span>
                      </div>
                      <div className="flex items-center">
                        <Car
                          className="h-4 w-4 text-[#546B2F] mr-2"
                          strokeWidth={3}
                        />
                        <span>N/A</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Main content area with sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Main content sections */}
              <div className="lg:col-span-2 space-y-8">
                {/* Property Overview */}
                <div className="bg-white p-6 rounded-2xl">
                  <h2 className="text-xl font-semibold mb-6">
                    Property Overview
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Property Type */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center mx-auto mb-3">
                        <Home className="h-6 w-6 text-[#546B2F]" />
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Property Type
                      </p>
                      <p className="font-medium">{property.propertyType || 'N/A'}</p>
                    </div>
                    
                    {/* First 3 available features from the object */}
                    {property.features && typeof property.features === 'object' ? (
                      Object.entries(property.features)
                        .filter(([_, isAvailable]) => isAvailable)
                        .slice(0, 3)
                        .map(([feature, isAvailable], index) => (
                          <div key={index} className="text-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                              {getFeatureIcon(feature)}
                            </div>
                            <p className="text-sm text-gray-500 mb-1">
                              {formatFeatureName(feature)}
                            </p>
                            {/* <p className="font-medium">Available</p> */}
                          </div>
                        ))
                    ) : (
                      // If no features object, show placeholder features
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={`placeholder-${index}`} className="text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Star className="h-6 w-6 text-gray-600" />
                          </div>
                          <p className="text-sm text-gray-500 mb-1">
                            Feature {index + 1}
                          </p>
                          <p className="font-medium">N/A</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Mortgage & Pricing */}
                <div className="bg-white p-6 rounded-2xl">
                  <h2 className="text-xl font-semibold mb-6">
                    Mortgage & Pricing
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Price</span>
                        <span className="font-semibold">₦{property.price?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Down Payment ({property.minDownPaymentPercent || 0}%)
                        </span>
                        <span className="font-semibold">₦{downPaymentAmount?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="text-[#546B2F] text-sm font-medium">
                        Pre-qualified Available
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Monthly Payment</span>
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option>10 years</option>
                          <option>15 years</option>
                          <option>20 years</option>
                        </select>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        ₦{property.minMonthlyPayment?.toLocaleString() || 'N/A'}/month
                      </div>
                      <Button className="w-full bg-[#7C0A02] hover:bg-[#600000]">
                        Check Your Eligibility
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Property Description */}
                <div className="bg-white p-6 rounded-2xl">
                  <h2 className="text-xl font-semibold mb-4">
                    Property Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {property.propertyDescription || property.description || 'No description available.'}
                  </p>

                  {property.features && typeof property.features === 'object' && Object.keys(property.features).length > 0 && (
                    <>
                      <h3 className="font-semibold mb-4">Key Features</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {Object.entries(property.features)
                          .filter(([_, isAvailable]) => isAvailable)
                          .map(([feature, isAvailable], index) => (
                            <div key={index} className="flex items-center">
                              <Check className="h-4 w-4 text-[#546B2F] mr-3" />
                              <span className="text-sm capitalize">{formatFeatureName(feature)}</span>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Neighborhood */}
                <div className="bg-white p-6 rounded-2xl">
                  <h2 className="text-xl font-semibold mb-4">Neighborhood</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {property.neighborhoodDescription || 'No neighborhood description available.'}
                  </p>
                  {property.nearbyLandmark && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Nearby Landmarks</h3>
                      <p className="text-gray-600 text-sm">{property.nearbyLandmark}</p>
                    </div>
                  )}
                </div>

                {/* Location & Map */}
                <div className="bg-white p-6 rounded-2xl">
                  <h2 className="text-xl font-semibold mb-6">Location & Map</h2>
                  <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-[#546B2F] mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">
                        Interactive Map
                      </p>
                      <p className="text-sm text-gray-500">
                        {property.propertyAddress || property.location || 'Location not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-[#546B2F] rounded-full mr-3"></div>
                        <span className="text-sm">
                          Corona Schools - 5 min drive
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-[#546B2F] rounded-full mr-3"></div>
                        <span className="text-sm">
                          Palms Shopping Mall - 10 min drive
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-[#546B2F] rounded-full mr-3"></div>
                        <span className="text-sm">
                          Reddington Hospital - 8 min drive
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-[#546B2F] rounded-full mr-3"></div>
                        <span className="text-sm">
                          Lekki-Epe Expressway - 2 min drive
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Sidebar */}
              <div className="space-y-6">
                {/* Contact Agent */}
                <div className="bg-white p-6 rounded-2xl">
                  <h3 className="font-semibold mb-4">Contact Agent</h3>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 overflow-hidden">
                      {property.developer?.companyLogo ? (
                        <Image
                          src={property.developer.companyLogo}
                          alt={
                            property.developer.companyName || 'Developer Logo'
                          }
                          width={48}
                          height={48}
                          className="object-cover rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 overflow-hidden flex items-center justify-center">
                          <Image
                            src="/placeholder.svg?height=48&width=48"
                            alt="No Logo"
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {' '}
                        {property.developer?.companyName || 'Unknown Company'}
                      </p>
                      {property.developer?.isVerified && (
                        <p className="text-sm text-gray-600 flex items-center">
                          Verified Her Homes Partner
                          <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#546B2F]">
                            <Check
                              className="h-3 w-3 text-white"
                              strokeWidth={3}
                            />
                          </span>
                        </p>
                      )}
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-3 w-3 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          4.9 (127 reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      className="w-full bg-[#7C0A02] text-[12px] hover:bg-[#600000]"
                      onClick={(e) => handleActionClick('contact', e)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent text-[12px] border-[#546B2F] text-[#546B2F] hover:bg-gray-50"
                      onClick={(e) => handleActionClick('callback', e)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Request Callback
                    </Button>
                  </div>
                </div>

                {/* Share Button */}
                {/* <div className="bg-white p-6 rounded-2xl flex items-center justify-center">
                  <Button
                    className="w-full bg-[#546B2F] hover:bg-[#3d4e22] text-white"
                    onClick={handleShare}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 8a3 3 0 11-6 0 3 3 0 016 0zm6 8a3 3 0 11-6 0 3 3 0 016 0zm-6 4v-4m0 0V8m0 4H9m6 0h-6"
                      />
                    </svg>
                    Share
                  </Button>
                </div> */}

                {/* Similar Properties */}
                {shouldShowSimilarProperties && (
                  <div className="bg-white p-6 rounded-2xl">
                    <h3 className="font-semibold mb-2">Similar Properties</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Other {formatPropertyType(property?.propertyType || '')}s you might like
                    </p>
                    {similarPropertiesLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : similarPropertiesError ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">Unable to load similar properties</p>
                      </div>
                    ) : similarProperties.length > 0 ? (
                      <div className="space-y-4">
                        {similarProperties.map((similarProperty) => (
                          <div
                            key={similarProperty._id}
                            className="block cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-lg p-2 -m-2"
                            onClick={() => router.push(`/listings/${similarProperty._id}`)}
                          >
                            <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3">
                                                          <Image
                              src={similarProperty.images?.[0] || "/placeholder.svg?height=200&width=300"}
                              alt={similarProperty.title || similarProperty.name || 'Property'}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=200&width=300"
                              }}
                            />
                              {/* Heart icon for favorites */}
                              <button
                                className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
                                onClick={(e) => toggleSimilarPropertyFavorite(e, similarProperty._id)}
                              >
                                <Heart className="h-3 w-3 text-gray-600 hover:text-red-500" />
                              </button>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm hover:text-[#546B2F] transition-colors">
                                {similarProperty.title || similarProperty.name}
                              </h4>
                              <div className="flex items-center text-xs text-gray-500 mb-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{similarProperty.propertyAddress || similarProperty.location}</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">
                                ₦{formatCurrency(similarProperty.price)}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                {similarProperty.specifications?.bedrooms && (
                                  <div className="flex items-center">
                                    <Bed className="h-3 w-3 mr-1" />
                                    <span>{similarProperty.specifications.bedrooms}</span>
                                  </div>
                                )}
                                {similarProperty.specifications?.bathrooms && (
                                  <div className="flex items-center">
                                    <Bath className="h-3 w-3 mr-1" />
                                    <span>{similarProperty.specifications.bathrooms}</span>
                                  </div>
                                )}
                                {similarProperty.specifications?.area && (
                                  <div className="flex items-center">
                                    <Home className="h-3 w-3 mr-1" />
                                    <span>{similarProperty.specifications.area} sqm</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {similarProperties.length > 0 && (
                          <div className="pt-4 border-t border-gray-100">
                            <Button
                              variant="outline"
                              className="w-full text-sm"
                              onClick={() => router.push(`/listings?propertyType=${property?.propertyType}`)}
                            >
                              View All {formatPropertyType(property?.propertyType || '')}s
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">No similar properties found</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Service Cards */}
                <div className="space-y-4">
                  <div className="bg-gray-800 text-white p-6 rounded-2xl">
                    <Shield className="h-8 w-8 mb-4" />
                    <h3 className="font-semibold mb-2">Verified Properties</h3>
                    <p className="text-sm text-gray-300">
                      We list only thoroughly vetted homes — verified documents,
                      trusted developers, and safe locations.
                    </p>
                  </div>
                  <div className="bg-[#546B2F] text-white p-6 rounded-2xl">
                    <Headphones className="h-8 w-8 mb-4" />
                    <h3 className="font-semibold mb-2">Reliable Support</h3>
                    <p className="text-sm text-green-100">
                      Need help? Our team is here to guide you through every
                      step — from search to signing.
                    </p>
                  </div>
                  <div className="bg-[#7C0A02] text-white p-6 rounded-2xl">
                    <Award className="h-8 w-8 mb-4" />
                    <h3 className="font-semibold mb-2">Trusted Partners</h3>
                    <p className="text-sm text-red-100">
                      We work with top banks and developers to give you secure
                      financing and quality homes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
