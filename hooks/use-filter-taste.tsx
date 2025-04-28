'use client'
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from './use-auth'

interface FilterState {
  propertyType: string
  priceRange: string
  bedrooms: string
  location: string
  moreFilters: string
  searchQuery: string
}

interface FilterContextType {
  filters: FilterState
  setFilter: (key: keyof FilterState, value: string) => void
  resetFilters: () => void
  applyFilters: () => void
}

const initialFilters: FilterState = {
  propertyType: '',
  priceRange: '',
  bedrooms: '',
  location: '',
  moreFilters: '',
  searchQuery: '',
}

const FilterContext = createContext<FilterContextType>({
  filters: initialFilters,
  setFilter: () => {},
  resetFilters: () => {},
  applyFilters: () => {},
})

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  // Load filters from URL on mount and when URL changes
  useEffect(() => {
    const newFilters = { ...initialFilters }

    // Get filters from URL
    for (const key of Object.keys(initialFilters)) {
      const value = searchParams.get(key)
      if (value) {
        newFilters[key as keyof FilterState] = value
      }
    }

    setFilters(newFilters)
  }, [searchParams])

  // For authenticated users, load saved filters from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const savedFilters = localStorage.getItem('propertyFilters')
      if (savedFilters) {
        try {
          const parsedFilters = JSON.parse(savedFilters)
          setFilters((prev) => ({ ...prev, ...parsedFilters }))
        } catch (error) {
          console.error('Failed to parse saved filters:', error)
        }
      }
    }
  }, [isAuthenticated])

  // Save filters to localStorage for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('propertyFilters', JSON.stringify(filters))
    }
  }, [filters, isAuthenticated])

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)

    // Update URL without filters
    router.push(pathname)
  }

  const applyFilters = () => {
    // Create URL with filters
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params.set(key, value)
      }
    }

    // Update URL with filters
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
  }

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilter,
        resetFilters,
        applyFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilterState = () => useContext(FilterContext)
