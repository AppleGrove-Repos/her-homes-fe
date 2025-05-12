import { useEffect } from 'react'
import { useAuth } from './auth.store'

export interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { fetchUser } = useAuth()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  // FIX: Return children so this can be used as a JSX component
  return <>{children}</>
}
