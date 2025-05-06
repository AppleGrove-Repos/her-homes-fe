'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import RoleSelection from '@/components/auth/role-selection'
import ApplicantSignupForm from '@/components/auth/applicant-signup-form'
import DeveloperSignupForm from '@/components/auth/developer-signup-form'
import type { UserRole } from '@/lib/hooks/use-auth'

export default function SignupPage() {
  const [step, setStep] = useState<'role-selection' | 'form'>('role-selection')
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const router = useRouter()

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (selectedRole) {
      setStep('form')
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <motion.div
        className="flex-1 p-8 w-full lg:w-[55%] md:p-12 lg:p-16 flex flex-col overflow-y-auto px-6 py-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.header className="mb-8" variants={itemVariants}>
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/images/header-logo.png"
              alt="Her Homes"
              width={80}
              height={40}
              className="h-10 w-auto"
            />
            <span className="ml-2 text-xl font-bold">Her Homes</span>
          </Link>
        </motion.header>

        <motion.div className="max-w-md mx-auto w-full" variants={itemVariants}>
          <motion.h1
            className="text-3xl font-bold mb-2"
            variants={itemVariants}
          >
            Create an account
          </motion.h1>

          {step === 'role-selection' ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-600 mb-8">
                Select your role to continue.
              </p>
              <RoleSelection
                selectedRole={selectedRole}
                onRoleSelect={handleRoleSelect}
                onContinue={handleContinue}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {selectedRole === 'applicant' ? (
                <ApplicantSignupForm />
              ) : (
                <DeveloperSignupForm />
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <div className="hidden lg:flex lg:w-[45%] items-center justify-center bg-white p-6  scrollbar-hide overflow-x-hidden scrollbar-hide ">
        <div className="relative w-full h-[100%] rounded-l-2xl shadow-xl overflow-hidden scrollbar-hide overflow-x-hidden scrollbar-hide">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 z-10" />

          {/* Background Image */}
          <Image
            src="/assets/images/login.png"
            alt="Interior of a modern home"
            fill
            className="object-cover"
            priority
          />

          {/* Text Content */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-10 text-white z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-3 leading-snug">
              Discovering the Perfect Place to <br />
              Call Home Has Never Been This Easy
            </h2>
            <p className="text-sm mb-5 leading-relaxed">
              Our mission is to help you explore, find, and settle into homes
              that match your lifestyle, preferences, and dreams — all in just a
              few clicks.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-white/30 bg-black/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <svg
                  className="w-4 h-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Trusted Agent
              </motion.span>
              <motion.span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-white/30 bg-black/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                Available Across Nigeria
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
