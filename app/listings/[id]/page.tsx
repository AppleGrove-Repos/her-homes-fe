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
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  Bath,
  Car,
  Shield,
  Headphones,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/landing/header'
import Footer from '@/components/landing/footer'
import { useAuth } from '@/lib/store/auth.store'
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
  const { user } = useAuth()

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

  const handleActionClick = (action: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      router.push(`/login?redirect=/listing/${propertyId}&action=${action}`)
      return
    }

    switch (action) {
      case 'contact':
        router.push(`/listings/${propertyId}/contact`)
        break
      case 'mortgage':
        router.push(`/listings/${propertyId}/mortgage`)
        break
      default:
        break
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: property?.name || 'Property Listing',
          text: `Check out this property: ${property?.name}`,
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50 overflow-hidden">
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
      <div className="flex min-h-screen flex-col bg-gray-50 overflow-hidden">
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
    <div className="flex min-h-screen flex-col bg-gray-50 overflow-hidden">
      <Header />

      <main className="flex-grow">
        {/* Back button */}
        <div className="container mx-auto px-4 py-4">
          {/* <div className="bg-white px-6 py-4">   */}
          <div className="flex items-center mb-4">
            <Button variant="ghost" className="p-0 mr-2 hover:bg-transparent" onClick={handleGoBack}>
              <ArrowLeft className="h-5 w-5 text-[#546B2F]" />
            </Button>
            <div className="text-sm text-gray-500">
              <span className="hover:underline cursor-pointer" onClick={() => router.push("/listings")}>
                Listings
              </span>
              <span className="mx-2">/</span>
              <span className="text-[#546B2F]">{property.name}</span>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Images */}
            <div className="lg:col-span-2">
              {/* Main image */}
              <div className="relative mb-4 bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-[400px] md:h-[500px] w-full">
                  <Image
                    src={
                      propertyImages[currentImageIndex] ||
                      '/placeholder.svg?height=600&width=800' ||
                      '/placeholder.svg'
                    }
                    alt={property.name}
                    fill
                    className="object-cover"
                  />

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
                </div>

                {/* Thumbnail gallery */}
                <div className="flex overflow-x-auto p-4 gap-3 bg-white">
                  {propertyImages.map((image, index) => (
                    <div
                      key={index}
                      className={`relative h-16 w-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex
                          ? 'border-[#546B2F]'
                          : 'border-gray-200'
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
            </div>

            {/* Right column - Property details */}
            <div className="space-y-6">
              {/* Property title and basic info */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {property.name}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1 text-[#546B2F]" />
                  <span>{property.location}</span>
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {formatCurrency(property.price)}
                </div>

                <div className="flex gap-3 mb-6">
                  <Button
                    className="flex-1 bg-[#7C0A02] hover:bg-[#600000] text-white"
                    onClick={(e) => handleActionClick('mortgage', e)}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Apply for Mortgage
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#546B2F] text-[#546B2F] hover:bg-[#546B2F] hover:text-white bg-transparent"
                    onClick={(e) => toggleFavorite(e)}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
                    />
                    Save Property
                  </Button>
                </div>

                {/* Property specs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 text-[#546B2F] mr-2" />
                    <span className="text-sm">
                      {property.bedrooms} Bedrooms
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 text-[#546B2F] mr-2" />
                    <span className="text-sm">3 Bathrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-[#546B2F] mr-2" />
                    <span className="text-sm">180 sqm</span>
                  </div>
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-[#546B2F] mr-2" />
                    <span className="text-sm">2 Parking</span>
                  </div>
                </div>
              </div>

              {/* Contact Agent */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-semibold mb-4">Contact Agent</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">
                      Verified Her Homes Partner
                    </p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm ml-1">4.9 (127 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full bg-[#7C0A02] hover:bg-[#600000]">
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Request Callback
                  </Button>
                </div>
              </div>

              {/* Similar Properties */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-semibold mb-4">Similar Properties</h3>
                <div className="space-y-4">
                  {[1, 2].map((item) => (
                    <div key={item} className="flex gap-3">
                      <div className="relative h-16 w-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=120&width=160"
                          alt="Similar property"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          2-Bedroom Apartment
                        </h4>
                        <p className="text-xs text-gray-500">Lekki Phase 2</p>
                        <p className="text-sm font-semibold">₦28,000,000</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Property Overview Section */}
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-6">Property Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#546B2F]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Home className="h-6 w-6 text-[#546B2F]" />
                </div>
                <p className="text-sm text-gray-600">Property Type</p>
                <p className="font-semibold">{property.propertyType}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#546B2F]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="h-6 w-6 text-[#546B2F]" />
                </div>
                <p className="text-sm text-gray-600">Year Built</p>
                <p className="font-semibold">2023</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#546B2F]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check className="h-6 w-6 text-[#546B2F]" />
                </div>
                <p className="text-sm text-gray-600">Finishing</p>
                <p className="font-semibold">Fully Finished</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#546B2F]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="h-6 w-6 text-[#546B2F]" />
                </div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold">New</p>
              </div>
            </div>
          </div>

          {/* Mortgage & Pricing Section */}
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-6">Mortgage & Pricing</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Price</span>
                    <span className="font-semibold">
                      {formatCurrency(property.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment (30%)</span>
                    <span className="font-semibold">
                      {formatCurrency(downPaymentAmount)}
                    </span>
                  </div>
                  <div className="text-[#546B2F] text-sm">
                    Pre-qualified Available
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Payment</span>
                    <select className="border rounded px-2 py-1 text-sm">
                      <option>10 years</option>
                      <option>15 years</option>
                      <option>20 years</option>
                    </select>
                  </div>
                  <div className="text-2xl font-bold text-[#546B2F]">
                    {formatCurrency(property.minMonthlyPayment)}/month
                  </div>
                  <Button className="w-full bg-[#7C0A02] hover:bg-[#600000]">
                    Check Your Eligibility
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Property Description */}
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Property Description</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {property.description}
            </p>

            <h3 className="font-semibold mb-4">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-[#546B2F] mr-2" />
                <span>POP ceiling throughout</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-[#546B2F] mr-2" />
                <span>Marble flooring in living areas</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-[#546B2F] mr-2" />
                <span>CCTV-ready infrastructure</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-[#546B2F] mr-2" />
                <span>Modern kitchen with granite countertops</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-[#546B2F] mr-2" />
                <span>En-suite bathrooms</span>
              </div>
            </div>
          </div>

          {/* Location & Map */}
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-6">Location & Map</h2>
            <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-[#546B2F] mx-auto mb-2" />
                <p className="text-gray-600">Interactive Map</p>
                <p className="text-sm text-gray-500">Lekki Phase 1, Lagos</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-[#546B2F] rounded-full mr-2"></div>
                  <span className="text-sm">Corona Schools - 5 min drive</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#546B2F] rounded-full mr-2"></div>
                  <span className="text-sm">
                    Palms Shopping Mall - 10 min drive
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-[#546B2F] rounded-full mr-2"></div>
                  <span className="text-sm">
                    Reddington Hospital - 8 min drive
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#546B2F] rounded-full mr-2"></div>
                  <span className="text-sm">
                    Lekki-Epe Expressway - 2 min drive
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
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
                Need help? Our team is here to guide you through every step —
                from search to signing.
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
      </main>

      <Footer />
    </div>
  )
}
