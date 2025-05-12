'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import {
  PlusCircle,
  Filter,
  MapPin,
  Bed,
  Home,
  Edit,
  Trash2,
  X,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
  useGetPropertyListings,
  type PropertyFilterParams,
} from '@/lib/hooks/usePropertyApi'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import TextField from '@/components/common/inputs/text-field'
import SelectField from '@/components/common/inputs/select-field'
import { deleteProperty } from '@/lib/services/developer/developer.services'
import Button from '@/components/common/button/index'
import Modal from '@/components/developer/modal'
import { useQueryClient } from '@tanstack/react-query'

const propertyTypes = [
  { label: 'All Types', value: '', id: 'all' },
  { label: 'Apartment', value: 'apartment', id: 'apartment' },
  { label: 'House', value: 'house', id: 'house' },
  { label: 'Condo', value: 'condo', id: 'condo' },
  { label: 'Townhouse', value: 'townhouse', id: 'townhouse' },
  { label: 'Land', value: 'land', id: 'land' },
  { label: 'Commercial', value: 'commercial', id: 'commercial' },
]

const statusOptions = [
  { label: 'All', value: '', id: 'all' },
  { label: 'Pending', value: 'pending', id: 'pending' },
  { label: 'Approved', value: 'approved', id: 'approved' },
  { label: 'Rejected', value: 'rejected', id: 'rejected' },
]

