'use client'

import { useState, useEffect } from 'react'
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
  Check,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

// Status badge colors
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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
          router.push('/dashboard/developer/listings')
        }
      } catch (error) {
        console.error('Error fetching property:', error)
        toast.error('Failed to load property data')
        router.push('/dashboard/developer/listings')
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchPropertyData()
    }
  }, [propertyId, router])

  // Handle property deletion
  const handleDeleteProperty = async () => {
    setIsDeleting(true)
    try {
      const success = await deleteProperty(propertyId)
      if (success) {
        toast.success('Property deleted successfully')
        router.push('/dashboard/developer/listings')
      } else {
        toast.error('Failed to delete property')
        setDeleteDialogOpen(false)
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      toast.error('An error occurred while deleting the property')
      setDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
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
          <Link href="/dashboard/developer/listings">
            <Button className="bg-[#7C0A02] text-white hover:bg-[#600000]">
              Back to Listings
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Mock amenities (since they're not in the API)
  const mockAmenities = [
    { name: 'Parking', available: true },
    { name: 'Swimming Pool', available: false },
    { name: 'Gym', available: true },
    { name: 'Security', available: true },
    { name: 'Air Conditioning', available: true },
    { name: 'Furnished', available: false },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/developer/listings"
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{property.name}</h1>
          <p className="text-gray-600">{property.location}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[property.status as keyof typeof statusColors]
          }`}
        >
          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">
                Property image would be displayed here
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-gray-600">{property.description}</p>
                </div>

                <div className="border-t pt-4">
                  <h2 className="text-xl font-semibold mb-2">
                    Property Details
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm">
                        Property Type
                      </span>
                      <span className="font-medium">
                        {property.propertyType}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm">Bedrooms</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm">
                        Down Payment
                      </span>
                      <span className="font-medium">
                        {property.minDownPaymentPercent}%
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm">
                        Monthly Payment
                      </span>
                      <span className="font-medium">
                        ₦{property.minMonthlyPayment.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="amenities">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mockAmenities.map((amenity) => (
                    <div key={amenity.name} className="flex items-center gap-2">
                      {amenity.available ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 flex items-center justify-center">
                          <div className="h-0.5 w-3 bg-red-500 rounded-full"></div>
                        </div>
                      )}
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="location">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p>{property.location}</p>
                    </div>
                  </div>

                  <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">
                      Map view would be displayed here
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    ₦{property.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/developer/properties/edit/${property._id}`}
                  >
                    <Button variant="outline" size="small">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="small"
                    className="text-red-600"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="flex justify-between py-2 border-y">
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{property.minDownPaymentPercent}% Down</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {property.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    Listed on {formatDate(property.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Property Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Views</span>
                <span className="font-medium">245</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Inquiries</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Applications</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Days Listed</span>
                <span className="font-medium">15</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

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
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteProperty}
              loading={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Property'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
