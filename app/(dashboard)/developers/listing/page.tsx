'use client'


import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import {
  PlusCircle,
  Filter,
  MapPin,
  Bed,
  Home,
  Edit,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useGetPropertyListings, type PropertyFilterParams } from '@/lib/hooks/usePropertyApi'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import TextField from '@/components/common/inputs/text-field'
import SelectField from '@/components/common/inputs/select-field'
import { deleteProperty } from '@/lib/services/developer/developer.services'
import Button from '@/components/common/button/index'
import Modal from '@/components/developer/modal'

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
    } catch (error) {
      toast.error('Failed to delete property')
    }
  }
  function changeQuery(key: string, value: string): void {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/developers/listing?${params.toString()}`)

    setFilterParams((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Listings</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Link href="/developers/properties/add">
          <Button
            variant="filled"
            icon={<PlusCircle className="h-4 w-4" />}
            iconPosition="left"
            className="whitespace-nowrap"
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
            onClick={() => setActiveTab(option.value)}
            size="extra-small"
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 my-4">
        <div className="relative flex-1">
          <TextField
            label="Search"
            InputProps={{
              placeholder: 'Search by name or location...',
              value: filterParams.search || '',
              onChange: (e) => changeQuery('search', e.target.value),
            }}
            className="w-full"
          />
        </div>

        <SelectField
          label="Property Type"
          data={propertyTypes}
          value={filterParams.propertyType || ''}
          onSelect={(option) => changeQuery('propertyType', option.value)}
          onClear={() => changeQuery('propertyType', '')}
          className="w-full md:w-[200px]"
        />

        <Button
          variant="outline"
          className="gap-2 h-[42px] self-end"
          icon={<Filter className="h-4 w-4" />}
          iconPosition="left"
        >
          More Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <p>Loading properties...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.length > 0 ? (
          properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={{
                ...property,
                status: property.status as 'pending' | 'approved' | 'rejected',
              }}
              onDelete={() => openDeleteModal(property._id)}
            />
          ))
          ) : (
            <div className="col-span-3 flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No properties found</p>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Confirm Deletion</h3>
          <p>
            Are you sure you want to delete this property? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProperty}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

import type { Property } from '@/lib/types/types';

function PropertyCard({ property, onDelete }: { property: Property; onDelete: () => void }) {
  const statusColors = {
    pending: 'bg-yellow-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
  }

  return (
    <Card className="overflow-hidden">
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
          } text-white px-2 py-1 rounded text-xs`}
        >
          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold truncate">{property.name}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>
          <div className="font-bold text-primary">
            ${property.price.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Home className="h-4 w-4 mr-1" />
            <span>{property.propertyType}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-muted-foreground">Down: </span>
              <span>{property.minDownPaymentPercent}%</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Monthly: </span>
              <span>${property.minMonthlyPayment}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4 pt-4 border-t">
          <Link href={`/properties/${property._id}`}>
            <Button variant="outline" size="small">
              View Details
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href={`/properties/edit/${property._id}`}>
              <Button
                variant="outline"
                size="extra-small"
                icon={<Edit className="h-4 w-4" />}
                iconPosition="left"
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
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
