import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCurrentUser, logoutUser } from '../services/auth.service'

interface User {
  id: string
  name: string
  email: string
  role: 'developer' | 'applicant'
  profilePicture?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string) => void
  fetchUser: () => Promise<void>
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => set({ token }),

      fetchUser: async () => {
        try {
          set({ isLoading: true })
          const userData = await getCurrentUser()

          if (userData) {
            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }
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
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
)
