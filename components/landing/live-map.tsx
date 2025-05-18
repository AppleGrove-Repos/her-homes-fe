'use client'

import { useEffect, useState, useRef } from 'react'
import { Loader } from 'lucide-react'

interface LiveMapProps {
  address: string
  height?: number
}

// Known locations with their coordinates
const KNOWN_LOCATIONS: Record<string, [number, number]> = {
  '15 Cedar Avenue, Ikoyi, Lagos, Nigeria': [6.45, 3.4167], // Approximate coordinates for Ikoyi, Lagos
}

export default function LiveMap({ address, height = 300 }: LiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mapInitializedRef = useRef(false)

  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window === 'undefined') return

    let map: any = null

    const loadLeaflet = async () => {
      try {
        setIsLoading(true)

        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)
        }

        // Load Leaflet JS
        if (!window.L) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
            script.onload = () => resolve()
            script.onerror = () => reject(new Error('Failed to load Leaflet'))
            document.head.appendChild(script)
          })
        }

        // Make sure the map container is ready
        if (!mapRef.current) {
          throw new Error('Map container not found')
        }

        // Check if we have hardcoded coordinates for this address
        let coordinates: [number, number] | null = null

        if (KNOWN_LOCATIONS[address]) {
          console.log('Using hardcoded coordinates for:', address)
          coordinates = KNOWN_LOCATIONS[address]
        } else {
          // Try geocoding with Nominatim
          try {
            console.log('Geocoding address:', address)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                address
              )}`
            )

            if (!response.ok) {
              throw new Error(
                `Geocoding failed with status: ${response.status}`
              )
            }

            const data = await response.json()
            console.log('Geocoding response:', data)

            if (data && data.length > 0) {
              const { lat, lon } = data[0]
              coordinates = [Number.parseFloat(lat), Number.parseFloat(lon)]
            }
          } catch (geocodeError) {
            console.error('Geocoding error:', geocodeError)
            // Continue to fallback if geocoding fails
          }
        }

        // If we still don't have coordinates, use a default location
        if (!coordinates) {
          console.log('Using default coordinates (Lagos)')
          coordinates = [6.5244, 3.3792] // Default to Lagos city center
        }

        // Initialize the map with our coordinates
        map = window.L.map(mapRef.current).setView(coordinates, 15)

        // Add the OpenStreetMap tile layer
        window.L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        ).addTo(map)

        // Add a marker at the location
        window.L.marker(coordinates).addTo(map)

        // Ensure the map renders correctly
        setTimeout(() => {
          map.invalidateSize()
        }, 100)

        setIsLoading(false)
        mapInitializedRef.current = true
      } catch (err) {
        console.error('Map initialization error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load map')
        setIsLoading(false)
      }
    }

    loadLeaflet()

    // Cleanup function
    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [address])

  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{ height: `${height}px` }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <Loader className="h-8 w-8 text-rose-700 animate-spin" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-red-500 text-center p-4">
            <p className="font-medium">Error loading map</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

// Add TypeScript definitions for Leaflet
declare global {
  interface Window {
    L: any
  }
}
