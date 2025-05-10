import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCurrentUser, logoutUser } from '../services/auth.service'

import type { User } from '../services/auth.service'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  fetchUser: () => Promise<void>
  logout: () => void
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
