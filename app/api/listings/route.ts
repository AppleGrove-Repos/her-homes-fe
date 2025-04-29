import { type NextRequest, NextResponse } from 'next/server'

// Define the Property type to match the actual API response
export interface Property {
  _id: string
  id: string
  name: string
  propertyType: string
  location: string
  price: number
  minMonthlyPayment: number
  rating: number
  images: string[]
  description: string
  minDownPaymentPercent: number
  videos: string[]
  developer: any
  status: string
  createdAt: string
  updatedAt: string
  __v: number
  tags?: string[] // optional
}

// Define the API response type
export interface PropertyListingResponse {
  success: boolean
  message: string
  data: Property[]
  total?: number
  page?: number
  limit?: number
}

export async function GET(request: NextRequest) {
  try {
    // Get search params from the request URL
    const searchParams = request.nextUrl.searchParams

    // Build query parameters for the external API
    const queryParams = new URLSearchParams()

    // Add filters from URL to API request with proper formatting
    if (searchParams.get('propertyType')) {
      queryParams.append('propertyType', searchParams.get('propertyType')!)
    }

    // Handle price range conversion
    if (searchParams.get('priceRange')) {
      const priceRange = searchParams.get('priceRange')!

      // Parse the price range format (e.g., "10m-25m") into min and max values
      try {
        const [min, max] = priceRange.split('-')

        // Convert from "10m" format to actual numbers (in millions)
        const minPrice = Number.parseInt(min.replace('m', '')) * 1000000
        const maxPrice = Number.parseInt(max.replace('m', '')) * 1000000

        // Add as separate min and max price parameters
        queryParams.append('minPrice', minPrice.toString())
        queryParams.append('maxPrice', maxPrice.toString())

        console.log(
          `Converting price range ${priceRange} to minPrice=${minPrice}, maxPrice=${maxPrice}`
        )
      } catch (error) {
        console.error('Error parsing price range:', error)
        // If parsing fails, pass the original value
        queryParams.append('priceRange', priceRange)
      }
    }

    // Handle bedrooms conversion
    if (searchParams.get('bedrooms')) {
      const bedrooms = searchParams.get('bedrooms')!

      // Convert from "2+" format to a minimum number
      if (bedrooms.endsWith('+')) {
        const minBedrooms = Number.parseInt(bedrooms.replace('+', ''))
        queryParams.append('minBedrooms', minBedrooms.toString())
        console.log(
          `Converting bedrooms ${bedrooms} to minBedrooms=${minBedrooms}`
        )
      } else {
        queryParams.append('bedrooms', bedrooms)
      }
    }

    if (searchParams.get('location')) {
      queryParams.append('location', searchParams.get('location')!)
    }

    // Handle search query
    if (searchParams.get('searchQuery')) {
      queryParams.append('search', searchParams.get('searchQuery')!)
    } else if (searchParams.get('search')) {
      queryParams.append('search', searchParams.get('search')!)
    }

    // Handle more filters
    if (searchParams.get('moreFilters')) {
      const moreFilters = searchParams.get('moreFilters')!
      queryParams.append('amenities', moreFilters)
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

    // If the API returns an error, log more details for debugging
    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => 'No error text available')
      console.error(
        `External API error: ${response.status}. Details: ${errorText}`
      )

      // Return a fallback response with empty data instead of throwing
      return NextResponse.json(
        {
          data: [],
          total: 0,
          success: false,
          message: `API Error: ${response.status}`,
        },
        { status: 200 } // Return 200 to the client to avoid breaking the UI
      )
    }

    const apiResponse: PropertyListingResponse = await response.json()

    // Return the data with proper structure
    return NextResponse.json(
      {
        data: apiResponse.data || [],
        total: apiResponse.data?.length || 0,
        success: apiResponse.success,
        message: apiResponse.message,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in listings API:', error)

    // Return empty data instead of an error
    return NextResponse.json(
      {
        data: [],
        total: 0,
        success: false,
        message: 'Failed to fetch properties',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 } // Return 200 to avoid breaking the UI
    )
  }
}
