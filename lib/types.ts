// Types for API responses from backend
export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  squareFeet: number
  images: string[]
  features: string[]
  listingDate: string
  status: 'available' | 'pending' | 'sold'
}

export interface MortgageRate {
  id: string
  lenderName: string
  rate: number
  apr: number
  term: number
  type: 'fixed' | 'adjustable'
  minimumDownPayment: number
  fees: number
}

export interface LoanApplication {
  firstName: string
  lastName: string
  email: string
  phone: string
  loanType: 'purchase' | 'refinance' | 'heloc'
  propertyValue: number
  downPayment?: number
  creditScore?: number
  annualIncome?: number
  employmentStatus?: string
}

// Types for API services
export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}
