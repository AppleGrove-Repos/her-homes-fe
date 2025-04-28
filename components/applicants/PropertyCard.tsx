import Image from 'next/image'
import { Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface PropertyCardProps {
  id?: string
  name:string
  type: string
  location: string
  price: string
  monthlyPayment: string
  rating: number
  tags: string[]
  imageUrl: string
}

function PropertyCard({
  id= '1',
  name,
  type,
  location,
  price,
  monthlyPayment,
  rating,
  tags,
  imageUrl,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when clicking favorite
    setIsFavorite(!isFavorite)
  }

  const handleCardClick = () => {
    // Navigate to property details page
    router.push(`/listings/${id}`)
  }

  const handleActionClick = (action: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when clicking buttons

    if (!isAuthenticated) {
      // Store the intended action and property ID in query params
      router.push(`/login?redirect=/listing/${id}&action=${action}`)
      return
    }

    // If authenticated, navigate to the appropriate page
    switch (action) {
      case 'contact':
        router.push(`/user/listings/${id}/contact`)
        break
      case 'mortgage':
        router.push(`/user/listings/${id}/mortgage`)
        break
      case 'view-more':
        router.push(`/user/listings/${id}`)
        break
      default:
        router.push(`/listings/${id}`)
    }
  }
  return (
    <div
      className="bg-white rounded-2xl shadow-lg shadow-white w-full max-w-sm mx-auto p-4 transition-transform hover:scale-105 duration-300"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative mb-4">
        <div className="rounded-2xl overflow-hidden  shadow-md">
          <Image
            src={imageUrl || '/placeholder.svg'}
            alt={type}
            width={400}
            height={300}
            className="w-full h-[250px] object-cover rounded-2xl"
          />
        </div>

        {/* Heart Button */}
        <button
          className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md hover:scale-110 transition"
          onClick={handleFavoriteClick}
        >
          <Heart
            className={`h-5 w-5${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>

        {/* Popular Badge */}
        <div className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-semibold px-3 py-1 rounded-full">
          Popular
        </div>
      </div>

      {/* Content Section */}
      <div>
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm ml-1">{rating}</span>
          </div>
        </div>

        {/* Location */}
        <p className="text-gray-600 text-sm mb-3">{location}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-[#546B2F] text-white text-[8px] font-semibold px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="flex justify-between items-end mb-5">
          <div>
            <p className="font-bold text-lg">{price}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">
              {monthlyPayment}{' '}
              <span className="text-sm font-normal">/ Mon</span>
            </p>
            <p className="text-[10px] text-gray-500">30% Down Payment</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="text-sm border-black"
            onClick={(e) => handleActionClick('contact', e)}
          >
            Contact Agent
          </Button>
          <Button
            className="bg-[#7C0A02] hover:bg-[#600000] text-white text-sm "
            onClick={(e) => handleActionClick('mortgage', e)}
          >
            Apply for Mortgage
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
