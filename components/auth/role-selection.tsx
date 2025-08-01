'use client'

import { motion } from 'framer-motion'
import type { UserRole } from '@/lib/types/auth'
import { cn } from '@/lib/utils/utils'
import Link from 'next/link'
// import { useRouter } from 'next/navigation'

interface RoleSelectionProps {
  selectedRole: UserRole | null
  onRoleSelect: (role: UserRole) => void
  onContinue: () => void
  onBack?: () => void // Add this line
}

export default function RoleSelection({
  selectedRole,
  onRoleSelect,
  onContinue,
  onBack, // Add this line
}: RoleSelectionProps) {
  const roleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }
  // const router = useRouter()

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      {/* Back Button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      )}

      <div>
        <motion.h2
          className="text-[15px] font-medium mb-4"
          variants={roleVariants}
        >
          Choose Your Role
        </motion.h2>

        <div className="space-y-5">
          <motion.button
            type="button"
            className={cn(
              'w-full text-left p-4 border rounded-lg flex items-center gap-3',
              selectedRole === 'applicant'
                ? 'border-[#546B2F] bg-[#546B2F] text-white'
                : 'border-gray-400 hover:border-gray-300'
            )}
            onClick={() => onRoleSelect('applicant')}
            variants={roleVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={cn(
                'w-5 h-5 rounded-full border flex items-center justify-center',
                selectedRole === 'applicant' ? 'border-[#ffff]' : 'border-white'
              )}
            >
              {selectedRole === 'applicant' && (
                <motion.div
                  className="w-3 h-3 rounded-full bg-[#fff]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
            <div>
              <span className="font-medium text-[15px]">Home Seeker</span>
              <span
                className={cn(
                  'text-gray-500 ml-2',
                  'text-[15px]',
                  selectedRole === 'applicant' ? 'text-white' : 'text-gray-500'
                )}
              >
                – Find and finance your dream home
              </span>
            </div>
          </motion.button>

          <motion.button
            type="button"
            className={cn(
              'w-full text-left p-4 border rounded-lg flex items-center gap-3',
              selectedRole === 'developer'
                ? 'border-[#546B2F] bg-[#546B2F] text-white'
                : 'border-gray-400 hover:border-gray-300'
            )}
            onClick={() => onRoleSelect('developer')}
            variants={roleVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={cn(
                'w-5 h-5 rounded-full border flex items-center justify-center',
                selectedRole === 'developer'
                  ? 'border-white'
                  : 'border-gray-400'
              )}
            >
              {selectedRole === 'developer' && (
                <motion.div
                  className="w-3 h-3 rounded-full bg-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
            <div>
              <span className="font-medium">Developer</span>
              <span
                className={cn(
                  'text-gray-500 ml-2',
                  selectedRole === 'developer' ? 'text-white' : 'text-gray-500'
                )}
              >
                – List, manage, and sell properties
              </span>
            </div>
          </motion.button>
        </div>
      </div>

      <motion.button
        type="button"
        className={cn(
          'w-full py-3 px-4 rounded-md font-medium transition-colors',
          selectedRole
            ? 'bg-[#7D1F2C] text-white hover:bg-[#6a1a25]'
            : 'bg-[#7D1F2C] text-white cursor-not-allowed'
        )}
        onClick={onContinue}
        disabled={!selectedRole}
        variants={roleVariants}
        whileHover={selectedRole ? { scale: 1.03 } : {}}
        whileTap={selectedRole ? { scale: 0.97 } : {}}
      >
        Continue
      </motion.button>
      <div className="text-left text-gray-400/70 text-sm mt-2">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-[#546B2F] font-bold hover:underline"
        >
          Sign in
        </Link>
      </div>
      {/* <p className="mt-8 text-center text-sm text-gray-600">
                     Have an account?{' '}
                    <Link
                      href="/login"
                      className="text-[#7C0A02] hover:underline font-semibold"
                    >
                      Login
                    </Link>
                  </p> */}
    </motion.div>
  )
}
