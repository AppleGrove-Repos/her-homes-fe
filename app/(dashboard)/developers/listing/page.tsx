'use client'
import { useState, useEffect } from 'react'
import type React from 'react'

import { Card } from '@/components/ui/card'
import {
  PlusCircle,
  MapPin,
  Bed,
  Home,
  Edit,
  Trash2,
  Lightbulb,
  Eye,
  Check,
  Clock,
  X,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
  useGetDeveloperPropertyListings,
  type PropertyFilterParams,
} from '@/lib/hooks/usePropertyApi'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { deleteProperty } from '@/lib/services/developer/developer.services'
import Button from '@/components/common/button/index'
import Modal from '@/components/developer/modal'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import type { Property } from '@/lib/types/types'

const propertyTypes = [
  { label: 'All Types', value: '', id: 'all' },
  { label: 'Apartment', value: 'apartment', id: 'apartment' },
  { label: 'House', value: 'house', id: 'house' },    
  { label: 'Condo', value: 'condo', id: 'condo' },
  { label: 'Townhouse', value: 'townhouse', id: 'townhouse' },
  { label: 'Land', value: 'land', id: 'land' },
  { label: 'Commercial', value: 'commercial', id: 'commercial' },
]

interface StatusOption {
  label: string
  value: string
  id: string
  count: number
  icon: React.ReactNode
  textColor: string
}

