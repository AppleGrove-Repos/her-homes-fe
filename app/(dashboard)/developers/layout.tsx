'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/store/auth.store'
import { AnimatePresence, motion } from 'framer-motion'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/developer/app-sidebar'
import { DeveloperHeader } from '@/components/developer/header'

export default function DeveloperDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, fetchUser } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user) {
          await fetchUser()
          const currentUser = useAuth.getState().user
          if (!currentUser) {
            console.log('No user found after fetch, redirecting to login')
            router.push('/login?redirect=/developers')
            return
          }
          if (currentUser.role !== 'developer') {
            console.log(`User has role ${currentUser.role}, redirecting`)
            router.push(`/${currentUser.role}`)
            return
          }
        } else if (user.role !== 'developer') {
          console.log(`User has role ${user.role}, redirecting`)
          router.push(`/${user.role}`)
          return
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/login?redirect=/developers')
      }
    }

    checkAuth()
  }, [user, router, fetchUser])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your dashboard...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar userRole="developer" />
        <div className="flex-1 flex flex-col min-w-0">
          <DeveloperHeader user={user} />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex-1 overflow-auto"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  )
}
