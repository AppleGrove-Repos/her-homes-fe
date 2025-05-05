'use client'

import RQProvider from './reactQuery.provider'
import { AuthProvider } from '@/hooks/use-auth'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RQProvider>
      <AuthProvider>{children}</AuthProvider>
    </RQProvider>
  )
}
