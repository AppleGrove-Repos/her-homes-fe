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
import { ArrowLeft, Check, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
]

interface PropertyFormData {
  title: string
  propertyDescription: string
  neighborhoodDescription: string
  propertyAddress: string
  nearbyLandmark: string
  images: string[]
  videos: string[]
  price: number
  propertyType: string
  minDownPaymentPercent: number
  minMonthlyPayment: number
  specifications: {
    bedrooms: number
    area: number
    floor: number
    bathrooms?: number
    parkingSlots?: number
    [key: string]: number | undefined
  }
  features: Record<string, boolean>
}

const uploadSteps = [
  { id: 'basic', label: 'Basic Info', completed: false },
  { id: 'pricing', label: 'Pricing', completed: false },
  { id: 'specifications', label: 'Specifications', completed: false },
  { id: 'features', label: 'Features', completed: false },
  { id: 'media', label: 'Media', completed: false },
  { id: 'location', label: 'Location', completed: false },
]

const defaultFeatures = [
  'POP ceiling',
  'Modern kitchen',
  'Marble flooring',
  'Granite countertops',
  'CCTV infrastructure',
  'En-suite bathrooms',
  'Swimming pool',
  'Gym',
  'Parking space',
  'Generator',
  'Security',
  'Garden',
]

async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Failed to convert to base64'))
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const propertyId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [imageError, setImageError] = useState('')
  const [videos, setVideos] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<PropertyFormData>({
    defaultValues: {
      title: '',
      propertyDescription: '',
      neighborhoodDescription: '',
      propertyAddress: '',
      nearbyLandmark: '',
      price: 0,
      images: [],
      videos: [],
      propertyType: '',
      minDownPaymentPercent: 0,
      minMonthlyPayment: 0,
      specifications: {
        bedrooms: 0,
        area: 0,
        floor: 0,
        bathrooms: 0,
        parkingSlots: 0,
      },
      features: {},
    },
  })

  const selectedPropertyType = watch('propertyType')

  const [features, setFeatures] = useState<Record<string, boolean>>({})
  const [customSpecs, setCustomSpecs] = useState<
    { name: string; value: number }[]
  >([])
  const [showFeatureModal, setShowFeatureModal] = useState(false)
  const [showSpecModal, setShowSpecModal] = useState(false)
  const [newFeature, setNewFeature] = useState('')
  const [newSpecName, setNewSpecName] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')

  // Update property mutation
  const updatePropertyMutation = useMutation({
    mutationFn: (data: any) => updateProperty(propertyId, data),
    onSuccess: () => {
      toast.success('Property updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['propertyListings'] })
      router.push(`/developers/properties/${propertyId}`)
    },
    onError: (error) => {
      console.error('Error updating property:', error)
      toast.error('Failed to update property. Please try again.')
      setIsSubmitting(false)
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
            title: property.title || property.name,
            propertyDescription:
              property.propertyDescription || property.description,
            neighborhoodDescription: property.neighborhoodDescription || '',
            propertyAddress: property.propertyAddress || property.location,
            nearbyLandmark: property.nearbyLandmark || '',
            price: property.price,
            propertyType: property.propertyType,
            minDownPaymentPercent: property.minDownPaymentPercent,
            minMonthlyPayment: property.minMonthlyPayment,
            specifications: {
              bedrooms:
                property.specifications?.bedrooms || property.bedrooms || 0,
              area: property.specifications?.area || 0,
              floor: property.specifications?.floor || 0,
              bathrooms: property.specifications?.bathrooms || 0,
              parkingSlots: property.specifications?.parkingSlots || 0,
            },
            features: property.features || {},
            images: property.images || [],
            videos: property.videos || [],
          })

          // Set images and videos state
          setImages(property.images || [])
          setVideos(property.videos || [])
          setFeatures(property.features || {})

          // Extract custom specifications
          if (property.specifications) {
            const standardSpecs = [
              'bedrooms',
              'area',
              'floor',
              'bathrooms',
              'parkingSlots',
            ]
            const customSpecsArray = Object.entries(property.specifications)
              .filter(([key]) => !standardSpecs.includes(key))
              .map(([name, value]) => ({ name, value: Number(value) }))
            setCustomSpecs(customSpecsArray)
          }
        } else {
          toast.error('Property not found')
          router.push('/developers/listing')
        }
      } catch (error) {
        console.error('Error fetching property:', error)
        toast.error('Failed to load property data')
        router.push('/developers/listing')
      } finally {
        setIsLoading(false)
      }
    }

    if (propertyId) {
      fetchPropertyData()
    }
  }, [propertyId, router, reset])

  const toggleFeature = (feature: string) => {
    setFeatures((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }))
  }

  const addCustomFeature = () => {
    if (newFeature.trim() && !features.hasOwnProperty(newFeature.trim())) {
      setFeatures((prev) => ({
        ...prev,
        [newFeature.trim()]: true,
      }))
      setNewFeature('')
      setShowFeatureModal(false)
    }
  }

  const addCustomSpec = () => {
    if (newSpecName.trim() && newSpecValue.trim()) {
      const value = Number.parseFloat(newSpecValue.trim())
      if (!isNaN(value)) {
        setCustomSpecs((prev) => [...prev, { name: newSpecName.trim(), value }])
        setNewSpecName('')
        setNewSpecValue('')
        setShowSpecModal(false)
      }
    }
  }

  const removeCustomSpec = (index: number) => {
    setCustomSpecs((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePropertyTypeChange = (value: string) => {
    setValue('propertyType', value)
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

  useEffect(() => {
    setValue('features', features)
  }, [features, setValue])

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    setImageError('')

    try {
      if (images.length === 0) {
        setImageError('At least one image is required.')
        setIsSubmitting(false)
        return
      }

      // Convert all images to base64 (even if they are URLs)
      const base64Images = await Promise.all(
        images.map(async (img) => {
          if (img.startsWith('data:image/')) return img
          if (img.startsWith('http')) return await urlToBase64(img)
          return img
        })
      )

      if (base64Images.length === 0) {
        setImageError('At least one valid image is required.')
        setIsSubmitting(false)
        return
      }

      // Convert all videos to base64 (even if they are URLs)
      const base64Videos = await Promise.all(
        videos.map(async (vid) => {
          if (vid.startsWith('data:video/')) return vid
          if (vid.startsWith('http')) return await urlToBase64(vid)
          return vid
        })
      )

      // Prepare specifications object with custom specs
      const specifications: { [key: string]: number } = {
        bedrooms: Number.parseInt(data.specifications.bedrooms.toString()) || 0,
        area: Number.parseInt(data.specifications.area.toString()) || 0,
        floor: Number.parseInt(data.specifications.floor.toString()) || 0,
        bathrooms:
          Number.parseInt(data.specifications.bathrooms?.toString() || '0') ||
          0,
        parkingSlots:
          Number.parseInt(
            data.specifications.parkingSlots?.toString() || '0'
          ) || 0,
      }

      // Add custom specifications
      customSpecs.forEach((spec) => {
        specifications[spec.name.toLowerCase().replace(/\s+/g, '')] = spec.value
      })

      const propertyData = {
        title: data.title,
        propertyDescription: data.propertyDescription,
        neighborhoodDescription: data.neighborhoodDescription,
        propertyAddress: data.propertyAddress,
        nearbyLandmark: data.nearbyLandmark,
        images: base64Images,
        videos: base64Videos,
        price: (Number.parseFloat(data.price.toString()) || 0).toString(),
        propertyType: data.propertyType,
        minDownPaymentPercent:
          (Number.parseFloat(data.minDownPaymentPercent.toString()) || 0).toString(),
        minMonthlyPayment:
          (Number.parseFloat(data.minMonthlyPayment.toString()) || 0).toString(),
        specifications,
        features,
      }

      console.log('Updating property data:', propertyData)
      updatePropertyMutation.mutate(propertyData)
    } catch (error: any) {
      const errorMessage = error?.message || 'Please try again.'
      toast.error(`Failed to update property: ${errorMessage}`)
      console.error('Error updating property:', error)
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading property data...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/developers/properties/${propertyId}`}
            className="text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Property</h1>
            <p className="text-gray-600">Update your property listing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Upload Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Update Progress
              </h3>
              <div className="space-y-4">
                {uploadSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        completedSteps.includes(step.id)
                          ? 'bg-green-500 text-white'
                          : index === currentStep
                          ? 'bg-green-100 text-green-600 border-2 border-green-500'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {completedSteps.includes(step.id) ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        completedSteps.includes(step.id)
                          ? 'text-green-600 font-medium'
                          : index === currentStep
                          ? 'text-gray-800 font-medium'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3">Quick Tips</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Update high-quality images for better engagement</p>
                  <p>• Review property description for accuracy</p>
                  <p>• Verify all pricing information</p>
                  <p>• Check nearby landmarks</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="text-gray-700 font-medium"
                      >
                        Property Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g. 3-Bedroom Bungalow in Lekki"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                        {...register('title', {
                          required: 'Property title is required',
                        })}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="propertyType"
                        className="text-gray-700 font-medium"
                      >
                        Property Type
                      </Label>
                      <Select
                        onValueChange={handlePropertyTypeChange}
                        value={selectedPropertyType}
                      >
                        <SelectTrigger className="border-gray-300 focus:ring-green-500/20">
                          <SelectValue placeholder="Select Type" />
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
                        <p className="text-red-500 text-sm">
                          {errors.propertyType.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="propertyDescription"
                        className="text-gray-700 font-medium"
                      >
                        Property Description
                      </Label>
                      <Textarea
                        id="propertyDescription"
                        placeholder="Describe the property features, layout, and unique selling points..."
                        rows={4}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 resize-none"
                        {...register('propertyDescription', {
                          required: 'Property description is required',
                          minLength: {
                            value: 20,
                            message:
                              'Description should be at least 20 characters',
                          },
                        })}
                      />
                      {errors.propertyDescription && (
                        <p className="text-red-500 text-sm">
                          {errors.propertyDescription.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="neighborhoodDescription"
                        className="text-gray-700 font-medium"
                      >
                        Neighborhood Description
                      </Label>
                      <Textarea
                        id="neighborhoodDescription"
                        placeholder="Describe the neighborhood, nearby amenities, and location benefits..."
                        rows={3}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 resize-none"
                        {...register('neighborhoodDescription', {
                          required: 'Neighborhood description is required',
                        })}
                      />
                      {errors.neighborhoodDescription && (
                        <p className="text-red-500 text-sm">
                          {errors.neighborhoodDescription.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing & Mortgage */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Pricing & Mortgage
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="price"
                        className="text-gray-700 font-medium"
                      >
                        Total Price (₦)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        placeholder="50000000"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                        {...register('price', {
                          required: 'Price is required',
                          min: {
                            value: 0,
                            message: 'Price cannot be negative',
                          },
                        })}
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm">
                          {errors.price.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="minDownPaymentPercent"
                        className="text-gray-700 font-medium"
                      >
                        Down Payment %
                      </Label>
                      <Input
                        id="minDownPaymentPercent"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="20"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                        {...register('minDownPaymentPercent', {
                          required: 'Down payment percentage is required',
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
                        <p className="text-red-500 text-sm">
                          {errors.minDownPaymentPercent.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="minMonthlyPayment"
                        className="text-gray-700 font-medium"
                      >
                        Monthly Payment (₦)
                      </Label>
                      <Input
                        id="minMonthlyPayment"
                        type="number"
                        min="0"
                        placeholder="500000"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                        {...register('minMonthlyPayment', {
                          required: 'Monthly payment is required',
                          min: {
                            value: 0,
                            message: 'Payment cannot be negative',
                          },
                        })}
                      />
                      {errors.minMonthlyPayment && (
                        <p className="text-red-500 text-sm">
                          {errors.minMonthlyPayment.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Property Specifications */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Property Specifications
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="bedrooms"
                        className="text-gray-700 font-medium"
                      >
                        Bedrooms
                      </Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        min="0"
                        placeholder="3"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                        {...register('specifications.bedrooms', {
                          min: {
                            value: 0,
                            message: 'Bedrooms cannot be negative',
                          },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="bathrooms"
                        className="text-gray-700 font-medium"
                      >
                        Bathrooms
                      </Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="0"
                        placeholder="2"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                        {...register('specifications.bathrooms', {
                          min: {
                            value: 0,
                            message: 'Bathrooms cannot be negative',
                          },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="area"
                        className="text-gray-700 font-medium"
                      >
                        Area (sqm)
                      </Label>
                      <Input
                        id="area"
                        type="number"
                        min="0"
                        placeholder="120"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                        {...register('specifications.area', {
                          min: {
                            value: 0,
                            message: 'Area cannot be negative',
                          },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="parkingSlots"
                        className="text-gray-700 font-medium"
                      >
                        Parking Slots
                      </Label>
                      <Input
                        id="parkingSlots"
                        type="number"
                        min="0"
                        placeholder="2"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                        {...register('specifications.parkingSlots', {
                          min: {
                            value: 0,
                            message: 'Parking slots cannot be negative',
                          },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="floor"
                        className="text-gray-700 font-medium"
                      >
                        Floor
                      </Label>
                      <Input
                        id="floor"
                        type="number"
                        min="0"
                        placeholder="2"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                        {...register('specifications.floor', {
                          min: {
                            value: 0,
                            message: 'Floor cannot be negative',
                          },
                        })}
                      />
                    </div>
                  </div>

                  {/* Custom Specifications */}
                  {customSpecs.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium">
                        Additional Specifications
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customSpecs.map((spec, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                          >
                            <span className="text-sm text-gray-700">
                              {spec.name}: {spec.value}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeCustomSpec(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={() => setShowSpecModal(true)}
                    className="border-green-300 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    + Add Specifications
                  </Button>
                </div>

                {/* Property Features */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Property Features
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(features).map(([feature, isSelected]) => (
                      <label
                        key={feature}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleFeature(feature)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={() => setShowFeatureModal(true)}
                    className="border-green-300 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    + Add Features
                  </Button>
                </div>

                {/* Media Upload */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Media Upload
                  </h2>

                  {/* Images */}
                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium">
                      Property Images
                    </Label>

                    {/* Existing Images */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={img || '/placeholder.svg'}
                              alt={`Property image ${idx + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                            {idx === 0 && (
                              <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                Cover
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Area */}
                    {images.length < 10 && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-600 mb-2">
                            Drop your images here or{' '}
                            <button
                              type="button"
                              className="text-green-600 hover:underline"
                            >
                              browse
                            </button>
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 10MB each (Max 10 images)
                          </p>
                        </div>
                      </div>
                    )}

                    {imageError && (
                      <p className="text-red-500 text-sm">{imageError}</p>
                    )}
                  </div>

                  {/* Videos */}
                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium">
                      Property Videos (Optional)
                    </Label>

                    {/* Existing Videos */}
                    {videos.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {videos.map((vid, idx) => (
                          <div key={idx} className="relative group">
                            <video
                              src={vid}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              controls
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveVideo(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Area */}
                    {videos.length < 3 && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-600 mb-2">
                            Drop your videos here or{' '}
                            <button
                              type="button"
                              className="text-green-600 hover:underline"
                            >
                              browse
                            </button>
                          </p>
                          <p className="text-xs text-gray-500">
                            MP4, WebM, MOV up to 100MB each (Max 3 videos)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location & Map */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Location & Map
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="propertyAddress"
                        className="text-gray-700 font-medium"
                      >
                        Property Address
                      </Label>
                      <Input
                        id="propertyAddress"
                        placeholder="Enter full property address"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                        {...register('propertyAddress', {
                          required: 'Property address is required',
                        })}
                      />
                      {errors.propertyAddress && (
                        <p className="text-red-500 text-sm">
                          {errors.propertyAddress.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="nearbyLandmark"
                        className="text-gray-700 font-medium"
                      >
                        Nearby Landmarks
                      </Label>
                      <Textarea
                        id="nearbyLandmark"
                        placeholder="List nearby landmarks with distances (e.g. 5 minutes to Lekki Phase I Gate)"
                        rows={3}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                        {...register('nearbyLandmark', {
                          required: 'Nearby landmarks are required',
                        })}
                      />
                      {errors.nearbyLandmark && (
                        <p className="text-red-500 text-sm">
                          {errors.nearbyLandmark.message}
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        Map integration will appear here
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="small"
                        className="mt-3 border-green-300 text-green-600 hover:bg-green-50 bg-transparent"
                      >
                        📍 Update Location
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    onClick={() =>
                      router.push(`/developers/properties/${propertyId}`)
                    }
                  >
                    💾 Save as Draft
                  </Button>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    className="bg-green-600 text-white hover:bg-green-700 shadow-md transition-all duration-200"
                  >
                    {isSubmitting
                      ? 'Updating Property...'
                      : '✅ Update Property'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Feature Modal */}
      {showFeatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Custom Feature</h3>
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Enter feature name"
              className="mb-4"
              onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFeatureModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={addCustomFeature}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Feature
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Specification Modal */}
      {showSpecModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Add Custom Specification
            </h3>
            <div className="space-y-4">
              <Input
                value={newSpecName}
                onChange={(e) => setNewSpecName(e.target.value)}
                placeholder="Specification name (e.g., Pool Size)"
                className="mb-2"
              />
              <Input
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                placeholder="Numeric value (e.g., 50)"
                type="number"
                onKeyPress={(e) => e.key === 'Enter' && addCustomSpec()}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSpecModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={addCustomSpec}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Specification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
