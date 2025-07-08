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
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: () => {
      toast.success('Property deleted successfully')
      setDeleteModalOpen(false)
      setPropertyToDelete(null)
      queryClient.invalidateQueries({ queryKey: ['propertyListings'] })
    },
    onError: (error) => {
      console.error('Error deleting property:', error)
      toast.error('Failed to delete property')
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
    setPropertyToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    No Properties Found
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    You haven't added any properties yet or none match your
                    current filters.
                  </p>
                  <Link href="/developers/properties/add">
                    <Button
                      variant="filled"
                      icon={<PlusCircle className="h-4 w-4" />}
                      iconPosition="left"
                      className="bg-[#546B2F] hover:bg-green-700 text-white"
                    >
                      Add Your First Property
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Tips Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">Quick Tips</h3>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Complete all required fields</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Upload high-quality photos</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Provide accurate property details
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Include proper documentation</p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-yellow-200">
              <p className="text-xs text-gray-600">
                Need help?{' '}
                <button className="text-green-600 hover:underline">
                  Contact support
                </button>
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-md mx-auto"
      >
        <div className="space-y-4">
          <div className="flex items-center text-red-600 mb-2">
            <Trash2 className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
          </div>
          <p className="text-gray-600">
            Are you sure you want to delete this property? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={deletePropertyMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProperty}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deletePropertyMutation.isPending}
            >
              {deletePropertyMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
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

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src="/placeholder.svg?height=300&width=500"
          alt={property.name}
          fill
          className="object-cover"
        />
        <div
          className={`absolute top-2 right-2 ${
            statusColors[property.status]
          } px-2 py-1 rounded-md text-xs font-medium shadow-sm flex items-center gap-1`}
        >
          <span>{statusIcons[property.status]}</span>
          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold truncate text-gray-800">
              {property.name}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin className="h-3 w-3 mr-1 text-green-500" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>
          <div className="font-bold text-green-600">
            ₦{property.price.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center text-gray-700">
            <Bed className="h-4 w-4 mr-1 text-green-500" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Home className="h-4 w-4 mr-1 text-green-500" />
            <span className="capitalize">{property.propertyType}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="text-gray-600">Submitted: </span>
              <span className="text-gray-800 font-medium">Dec 15, 2024</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Status: </span>
              <span className="text-green-600 font-medium">Live</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-2 mt-4 pt-4 border-t border-gray-200">
          <div className="flex gap-2">
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded">
              <Eye className="h-4 w-4" />
            </button>
            <Link href={`/developers/properties/edit/${property._id}`}>
              <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded">
                <Edit className="h-4 w-4" />
              </button>
            </Link>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-lg">⋯</span>
          </button>
        </div>
        {property.status === 'rejected' && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <span>⚠️</span>
              <span className="font-medium">Incomplete documentation.</span>
            </div>
            <p className="text-red-600 text-xs mt-1">
              Please provide property title and survey plan.
            </p>
            <button className="mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
              Resubmit
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
