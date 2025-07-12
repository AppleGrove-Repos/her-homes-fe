'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  getPropertyById,
  deleteProperty,
} from '@/lib/services/developer/developer.services'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Bed,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Home,
  Share2,
  Heart,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Bath,
  Car,
  Maximize,
  Eye,
  MessageSquare,
  Phone,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  Hammer,
  Sparkles,
  Check,
  FolderOpenDot,
  ChartNoAxesColumnDecreasing,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { getFeatureIcon, getSpecificationIcon, formatTextForDisplay } from '@/lib/utils/icon-utils'

// Status badge colors
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
}

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const propertyId = params.id as string

  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: () => deleteProperty(propertyId),
    onSuccess: () => {
      toast.success('Property deleted successfully')
      router.push('/developers/listing')
      queryClient.invalidateQueries({ queryKey: ['propertyListings'] })
    },
    onError: (error) => {
      console.error('Error deleting property:', error)
      toast.error('Failed to delete property')
      setDeleteDialogOpen(false)
    },
  })

  // Fetch property data on component mount
  useEffect(() => {
    const fetchPropertyData = async () => {
      setLoading(true)
      try {
        const data = await getPropertyById(propertyId)
        if (data) {
          setProperty(data)
        } else {
          toast.error('Property not found')
          router.push('/developers/listing')
        }
      } catch (error) {
        console.error('Error fetching property:', error)
        toast.error('Failed to load property data')
        router.push('/developers/listing')
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchPropertyData()
    }
  }, [propertyId, router])

  // Handle property deletion
  const handleDeleteProperty = () => {
    deletePropertyMutation.mutate()
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const nextImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      )
    }
  }

  const openVideoModal = (videoUrl: string) => {
    setCurrentVideo(videoUrl)
    setVideoModalOpen(true)
  }

  const closeVideoModal = () => {
    setVideoModalOpen(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }



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

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: property?.title || property?.name,
          text: `Check out this property: ${property?.title || property?.name}`,
          url: window.location.href,
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error))
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading property details...
          </p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Property not found
          </h3>
          <p className="text-gray-500 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/developers/listing">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Back to Listings
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const StatusIcon =
    statusIcons[property.status as keyof typeof statusIcons] || Clock

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F1EB] overflow-hidden">
      {/* Back button */}
      <div className="px-6 py-4 flex items-center justify-between mx-0 md:mx-24">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            className="p-0 mr-2 hover:bg-transparent"
            onClick={() => router.push('/developers/listing')}
          >
            <ArrowLeft className="h-5 w-5 text-[#64111F]" />
          </Button>
          <div className="text-[12px] text-[#64111F]">
            <span
              className="hover:underline cursor-pointer"
              onClick={() => router.push('/developers/listing')}
            >
              My Properties
            </span>
            <span className="mx-2">/</span>
            <span className="text-[#64111F]">{property.title || property.name || ''}</span>
          </div>
        </div>
        <Button
          variant="outline"
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent max-w-[100px]"
          onClick={handleShare}
          type="button"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
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
                  <div className="absolute inset-0">
                    {property.images && property.images.length > 0 ? (
                      <Image
                        src={property.images[currentImageIndex] || '/placeholder.svg?height=600&width=800'}
                        alt={`Property ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <div className="text-center">
                          <Home className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">No images available</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Image navigation buttons */}
                  {property.images && property.images.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-800" />
                      </button>
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-800" />
                      </button>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex gap-2 overflow-x-auto">
                          {property.images.map((image: string, index: number) => (
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
                                src={image || '/placeholder.svg?height=120&width=160'}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Property Details Card */}
            <div className="bg-white p-8 rounded-2xl h-[500px]">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-medium text-gray-900">
                  {property.title || property.name || 'Property Title'}
                </h1>
                {property.status && (
                  <Badge
                    className={`${
                      statusColors[property.status as keyof typeof statusColors]
                    } flex items-center gap-1`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {property.status.charAt(0).toUpperCase() +
                      property.status.slice(1)}
                  </Badge>
                )}
              </div>
              
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
                <Link href={`/developers/properties/edit/${property._id}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-[#546B2F] hover:bg-gray-50 bg-transparent"
                  >
                    <Edit className="h-4 w-4 mr-2" strokeWidth={3} />
                    Edit Property
                  </Button>
                </Link>
              </div>

              {/* Property specs */}
              <div className="grid grid-rows-2 gap-4 text-sm">
                {property.specifications && typeof property.specifications === 'object' ? (
                  Object.entries(property.specifications)
                    .slice(0, 4)
                    .map(([specName, specValue], index) => (
                      <div key={index} className="flex items-center">
                        {getSpecificationIcon(specName)}
                        <span>{formatSpecificationName(specName)}: {typeof specValue === 'string' || typeof specValue === 'number' ? specValue : String(specValue)}</span>
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
                      <span>{property.propertyType || 'N/A'}</span>
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
                      <Home className="h-6 w-6 text-[#546B2F] fill-[#546B2F]" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      Property Type
                    </p>
                    <p className="font-medium">{formatPropertyType(property.propertyType) || 'N/A'}</p>
                  </div>
                  
                  {/* Status */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center mx-auto mb-3">
                    <ChartNoAxesColumnDecreasing className="h-8 w-8 text-[#546B2F] fill-[#546B2F]" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      Status
                    </p>
                    <p className="font-medium capitalize">{property.status || 'N/A'}</p>
                  </div>
                  
                  {/* Price */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center mx-auto mb-3">
                    <FolderOpenDot className="h-8 w-8 text-[#546B2F]" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      Price
                    </p>
                    <p className="font-medium">{property.price?.toLocaleString() || 'N/A'}</p>
                  </div>
                  
                  {/* Monthly Payment */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-8 w-8 text-[#546B2F] " />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      Monthly Payment
                    </p>
                    <p className="font-medium">₦{property.minMonthlyPayment?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Mortgage & Pricing */}
              <div className="bg-white p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-6">
                  Mortgage & Pricing
                </h2>
                <div className="grid md:grid-cols-2 gap-20">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Price</span>
                      <span className="font-semibold">₦{property.price?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Down Payment ({property.minDownPaymentPercent || 0}%)
                      </span>
                      <span className="font-semibold">₦{(property.price * (property.minDownPaymentPercent / 100))?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="text-[#546B2F] text-sm font-medium">
                      Pre-qualified Available
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly Payment</span>
  
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      ₦{property.minMonthlyPayment?.toLocaleString() || 'N/A'}/month
                    </div>
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
              {/* Developer Information */}
              <div className="bg-white p-6 rounded-2xl">
                <h3 className="font-semibold mb-4">Developer Information</h3>
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
                        <Building2 className="h-6 w-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
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
                    {property.developer?.yearsOfExperience && (
                      <p className="text-sm text-gray-600">
                        {property.developer.yearsOfExperience} years of experience
                      </p>
                    )}
                  </div>
                </div>
                {property.developer?.companyDescription && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {property.developer.companyDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="bg-white p-6 rounded-2xl">
                <h3 className="font-semibold mb-4">Property Actions</h3>
                <div className="space-y-8">
                  <Link href={`/listings/${property._id}`} target="_blank">
                    <Button className="w-full bg-[#7C0A02] hover:bg-[#600000] text-white mb-2">
                      <Eye className="h-4 w-4 mr-2" />
                      View Public Page
                    </Button>
                  </Link>
                  <Link href={`/developers/properties/edit/${property._id}`}>
                    <Button
                      variant="outline"
                      className="w-full border-[#546B2F] text-[#546B2F] hover:bg-gray-50 bg-transparent"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Property
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Property
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={videoModalOpen} onOpenChange={closeVideoModal}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={closeVideoModal}
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/80 text-white"
            >
              <X className="h-5 w-5" />
            </Button>
            <video
              ref={videoRef}
              src={currentVideo}
              className="w-full max-h-[80vh]"
              controls
              autoPlay
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot
              be undone and will remove all associated data including images,
              videos, and applications.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletePropertyMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProperty}
              disabled={deletePropertyMutation.isPending}
            >
              {deletePropertyMutation.isPending
                ? 'Deleting...'
                : 'Delete Property'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
