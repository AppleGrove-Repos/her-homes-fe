'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  getPropertyById,
  deleteProperty,
} from '@/lib/services/developer/developer.services'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import Button from '@/components/common/button'
import {
  ArrowLeft,
  Bed,
  MapPin,
  DollarSign,
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
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// Status badge colors
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
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
          title: property?.name,
          text: `Check out this property: ${property?.name}`,
          url: window.location.href,
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7C0A02]"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">
          Property not found
        </h3>
        <p className="mt-1 text-gray-500">
          The property you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Link href="/developers/listing">
            <Button className="bg-[#7C0A02] text-white hover:bg-[#600000]">
              Back to Listings
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0ED] to-white">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/developers/listing"
            className="text-gray-600 hover:text-[#7C0A02]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold truncate max-w-[200px] md:max-w-md">
            {property.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full ${
              isFavorite
                ? 'bg-red-50 text-red-500'
                : 'bg-gray-100 text-gray-500'
            } hover:bg-gray-200`}
          >
            <Heart
              className={isFavorite ? 'h-5 w-5 fill-red-500' : 'h-5 w-5'}
            />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Property Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#333333]">
              {property.name}
            </h1>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1 text-[#FF9A8B]" />
              <span>{property.location}</span>
            </div>
            {property.status && (
              <div
                className={`inline-block px-3 py-1 mt-2 rounded-full text-sm font-medium ${
                  statusColors[property.status as keyof typeof statusColors]
                }`}
              >
                {property.status.charAt(0).toUpperCase() +
                  property.status.slice(1)}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl md:text-3xl font-bold text-[#7C0A02]">
              {formatCurrency(property.price)}
            </div>
            <div className="text-sm text-gray-600">
              {formatCurrency(property.minMonthlyPayment)} monthly •{' '}
              {property.minDownPaymentPercent}% down
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative rounded-xl overflow-hidden bg-gray-100">
          <div className="aspect-[16/9] relative">
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[currentImageIndex] || '/placeholder.svg'}
                alt={`Property ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <Home className="h-16 w-16 text-gray-400" />
                <p className="text-gray-500 ml-2">No images available</p>
              </div>
            )}

            {/* Image Navigation */}
            {property.images && property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {property.images && property.images.length > 1 && (
            <div className="flex overflow-x-auto py-2 px-1 gap-2 bg-white">
              {property.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden ${
                    currentImageIndex === idx
                      ? 'ring-2 ring-[#7C0A02]'
                      : 'opacity-70'
                  }`}
                >
                  <img
                    src={img || '/placeholder.svg'}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Videos Preview */}
          {property.videos && property.videos.length > 0 && (
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {property.videos.map((video: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => openVideoModal(video)}
                  className="bg-black/60 p-2 rounded-full hover:bg-black/80 transition-colors"
                >
                  <Play className="h-5 w-5 text-white" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/developers/properties/edit/${property._id}`}
            className="flex-1 md:flex-none"
          >
            <Button
              variant="outline"
              className="w-full md:w-auto border-[#FF9A8B] text-[#7C0A02] hover:bg-[#FFF0ED]"
              icon={<Edit className="h-4 w-4 mr-2" />}
              iconPosition="left"
            >
              Edit Property
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="flex-1 md:flex-none w-full md:w-auto bg-[#7C0A02] hover:bg-[#600000] text-white"
            icon={<Trash2 className="h-4 w-4 mr-2" />}
            iconPosition="left"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Property
          </Button>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Card className="overflow-hidden border border-[#FFE4E0]">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full bg-[#FFF0ED] border-b border-[#FFE4E0]">
                  <TabsTrigger
                    value="details"
                    className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#7C0A02]"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="location"
                    className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#7C0A02]"
                  >
                    Location
                  </TabsTrigger>
                  {property.videos && property.videos.length > 0 && (
                    <TabsTrigger
                      value="videos"
                      className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#7C0A02]"
                    >
                      Videos
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="details" className="p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-3 text-[#333333] flex items-center">
                      <Info className="h-5 w-5 mr-2 text-[#FF9A8B]" />
                      Description
                    </h2>
                    <p className="text-gray-700 whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>

                  <div className="border-t border-[#FFE4E0] pt-6">
                    <h2 className="text-xl font-semibold mb-4 text-[#333333]">
                      Property Details
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                      <div className="flex items-center">
                        <Home className="h-5 w-5 mr-2 text-[#FF9A8B]" />
                        <div>
                          <p className="text-sm text-gray-500">Property Type</p>
                          <p className="font-medium capitalize">
                            {property.propertyType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Bed className="h-5 w-5 mr-2 text-[#FF9A8B]" />
                        <div>
                          <p className="text-sm text-gray-500">Bedrooms</p>
                          <p className="font-medium">{property.bedrooms}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-[#FF9A8B]" />
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-medium">
                            {formatCurrency(property.price)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-[#FF9A8B]" />
                        <div>
                          <p className="text-sm text-gray-500">Down Payment</p>
                          <p className="font-medium">
                            {property.minDownPaymentPercent}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-[#FF9A8B]" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Monthly Payment
                          </p>
                          <p className="font-medium">
                            {formatCurrency(property.minMonthlyPayment)}
                          </p>
                        </div>
                      </div>
                      {property.createdAt && (
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-[#FF9A8B]" />
                          <div>
                            <p className="text-sm text-gray-500">Listed On</p>
                            <p className="font-medium">
                              {formatDate(property.createdAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="location" className="p-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-3 text-[#333333] flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-[#FF9A8B]" />
                      Location
                    </h2>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-[#FF9A8B] mt-0.5" />
                      <div>
                        <p className="text-gray-700">{property.location}</p>
                      </div>
                    </div>

                    <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center mt-4">
                      <p className="text-gray-500">
                        Map view would be displayed here
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {property.videos && property.videos.length > 0 && (
                  <TabsContent value="videos" className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-[#333333] flex items-center">
                      <Play className="h-5 w-5 mr-2 text-[#FF9A8B]" />
                      Property Videos
                    </h2>
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

          <div className="space-y-6">
            {/* Price Card */}
            <Card className="p-6 border border-[#FFE4E0]">
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-[#7C0A02]">
                    {formatCurrency(property.price)}
                  </span>
                  {property.status && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[
                          property.status as keyof typeof statusColors
                        ]
                      }`}
                    >
                      {property.status.charAt(0).toUpperCase() +
                        property.status.slice(1)}
                    </span>
                  )}
                </div>

                <div className="flex justify-between py-3 border-y border-[#FFE4E0]">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4 text-[#FF9A8B]" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4 text-[#FF9A8B]" />
                    <span className="capitalize">{property.propertyType}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Down Payment:</span>
                    <span className="font-medium">
                      {formatCurrency(
                        property.price * (property.minDownPaymentPercent / 100)
                      )}{' '}
                      ({property.minDownPaymentPercent}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Payment:</span>
                    <span className="font-medium">
                      {formatCurrency(property.minMonthlyPayment)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Card */}
            <Card className="p-6 border border-[#FFE4E0]">
              <h3 className="font-semibold mb-4 text-[#333333]">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">contact@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">+234 123 456 7890</span>
                </div>
                <div className="mt-4">
                  <Button className="w-full bg-[#7C0A02] hover:bg-[#600000] text-white">
                    Contact Agent
                  </Button>
                </div>
              </div>
            </Card>

            {/* Similar Properties Card */}
            <Card className="p-6 border border-[#FFE4E0]">
              <h3 className="font-semibold mb-4 text-[#333333]">
                Similar Properties
              </h3>
              <p className="text-gray-500 text-sm">
                Similar properties will be displayed here based on location and
                property type.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={videoModalOpen} onOpenChange={closeVideoModal}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
          <div className="relative">
            <button
              onClick={closeVideoModal}
              className="absolute top-2 right-2 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/80"
            >
              <X className="h-5 w-5" />
            </button>
            <video
              ref={videoRef}
              src={currentVideo}
              className="w-full max-h-[80vh]"
              controls
              autoPlay
            ></video>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot
              be undone.
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
              className="bg-red-600 text-white hover:bg-red-700"
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
