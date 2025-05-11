'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/store/auth.store'
import Sidebar from '@/components/developer/sidebar'
import UserNav from '@/components/developer/user-nav'
import { AnimatePresence, motion } from 'framer-motion'

export default function DeveloperDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, setUser, fetchUser } = useAuth() // Always call hooks at the top level
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if we already have a user in the store
        if (!user) {
          // If not, try to fetch the user
          await fetchUser()

          // After fetching, check again if we have a user
          const currentUser = useAuth.getState().user

          if (!currentUser) {
            console.log('No user found after fetch, redirecting to login')
            router.push('/login?redirect=/developers')
            return
          }

          // Check if user has the correct role
          if (currentUser.role !== 'developer') {
            console.log(`User has role ${currentUser.role}, redirecting`)
            router.push(`/${currentUser.role}`)
            return
          }
        } else if (user.role !== 'developer') {
          // If we already have a user but wrong role
          console.log(`User has role ${user.role}, redirecting`)
          router.push(`/${user.role}`)
          return
        }

        // If we reach here, authentication is successful
        setIsLoading(false)
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/login?redirect=/developers')
      }
    }

    checkAuth()
  }, [user, router, fetchUser]) // Ensure dependencies are correct

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center"
        >
          <svg
            className="animate-spin h-10 w-10 text-mainLight"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-screen bg-gray-50"
    >
      <Sidebar userRole="developer" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between"
        >
          <h1 className="text-xl font-semibold text-gray-800">Her Homes</h1>
          {user && <UserNav user={user} />}
        </motion.header>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex-1 overflow-auto p-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={usePathname()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </motion.div>
  )
}
