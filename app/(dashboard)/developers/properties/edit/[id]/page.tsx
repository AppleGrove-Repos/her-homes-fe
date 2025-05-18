'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
  getPropertyById,
  updateProperty,
} from '@/lib/services/developer/developer.services'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Button from '@/components/common/button'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import VideoUploader from '@/components/developer/video-uploader'
import ImageUploaderComponent from '@/components/developer/image-uploader'

// Define the property types
const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
]

// Define the status options
const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

// Define the form data type
interface PropertyFormData {
  name: string
  description: string
  bedrooms: string
  location: string
  images: string[]
  videos: string[]
  price: string
  propertyType: string
  minDownPaymentPercent: string
  minMonthlyPayment: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const propertyId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [imageError, setImageError] = useState('')
  const [videos, setVideos] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<PropertyFormData>({
    defaultValues: {
      name: '',
      description: '',
      bedrooms: '',
      location: '',
      price: '',
      images: [],
      videos: [],
      propertyType: '',
      minDownPaymentPercent: '',
      minMonthlyPayment: '',
      status: 'pending',
    },
  })

  // Watch the property type and status to use in the UI
  const selectedPropertyType = watch('propertyType')
  const selectedStatus = watch('status')

  // Update property mutation
  const updatePropertyMutation = useMutation({
    mutationFn: (data: PropertyFormData) => updateProperty(propertyId, data),
    onSuccess: () => {
      toast.success('Property updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['propertyListings'] })
      router.push(`/developer/properties/${propertyId}`)
    },
    onError: (error) => {
      console.error('Error updating property:', error)
      toast.error('Failed to update property. Please try again.')
    },
  })

  // Fetch property data on component mount
  useEffect(() => {
    const fetchPropertyData = async () => {
      setIsLoading(true)
      try {
        const property = await getPropertyById(propertyId)
        if (property) {
          // Set form values
          reset({
            name: property.name,
            description: property.description,
            bedrooms: property.bedrooms.toString(),
            location: property.location,
            price: property.price.toString(),
            propertyType: property.propertyType,
            minDownPaymentPercent: property.minDownPaymentPercent.toString(),
            minMonthlyPayment: property.minMonthlyPayment.toString(),
            status: property.status,
            images: property.images || [],
            videos: property.videos || [],
          })

          // Set images and videos state
          setImages(property.images || [])
          setVideos(property.videos || [])
        } else {
          toast.error('Property not found')
          router.push('/developer/listings')
        }
      } catch (error) {
        console.error('Error fetching property:', error)
        toast.error('Failed to load property data')
        router.push('/developer/listings')
      } finally {
        setIsLoading(false)
      }
    }

    if (propertyId) {
      fetchPropertyData()
    }
  }, [propertyId, router, reset])

  // Handle property type selection
  const handlePropertyTypeChange = (value: string) => {
    setValue('propertyType', value)
  }

  // Handle status selection
  const handleStatusChange = (value: 'pending' | 'approved' | 'rejected') => {
    setValue('status', value)
  }

  const handleAddImage = (base64: string) => {
    setImages((prev) => [...prev, base64])
  }

  const handleAddVideo = (base64: string) => {
    setVideos((prev) => [...prev, base64])
  }

  const handleRemoveVideo = (idx: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  useEffect(() => {
    setValue('images', images)
  }, [images, setValue])

  useEffect(() => {
    setValue('videos', videos)
  }, [videos, setValue])

  // Handle form submission
  const onSubmit = (data: PropertyFormData) => {
    setImageError('')

    // Validate images
    if (images.length === 0) {
      setImageError('At least one image is required.')
      return
    }

    // Ensure all images are valid base64 strings
    const validImages = images.filter((img) => {
      if (!img || typeof img !== 'string') return false
      // Check if it's a valid base64 image string or URL
      return img.startsWith('data:image/') || img.startsWith('http')
    })

    if (validImages.length === 0) {
      setImageError('At least one valid image is required.')
      return
    }

    // Ensure all videos are valid base64 strings (if any)
    const validVideos = videos.filter((vid) => {
      if (!vid || typeof vid !== 'string') return false
      // Check if it's a valid base64 video string or URL
      return vid.startsWith('data:video/') || vid.startsWith('http')
    })

    // Create a clean copy of the data with proper string conversions
    const enrichedData = {
      ...data,
      // Ensure all numeric values are properly converted to strings
      price: data.price ? data.price.toString() : '0',
      minDownPaymentPercent: data.minDownPaymentPercent
        ? data.minDownPaymentPercent.toString()
        : '0',
      minMonthlyPayment: data.minMonthlyPayment
        ? data.minMonthlyPayment.toString()
        : '0',
      bedrooms: data.bedrooms ? data.bedrooms.toString() : '0',
      // Use the validated arrays
      images: validImages,
      videos: validVideos,
    }

    updatePropertyMutation.mutate(enrichedData)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7C0A02]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0ED] to-white space-y-6 px-4 py-6 md:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Link
          href={`/developer/properties/${propertyId}`}
          className="text-gray-600 hover:text-[#FF9A8B] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#333333]">
            Edit Property
          </h1>
          <p className="text-gray-600">Update your property listing</p>
        </div>
      </div>

      <Card className="p-4 md:p-6 border border-[#FFE4E0] shadow-md rounded-xl bg-white">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#7C0A02] flex items-center">
              <span className="inline-block w-1.5 h-6 bg-[#FF9A8B] mr-2 rounded-full"></span>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#333333] font-medium">
                  Property Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter property name"
                  className="border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20"
                  {...register('name', {
                    required: 'Property name is required',
                  })}
                />
                {errors.name && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="propertyType"
                  className="text-[#333333] font-medium"
                >
                  Property Type
                </Label>
                <Select
                  onValueChange={handlePropertyTypeChange}
                  value={selectedPropertyType}
                >
                  <SelectTrigger className="border-[#FFE4E0] focus:ring-[#FF9A8B]/20">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyType && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.propertyType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="description"
                  className="text-[#333333] font-medium"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the property"
                  rows={4}
                  className="border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20 resize-none"
                  {...register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 20,
                      message: 'Description should be at least 20 characters',
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#FFE4E0]">
            <h2 className="text-xl font-semibold text-[#7C0A02] flex items-center">
              <span className="inline-block w-1.5 h-6 bg-[#FF9A8B] mr-2 rounded-full"></span>
              Images
            </h2>
            <div className="flex flex-wrap gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img || '/placeholder.svg'}
                    alt={`uploaded-img-${idx}`}
                    className="w-32 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-red-100 rounded p-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <ImageUploaderComponent onUploadImage={handleAddImage} />
              )}
            </div>
            <p className="text-xs text-gray-500">
              You can upload up to 5 images.
            </p>
            {imageError && (
              <p className="text-[#7C0A02] text-sm">{imageError}</p>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-[#FFE4E0]">
            <h2 className="text-xl font-semibold text-[#7C0A02] flex items-center">
              <span className="inline-block w-1.5 h-6 bg-[#FF9A8B] mr-2 rounded-full"></span>
              Videos
            </h2>
            <div className="flex flex-wrap gap-4">
              {videos.map((vid, idx) => (
                <div key={idx} className="relative">
                  <video src={vid} controls className="w-40 h-28 rounded" />
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(idx)}
                    className="absolute top-1 right-1 bg-red-100 rounded p-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {videos.length < 2 && (
                <VideoUploader onUploadVideo={handleAddVideo} />
              )}
            </div>
            <p className="text-xs text-gray-500">
              You can upload up to 2 videos. MP4, WebM or MOV (max 100MB each).
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#FFE4E0]">
            <h2 className="text-xl font-semibold text-[#7C0A02] flex items-center">
              <span className="inline-block w-1.5 h-6 bg-[#FF9A8B] mr-2 rounded-full"></span>
              Location & Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-[#333333] font-medium"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Enter property location"
                  className="border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20"
                  {...register('location', {
                    required: 'Location is required',
                  })}
                />
                {errors.location && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="bedrooms"
                  className="text-[#333333] font-medium"
                >
                  Bedrooms
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  className="border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20"
                  {...register('bedrooms', {
                    min: {
                      value: 0,
                      message: 'Bedrooms cannot be negative',
                    },
                  })}
                />
                {errors.bedrooms && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.bedrooms.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#FFE4E0]">
            <h2 className="text-xl font-semibold text-[#7C0A02] flex items-center">
              <span className="inline-block w-1.5 h-6 bg-[#FF9A8B] mr-2 rounded-full"></span>
              Pricing Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-[#333333] font-medium">
                  Price (₦)
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  className="border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20"
                  {...register('price', {
                    required: 'Price is required',
                    min: {
                      value: 0,
                      message: 'Price cannot be negative',
                    },
                  })}
                />
                {errors.price && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="minDownPaymentPercent"
                  className="text-[#333333] font-medium"
                >
                  Minimum Down Payment (%)
                </Label>
                <Input
                  id="minDownPaymentPercent"
                  type="number"
                  min="0"
                  max="100"
                  className="border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20"
                  {...register('minDownPaymentPercent', {
                    required: 'Minimum down payment percentage is required',
                    min: {
                      value: 0,
                      message: 'Percentage cannot be negative',
                    },
                    max: {
                      value: 100,
                      message: 'Percentage cannot exceed 100%',
                    },
                  })}
                />
                {errors.minDownPaymentPercent && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.minDownPaymentPercent.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label
                  htmlFor="minMonthlyPayment"
                  className="text-[#333333] font-medium"
                >
                  Minimum Monthly Payment (₦)
                </Label>
                <Input
                  id="minMonthlyPayment"
                  type="number"
                  min="0"
                  className="border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20"
                  {...register('minMonthlyPayment', {
                    required: 'Minimum monthly payment is required',
                    min: {
                      value: 0,
                      message: 'Payment cannot be negative',
                    },
                  })}
                />
                {errors.minMonthlyPayment && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.minMonthlyPayment.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#FFE4E0]">
            <h2 className="text-xl font-semibold text-[#7C0A02] flex items-center">
              <span className="inline-block w-1.5 h-6 bg-[#FF9A8B] mr-2 rounded-full"></span>
              Status
            </h2>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[#333333] font-medium">
                Listing Status
              </Label>
              <Select
                onValueChange={(value) =>
                  handleStatusChange(
                    value as 'pending' | 'approved' | 'rejected'
                  )
                }
                value={selectedStatus}
              >
                <SelectTrigger className="border-[#FFE4E0] focus:ring-[#FF9A8B]/20">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-[#7C0A02] text-sm">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-[#FFE4E0]">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/developer/properties/${propertyId}`)}
              className="px-4 py-2 border-[#FF9A8B] text-[#7C0A02] hover:bg-[#FFF0ED]"
              disabled={updatePropertyMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={updatePropertyMutation.isPending}
              className="px-4 py-2 bg-[#7C0A02] text-white hover:bg-[#600000] shadow-md transition-all duration-200 hover:shadow-lg"
              disabled={updatePropertyMutation.isPending}
            >
              {updatePropertyMutation.isPending
                ? 'Updating Property...'
                : 'Update Property'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