export default function ListingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [filterParams, setFilterParams] = useState<PropertyFilterParams>({})
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('')
  const [showQuickTips, setShowQuickTips] = useState(true)

  const { data: propertyResponse, isLoading } =
    useGetDeveloperPropertyListings(filterParams)
  const properties = propertyResponse?.data || []

  // Calculate dynamic counts based on actual data
  const calculateStatusCounts = () => {
    const totalCount = properties.length
    const approvedCount = properties.filter(
      (p) => p.status === 'approved'
    ).length
    const pendingCount = properties.filter((p) => p.status === 'pending').length
    const rejectedCount = properties.filter(
      (p) => p.status === 'rejected'
    ).length

    return {
      all: totalCount,
      approved: approvedCount,
      pending: pendingCount,
      rejected: rejectedCount,
    }
  }

  const counts = calculateStatusCounts()

  const statusOptions: StatusOption[] = [
    {
      label: 'All',
      value: '',
      id: 'all',
      count: counts.all,
      icon: <div className="w-2 h-2 rounded-full bg-[#546B2F]" />,
      textColor: 'text-[#546B2F]',
    },
    {
      label: 'Approved',
      value: 'approved',
      id: 'approved',
      count: counts.approved,
      icon: (
        <div className="w-4 h-4 bg-[#22C55E] rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      ),
      textColor: 'text-green-700',
    },
    {
      label: 'Pending',
      value: 'pending',
      id: 'pending',
      count: counts.pending,
      icon: (
        <div className="w-4 h-4 rounded-full justify-center bg-yellow-500">
          <Clock className="w-4 h-4 text-white" />
        </div>
      ),
      textColor: 'text-yellow-700',
    },
    {
      label: 'Rejected',
      value: 'rejected',
      id: 'rejected',
      count: counts.rejected,
      icon: (
        <div className="w-4 h-4 bg-red-500 rounded-full justify-center items-center text-center">
          <X className="w-4 h-4 text-white" />
        </div>
      ),
      textColor: 'text-red-700',
    },
  ]

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: (id: string) => {
      console.log('Mutation function called with ID:', id)
      return deleteProperty(id)
    },
    onSuccess: (data) => {
      console.log('Delete mutation success:', data)
      toast.success('Property deleted successfully')
      setDeleteModalOpen(false)
      setPropertyToDelete(null)
      queryClient.invalidateQueries({ queryKey: ['propertyListings'] })
    },
    onError: (error) => {
      console.error('Error deleting property:', error)
      toast.error('Failed to delete property')
      setDeleteModalOpen(false)
      setPropertyToDelete(null)
    },
  })

  // Initialize filters from URL params
  useEffect(() => {
    const apiFilters: PropertyFilterParams = {}
    if (searchParams.get('propertyType'))
      apiFilters.propertyType = searchParams.get('propertyType')!
    const statusParam = searchParams.get('status')
    if (statusParam) {
      apiFilters.status = statusParam
      setActiveTab(statusParam)
    } else {
      setActiveTab('')
    }
    if (searchParams.get('search'))
      apiFilters.search = searchParams.get('search')!
    apiFilters.limit = 10
    setFilterParams(apiFilters)
  }, [searchParams])

  const openDeleteModal = (id: string) => {
    console.log('Opening delete modal for property ID:', id)
    setPropertyToDelete(id)
    setDeleteModalOpen(true)
    console.log('Modal state after setting to true:', true)
  }

  const handleDeleteProperty = async () => {
    console.log('Handling delete property, ID:', propertyToDelete)
    console.log('Modal state:', deleteModalOpen)
    console.log('Rendering modal, isOpen:', deleteModalOpen, 'propertyToDelete:', propertyToDelete)
    console.log('Modal render check - deleteModalOpen:', deleteModalOpen)
    if (!propertyToDelete) {
      console.log('No property to delete')
      return
    }
    console.log('Calling delete mutation')
    deletePropertyMutation.mutate(propertyToDelete)
  }

  function changeQuery(key: string, value: string | number | undefined): void {
    const params = new URLSearchParams(searchParams.toString())
    if (value !== undefined && value !== '') {
      params.set(key, value.toString())
    } else {
      params.delete(key)
    }
    router.push(`/developers/listing?${params.toString()}`)
    setFilterParams((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
    if (key === 'status') {
      setActiveTab((value as string) || '')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[25px] font-bold text-gray-800">
            My Property Listings
          </h1>
          <p className="text-gray-600">
            Manage and track all your property submissions
          </p>
        </div>
        <Link href="/developers/properties/add">
          <Button
            variant="filled"
            icon={<PlusCircle className="h-4 w-4" />}
            iconPosition="left"
            className="whitespace-nowrap bg-[#546B2F] hover:bg-green-700 text-white shadow-md transition-all duration-200"
          >
            Add New Property
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Enhanced Status Tabs */}
          <div className="flex flex-wrap gap-6 border-b border-gray-200">
            {statusOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => changeQuery('status', option.value)}
                className={`flex items-center gap-2 px-1 py-3 transition-all duration-200 border-b-2 ${
                  activeTab === option.value
                    ? `border-[#546B2F] ${option.textColor}`
                    : `border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
                }`}
              >
                <div className="flex items-center justify-center w-3 h-3">
                  {option.icon}
                </div>
                <span className="font-medium text-sm">{option.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium min-w-[20px] text-center ${
                    activeTab === option.value
                      ? 'bg-[#546B2F] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {option.count}
                </span>
              </button>
            ))}
          </div>

          {/* Property Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-8 rounded-full bg-[#546B2F] mb-4"></div>
                <p className="text-green-700">Loading properties...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {properties.length > 0 ? (
                properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={{
                      ...property,
                      status: property.status as
                        | 'pending'
                        | 'approved'
                        | 'rejected',
                    }}
                    onDelete={() => openDeleteModal(property._id)}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <div className="text-[#546B2F] mb-4">
                    <Home className="h-16 w-16" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {filterParams.status ? `No ${filterParams.status.charAt(0).toUpperCase() + filterParams.status.slice(1)} Properties` : 'No Properties Found'}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {filterParams.status 
                      ? `You don't have any ${filterParams.status} properties at the moment. Try switching to a different status or add a new property.`
                      : filterParams.propertyType
                      ? `No ${filterParams.propertyType} properties found. Try changing your filters or add a new property.`
                      : "You haven't added any properties yet or none match your current filters."
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {filterParams.status && (
                      <Button
                        variant="outline"
                        onClick={() => changeQuery('status', '')}
                        className="border-[#546B2F] text-[#546B2F] hover:bg-[#546B2F] hover:text-white"
                      >
                        View All Properties
                      </Button>
                    )}
                    <Link href="/developers/properties/add">
                      <Button
                        variant="filled"
                        icon={<PlusCircle className="h-4 w-4" />}
                        iconPosition="left"
                        className="bg-[#546B2F] hover:bg-green-700 text-white"
                      >
                        {filterParams.status || filterParams.propertyType ? 'Add New Property' : 'Add Your First Property'}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips - Fixed Bottom Right */}
      {showQuickTips && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="p-4 bg-yellow-50 border-yellow-200 shadow-lg max-w-xs relative">
            <button
              onClick={() => setShowQuickTips(false)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Close tips"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="flex items-center gap-2 mb-3 pr-6">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800 text-sm">Quick Tips</h3>
            </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-gray-700">Complete all required fields</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-gray-700">Upload high-quality photos</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-gray-700">
                Provide accurate property details
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-gray-700">Include proper documentation</p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-yellow-200">
            <p className="text-xs text-gray-600">
              Need help?{' '}
              <button className="text-green-600 hover:underline">
                Contact support
              </button>
            </p>
          </div>
        </Card>
      </div>
      )}

      {/* Modern Delete Modal */}
      {deleteModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              console.log('Clicking outside modal to close')
              setDeleteModalOpen(false)
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full mx-auto transform transition-all duration-300 ease-out scale-100 opacity-100">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Delete Property</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  Are you sure you want to delete this property? This will permanently remove it from your listings and cannot be recovered.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    console.log('Cancel button clicked')
                    setDeleteModalOpen(false)
                  }}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={deletePropertyMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Delete button in modal clicked')
                    handleDeleteProperty()
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  disabled={deletePropertyMutation.isPending}
                >
                  {deletePropertyMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="animate-pulse">Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Property
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PropertyCard({
  property,
  onDelete,
}: {
  property: Property
  onDelete: () => void
}) {
  const router = useRouter()
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }

  const statusIcons = {
    pending: '⏳',
    approved: '✅',
    rejected: '❌',
  }

  const handleViewProperty = () => {
    router.push(`/developers/properties/${property._id}`)
  }

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 min-w-[320px]">
      <div className="relative h-56">
        <Image
          src={property.images?.[0] || "/placeholder.svg?height=300&width=500"}
          alt={property.title || property.name || 'Property'}
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.svg?height=300&width=500"
          }}
        />
        <div
          className={`absolute top-2 right-2 ${
            property.status && statusColors[property.status]
              ? statusColors[property.status]
              : 'bg-gray-100 text-gray-800'
          } px-2 py-1 rounded-md text-xs font-medium shadow-sm flex items-center gap-1`}
        >
          <span>
            {property.status && statusIcons[property.status] ? statusIcons[property.status] : '❓'}
          </span>
          {property.status
            ? property.status.charAt(0).toUpperCase() + property.status.slice(1)
            : 'Unknown'}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="font-semibold text-gray-800 text-lg mb-3 line-clamp-2">
              {property.title || property.name || 'Untitled Property'}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mb-4">
              <MapPin className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
              <span className="truncate">{property.propertyAddress || property.location || 'Location not specified'}</span>
            </div>
          </div>
          <div className="font-bold text-green-600 text-xl ml-4 flex-shrink-0">
            ₦{property.price.toLocaleString()}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6 text-sm">
          <div className="flex items-center text-gray-700">
            <Bed className="h-4 w-4 mr-2 text-green-500" />
            <span className="font-medium">{property.specifications?.bedrooms || property.bedrooms || 0} Beds</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Home className="h-4 w-4 mr-2 text-green-500" />
            <span className="capitalize font-medium">{property.propertyType || 'Unknown'}</span>
          </div>
        </div>
        
        <div className="mb-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 block mb-1">Submitted:</span>
              <span className="text-gray-800 font-medium">
                {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-600 block mb-1">Status:</span>
              <span className={`font-medium ${
                property.status === 'approved' ? 'text-green-600' : 
                property.status === 'pending' ? 'text-yellow-600' : 
                property.status === 'rejected' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {property.status ? property.status.charAt(0).toUpperCase() + property.status.slice(1) : 'Unknown'}
              </span>
            </div>
          </div>
        </div>
        
                <div className="flex justify-between gap-3 pt-4 border-t border-gray-200">
          <div className="flex gap-3">
            <button 
              onClick={handleViewProperty}
              className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Property Details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <Link href={`/developers/properties/edit/${property._id}`}>
              <button 
                className="p-2.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Edit Property"
              >
                <Edit className="h-4 w-4" />
            </button>
            </Link>
          </div>
          <button 
            onClick={() => {
              console.log('Delete button clicked for property:', property._id)
              onDelete()
            }}
            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Property"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        
        {property.status === 'rejected' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 text-sm mb-2">
              <span>⚠️</span>
              <span className="font-medium">Incomplete documentation.</span>
            </div>
            <p className="text-red-600 text-xs mb-3">
              Please provide property title and survey plan.
            </p>
            <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
              Resubmit
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