export default function ListingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<string>('') // Add activeTab state
  const [filterParams, setFilterParams] = useState<PropertyFilterParams>({})
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)
  const {
    data: propertyResponse,
    isLoading,
    isError,
  } = useGetPropertyListings(filterParams)
  const properties = propertyResponse?.data || []

  const filteredProperties = activeTab
    ? properties.filter((p) => p.status === activeTab)
    : properties
  // Initialize search query from URL params
  useEffect(() => {
    const urlSearchQuery = searchParams.get('searchQuery')
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery)
    }

    // Initialize filter params from URL params
    const apiFilters: PropertyFilterParams = {}
    if (searchParams.get('propertyType'))
      apiFilters.propertyType = searchParams.get('propertyType')!
    if (searchParams.get('status'))
      apiFilters.status = searchParams.get('status')!
    if (searchParams.get('searchQuery'))
      apiFilters.search = searchParams.get('searchQuery')!
    apiFilters.limit = 10
    setFilterParams(apiFilters)
  }, [searchParams])

  // Function to update URL query params when filters change
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (searchQuery) params.set('searchQuery', searchQuery)
    else params.delete('searchQuery')

    // Update the URL with filters
    router.push(`/developers/listing?${params.toString()}`)

    // Update filter params for API
    const apiFilters: PropertyFilterParams = {}
    if (searchQuery) apiFilters.search = searchQuery
    apiFilters.limit = 10
    setFilterParams(apiFilters)
  }, [searchQuery, router, searchParams])

  const clearSearch = () => {
    setSearchQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('searchQuery')
    router.push(`/developers/listing?${params.toString()}`)

    // Update filter params for API
    setFilterParams((prev) => {
      const newFilters = { ...prev }
      delete newFilters.search
      return newFilters
    })
  }

  const openDeleteModal = (id: string) => {
    setPropertyToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return
    try {
      await deleteProperty(propertyToDelete)
      toast.success('Property deleted successfully')
      setDeleteModalOpen(false)
      setPropertyToDelete(null)
      queryClient.invalidateQueries({ queryKey: ['propertyListings'] })
    } catch (error) {
      toast.error('Failed to delete property')
    }
  }

  function changeQuery(key: string, value: string): void {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/developers/listing?${params.toString()}`)
    setFilterParams((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
    if (key === 'status') setActiveTab(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0ED] to-white px-4 py-6 md:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#333333]">
            My Listings
          </h1>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <Link href="/developers/properties/add">
          <Button
            variant="filled"
            icon={<PlusCircle className="h-4 w-4" />}
            iconPosition="left"
            className="whitespace-nowrap bg-[#7C0A02] hover:bg-[#600000] text-white shadow-md transition-all duration-200"
          >
            Add New Property
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {statusOptions.map((option) => (
          <Button
            key={option.id}
            variant={activeTab === option.value ? 'filled' : 'outline'}
            onClick={() => {
              setActiveTab(option.value)
              changeQuery('status', option.value)
            }}
            size="extra-small"
            className={
              activeTab === option.value
                ? 'bg-[#7C0A02] text-white hover:bg-[#600000]'
                : 'border-[#FF9A8B] text-[#7C0A02] hover:bg-[#FFF0ED]'
            }
          >
            {option.label}
          </Button>
        ))}
      </div>

      <Card className="p-4 border border-[#FFE4E0] shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <TextField
              label="Search"
              InputProps={{
                placeholder: 'Search by name or location...',
                value: filterParams.search || '',
                onChange: (e) => changeQuery('search', e.target.value),
                className:
                  'border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20',
              }}
              className="w-full"
              labelClassName="text-[#333333] font-medium"
            />
            {filterParams.search && (
              <button
                onClick={() => changeQuery('search', '')}
                className="absolute right-10 top-[38px] text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <SelectField
            label="Property Type"
            data={propertyTypes}
            value={filterParams.propertyType || ''}
            onSelect={(option) => changeQuery('propertyType', option.value)}
            onClear={() => changeQuery('propertyType', '')}
            className="w-full md:w-[200px]"
            labelClassName="text-[#333333] font-medium"
          />

          <Button
            variant="outline"
            className="gap-2 h-[42px] self-end border-[#FF9A8B] text-[#7C0A02] hover:bg-[#FFF0ED]"
            icon={<Filter className="h-4 w-4" />}
            iconPosition="left"
          >
            More Filters
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-[#FF9A8B] mb-4"></div>
            <p className="text-[#7C0A02]">Loading properties...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={{
                  ...property,
                  status: property.status as
                    | 'pending'
                    | 'approved'
                    | 'rejected',
                }}
                onDelete={() => {
                  setPropertyToDelete(property._id)
                  setDeleteModalOpen(true)
                }}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-[#FFE4E0] p-8">
              <div className="text-[#FF9A8B] mb-4">
                <Home className="h-16 w-16" />
              </div>
              <h3 className="text-xl font-semibold text-[#7C0A02] mb-2">
                No Properties Found
              </h3>
              <p className="text-gray-600 text-center mb-6">
                You haven't added any properties yet or none match your current
                filters.
              </p>
              <Link href="/developers/properties/add">
                <Button
                  variant="filled"
                  icon={<PlusCircle className="h-4 w-4" />}
                  iconPosition="left"
                  className="bg-[#7C0A02] hover:bg-[#600000] text-white"
                >
                  Add Your First Property
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg border border-[#FFE4E0] max-w-md mx-auto"
      >
        <div className="space-y-4">
          <div className="flex items-center text-[#7C0A02] mb-2">
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
              className="border-[#FF9A8B] text-[#7C0A02] hover:bg-[#FFF0ED]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProperty}
              className="bg-[#7C0A02] hover:bg-[#600000] text-white"
            >
              Delete
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
    pending: 'bg-[#F9A826]',
    approved: 'bg-[#4CAF50]',
    rejected: 'bg-[#7C0A02]',
  }

  return (
    <Card className="overflow-hidden border border-[#FFE4E0] shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src="/placeholder.svg?height=300&width=500"
          alt={property.name}
          fill
          className="object-cover"
        />
        <div
          className={`absolute bottom-2 left-2 ${
            statusColors[property.status]
          } text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm`}
        >
          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold truncate text-[#333333]">
              {property.name}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin className="h-3 w-3 mr-1 text-[#FF9A8B]" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>
          <div className="font-bold text-[#7C0A02]">
            ₦{property.price.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center text-gray-700">
            <Bed className="h-4 w-4 mr-1 text-[#FF9A8B]" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Home className="h-4 w-4 mr-1 text-[#FF9A8B]" />
            <span className="capitalize">{property.propertyType}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#FFE4E0]">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-gray-600">Down: </span>
              <span className="text-gray-800 font-medium">
                {property.minDownPaymentPercent}%
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Monthly: </span>
              <span className="text-gray-800 font-medium">
                ₦{property.minMonthlyPayment.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4 pt-4 border-t border-[#FFE4E0]">
          <Link
            href={`/properties/${property._id}`}
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              size="small"
              className="w-full border-[#FF9A8B] text-[#7C0A02] hover:bg-[#FFF0ED]"
            >
              View Details
            </Button>
          </Link>
          <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <Link href={`/properties/edit/${property._id}`}>
              <Button
                variant="outline"
                size="extra-small"
                icon={<Edit className="h-4 w-4" />}
                iconPosition="left"
                className="border-[#FFE4E0] text-gray-700 hover:border-[#FF9A8B] hover:text-[#7C0A02]"
              >
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="extra-small"
              icon={<Trash2 className="h-4 w-4" />}
              iconPosition="left"
              onClick={onDelete}
              className="bg-[#7C0A02] hover:bg-[#600000] text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

import type { Property } from '@/lib/types/types'
