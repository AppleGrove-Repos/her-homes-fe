'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { https } from '@/lib/config/axios.config'
import toast from 'react-hot-toast'

// Define user types
export type UserRole = 'applicant' | 'developer' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phoneNumber?: string
  profileImage?: string
}

// Define auth context type
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await https.get('/user')
        if (response.data?.success) {
          setUser(response.data.data)
        }
      } catch (error) {
        // User is not authenticated, clear any stale data
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await https.post('/auth/signin', {
        email,
        password,
      })

      if (response.data?.success) {
        // Get user data
        const userResponse = await https.get('/user')
        setUser(userResponse.data.data)

        // Show success message
        toast.success('Login successful')

        // Redirect based on user role
        if (userResponse.data.data.role === 'developer') {
          router.push('/developer/dashboard')
        } else {
          router.push('/user/dashboard')
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      // Initialize Google login with applicant role
      const response = await https.get('/auth/init-google?role=applicant')

      if (response.data?.url) {
        // Redirect to Google auth URL
        window.location.href = response.data.url
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Google login failed')
      throw error
    }
  }

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await https.post('/auth/signup', {
        name,
        email,
        password,
        role: 'applicant', // Default role for signup
      })

      if (response.data?.success) {
        // Show success message
        toast.success('Account created successfully')

        // Login the user after signup
        await login(email, password)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  // Logout function
  const logout = async () => {
    try {
      await https.post('/auth/logout')
      setUser(null)
      router.push('/')
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Refresh session
  const refreshSession = async () => {
    try {
      await https.post('/auth/session/refresh')
      // Get updated user data
      const userResponse = await https.get('/user')
      setUser(userResponse.data.data)
    } catch (error) {
      // If refresh fails, log out the user
      setUser(null)
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        signup,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
