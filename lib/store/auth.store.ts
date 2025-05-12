import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCurrentUser, logoutUser } from '../services/auth.service'

import type { User } from '../services/auth.service'
import {

  useState,
  useEffect,
  type ReactNode,

} from 'react'
import { useRouter } from 'next/navigation'
import { https } from '@/lib/config/axios.config'


interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  fetchUser: () => Promise<void>
  logout: () => void
}
interface AuthProviderProps {
  children: ReactNode
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      fetchUser: async () => {
        try {
          set({ isLoading: true })
          const userData = await getCurrentUser()
          set({
            user: userData,
            isAuthenticated: !!userData,
            isLoading: false,
          })
        } catch (error) {
          console.error('Error fetching user:', error)
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      logout: () => {
        logoutUser()
        localStorage.removeItem('auth_token') // Clear the auth token
        localStorage.removeItem('refresh_token') // Clear the refresh token
        set({
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
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

}

