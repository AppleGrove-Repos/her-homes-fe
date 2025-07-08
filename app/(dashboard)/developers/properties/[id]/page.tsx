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
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'

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
  const [isFavorite, setIsFavorite] = useState(false)
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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/developers/listing"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 truncate max-w-[300px] md:max-w-md">
                {property.title || property.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">
                  {property.propertyAddress || property.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className={`${
                isFavorite
                  ? 'bg-red-50 text-red-500 hover:bg-red-100'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <Heart
                className={isFavorite ? 'h-5 w-5 fill-red-500' : 'h-5 w-5'}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="bg-gray-100 text-gray-500 hover:bg-gray-200"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Property Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {property.title || property.name}
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
              <MapPin className="h-5 w-5 mr-2 text-green-500" />
              <span className="text-lg">
                {property.propertyAddress || property.location}
              </span>
            </div>

            {/* Property Quick Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-green-500" />
                <span className="font-medium">
                  {property.specifications?.bedrooms || property.bedrooms}
                </span>
                <span className="text-gray-500">Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-green-500" />
                <span className="font-medium">
                  {property.specifications?.bathrooms || '2'}
                </span>
                <span className="text-gray-500">Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="h-4 w-4 text-green-500" />
                <span className="font-medium">
                  {property.specifications?.area || '120'}
                </span>
                <span className="text-gray-500">sqm</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-green-500" />
                <span className="font-medium">
                  {property.specifications?.parkingSlots || '2'}
                </span>
                <span className="text-gray-500">Parking</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(property.price)}
            </div>
            <div className="text-sm text-gray-600 text-right">
              <div>{formatCurrency(property.minMonthlyPayment)} monthly</div>
              <div>{property.minDownPaymentPercent}% down payment</div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <Card className="overflow-hidden">
            <div className="relative">
              <div className="aspect-[16/9] relative">
                {property.images && property.images.length > 0 ? (
                  <Image
                    src={
                      property.images[currentImageIndex] ||
                      '/placeholder.svg?height=600&width=1200'
                    }
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

                {/* Image Navigation */}
                {property.images && property.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}

                {/* Videos Preview */}
                {property.videos && property.videos.length > 0 && (
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {property.videos.map((video: string, idx: number) => (
                      <Button
                        key={idx}
                        variant="ghost"
                        size="icon"
                        onClick={() => openVideoModal(video)}
                        className="bg-black/60 hover:bg-black/80 text-white"
                      >
                        <Play className="h-5 w-5" />
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {property.images && property.images.length > 1 && (
                <div className="flex overflow-x-auto py-3 px-4 gap-2 bg-white border-t">
                  {property.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === idx
                          ? 'border-green-500 ring-2 ring-green-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={img || '/placeholder.svg?height=64&width=80'}
                        alt={`Thumbnail ${idx + 1}`}
                        width={80}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href={`/developers/properties/edit/${property._id}`}
            className="flex-1 md:flex-none"
          >
            <Button
              variant="outline"
              className="w-full md:w-auto border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Property
            </Button>
          </Link>
          <Button
            variant="outline"
            className="flex-1 md:flex-none border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Public Page
          </Button>
          <Button
            variant="destructive"
            className="flex-1 md:flex-none"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Property
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Overview */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Info className="h-5 w-5 mr-2 text-green-500" />
                Property Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Home className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500">Property Type</p>
                  <p className="font-semibold capitalize">
                    {property.propertyType}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-500">Year Built</p>
                  <p className="font-semibold">2023</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Hammer className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-500">Finishing</p>
                  <p className="font-semibold">Fully Finished</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="h-6 w-6 text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold">New</p>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <Card>
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full bg-gray-50 p-1">
                  <TabsTrigger value="description" className="flex-1">
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="features" className="flex-1">
                    Features
                  </TabsTrigger>
                  <TabsTrigger value="location" className="flex-1">
                    Location
                  </TabsTrigger>
                  {property.videos && property.videos.length > 0 && (
                    <TabsTrigger value="videos" className="flex-1">
                      Videos
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="description" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Property Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {property.propertyDescription || property.description}
                    </p>
                  </div>

                  {property.neighborhoodDescription && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-3">
                        Neighborhood
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {property.neighborhoodDescription}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="features" className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features &&
                      Object.entries(property.features).map(
                        ([feature, enabled]) =>
                          enabled && (
                            <div
                              key={feature}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          )
                      )}
                  </div>
                </TabsContent>

                <TabsContent value="location" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-3">
                      Location & Map
                    </h3>
                    <div className="flex items-start gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {property.propertyAddress || property.location}
                        </p>
                        {property.nearbyLandmark && (
                          <p className="text-gray-600 text-sm mt-1">
                            {property.nearbyLandmark}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">
                          Interactive map will be displayed here
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {property.videos && property.videos.length > 0 && (
                  <TabsContent value="videos" className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Property Videos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.videos.map((video: string, idx: number) => (
                        <div
                          key={idx}
                          className="relative aspect-video bg-black rounded-lg overflow-hidden"
                        >
                          <video
                            src={video}
                            className="w-full h-full object-contain"
                            controls
                            poster="/placeholder.svg?height=300&width=500"
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Mortgage & Pricing */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Mortgage & Pricing</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Price</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(property.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-y">
                  <span className="text-gray-600">
                    Down Payment ({property.minDownPaymentPercent}%)
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(
                      property.price * (property.minDownPaymentPercent / 100)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Payment</span>
                  <span className="font-semibold">
                    {formatCurrency(property.minMonthlyPayment)}
                  </span>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-4">
                  Check Your Eligibility
                </Button>
              </div>
            </Card>

            {/* Contact Agent */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">
                    Verified Her-Homes Partner
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex text-yellow-400">{'★'.repeat(5)}</div>
                    <span className="text-xs text-gray-500">(127 reviews)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Request Callback
                </Button>
              </div>
            </Card>

            {/* Similar Properties */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Similar Properties</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Image
                    src="/placeholder.svg?height=80&width=100"
                    alt="Similar property"
                    width={100}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">2-Bedroom Apartment</h4>
                    <p className="text-xs text-gray-500">Lekki Phase 2</p>
                    <p className="text-sm font-semibold text-green-600 mt-1">
                      ₦28,000,000
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Image
                    src="/placeholder.svg?height=80&width=100"
                    alt="Similar property"
                    width={100}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">4-Bedroom Duplex</h4>
                    <p className="text-xs text-gray-500">Ajah, Lagos</p>
                    <p className="text-sm font-semibold text-green-600 mt-1">
                      ₦42,000,000
                    </p>
                  </div>
                </div>
              </div>
            </Card>
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
