import { type NextRequest, NextResponse } from 'next/server'

// Define the Property type
export interface Property {
  id: string
  propertyType: string
  name: string
  location: string
  price: number
  minMonthlyPayment: number
  rating: number
  images: string[]
  tags?: string[] // optional
}

// Define the API response type
export interface PropertyListingResponse {
  data: Property[]
  total: number
  page: number
  limit: number
}

export async function GET(request: NextRequest) {
  try {
    // Get search params from the request URL
    const searchParams = request.nextUrl.searchParams

    // Build query parameters for the external API
    const queryParams = new URLSearchParams()

    // Add filters from URL to API request
    if (searchParams.get('propertyType')) {
      queryParams.append('propertyType', searchParams.get('propertyType')!)
    }

    if (searchParams.get('priceRange')) {
      queryParams.append('priceRange', searchParams.get('priceRange')!)
    }

    if (searchParams.get('bedrooms')) {
      queryParams.append('bedrooms', searchParams.get('bedrooms')!)
    }

    if (searchParams.get('location')) {
      queryParams.append('location', searchParams.get('location')!)
    }

    if (searchParams.get('search')) {
      queryParams.append('search', searchParams.get('search')!)
    }

    // Set default limit if not provided
    if (!searchParams.get('limit')) {
      queryParams.append('limit', '34')
    } else {
      queryParams.append('limit', searchParams.get('limit')!)
    }

    // Fetch data from external API
    const apiUrl = `https://her-homes-dev.onrender.com/listing?${queryParams.toString()}`
    console.log('Fetching from API URL:', apiUrl)

    const response = await fetch(apiUrl, {
      
      next: {
        revalidate: 60, // Revalidate every 60 seconds
      },
    })

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`)
    }

    const data: PropertyListingResponse = await response.json()

    // Return the data with proper headers
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error in listings API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}
