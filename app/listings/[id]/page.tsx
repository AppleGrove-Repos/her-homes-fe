'use client'

import type React from 'react'

import { useState } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Header from '@/components/landing/header'
import Footer from '@/components/landing/footer'
import { useAuth } from '@/lib/services/use-auth-mynobrain'
import {
  useGetProperty,
  useSaveProperty,
  useRemoveFromFavorites,
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
  const [isFavorite, setIsFavorite] = useState(false)
  const { isAuthenticated } = useAuth()
  const propertyId = params.id as string

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
  const propertyImages = property?.images?.length
    ? property.images
    : [
        '/placeholder.svg?height=600&width=800',
        '/placeholder.svg?height=600&width=800',
        '/placeholder.svg?height=600&width=800',
      ]

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? propertyImages.length - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === propertyImages.length - 1 ? 0 : prev + 1
    )
  }

  const handleGoBack = () => {
    router.back()
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!isAuthenticated) {
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

  const handleActionClick = (action: string, e: React.MouseEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      // Store the intended action and property ID in query params
      router.push(`/login?redirect=/listing/${propertyId}&action=${action}`)
      return
    }

    // If authenticated, navigate to the appropriate page
    switch (action) {
      case 'contact':
        router.push(`/user/listings/${propertyId}/contact`)
        break
      case 'mortgage':
        router.push(`/user/listings/${propertyId}/mortgage`)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F1F1]">
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
      <div className="min-h-screen bg-[#F1F1F1]">
        <Header />
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
    <div className="min-h-screen flex flex-col bg-[#F1F1F1]">
      <Header />

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
              onClick={() => router.push('/listings')}
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
              <MapPin className="h-4 w-4 mr-1" />
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
            <Image
              src={
                propertyImages[currentImageIndex] ||
                '/placeholder.svg?height=600&width=800'
              }
              alt={property.name}
              fill
              className="object-cover"
            />

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
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {propertyImages.length}
            </div>
          </div>

          {/* Thumbnail gallery */}
          <div className="flex overflow-x-auto p-4 gap-2 bg-white">
            {propertyImages.map((image, index) => (
              <div
                key={index}
                className={`relative h-16 w-24 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 ${
                  index === currentImageIndex
                    ? 'border-[#546B2F]'
                    : 'border-transparent'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={image || '/placeholder.svg?height=120&width=160'}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
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
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
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
                    Down Payment ({property.minDownPaymentPercent || 30}%)
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
                  30% Down Payment
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

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">Listed by Her Homes</p>
              </div>
            </div>

            {/* Similar properties teaser */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">Similar Properties</h2>
              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 transition-transform hover:scale-105 duration-300 cursor-pointer"
                  >
                    <div className="relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=120&width=160"
                        alt="Similar property"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">
                        Similar {property.propertyType}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {property.location}
                      </p>
                      <p className="text-sm font-semibold">
                        {formatCurrency(property.price)}
                      </p>
                    </div>
                  </div>
                ))}
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
