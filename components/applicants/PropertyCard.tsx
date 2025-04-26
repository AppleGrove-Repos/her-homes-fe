import Image from 'next/image'
import {Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PropertyCardProps {
  type: string
  location: string
  price: string
  monthlyPayment: string
  rating: number
  tags: string[]
  imageUrl: string
}

function PropertyCard({
  type,
  location,
  price,
  monthlyPayment,
  rating,
  tags,
  imageUrl,
}: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="relative">
        <Image
          src={imageUrl || '/placeholder.svg'}
          alt={type}
          width={400}
          height={300}
          className="w-full h-[200px] object-cover"
        />
        <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full">
          <Heart className="h-5 w-5 text-gray-500" />
        </button>
        <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Featured
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{type}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm ml-1">{rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3">{location}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-bold text-lg">{price}</p>
            <p className="text-xs text-gray-500">20% Down Payment</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm">{monthlyPayment} / Mon</p>
            <p className="text-xs text-gray-500">30% Down Payment</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="text-sm">
            Contact Agent
          </Button>
          <Button className="bg-green-700 hover:bg-green-800 text-sm">
            Apply for Mortgage
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard;