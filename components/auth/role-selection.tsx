'use client'

import { motion } from 'framer-motion'
import type { UserRole } from '@/lib/hooks/use-auth'
import { cn } from '@/lib/utils'

interface RoleSelectionProps {
  selectedRole: UserRole | null
  onRoleSelect: (role: UserRole) => void
  onContinue: () => void
}

export default function RoleSelection({
  selectedRole,
  onRoleSelect,
  onContinue,
}: RoleSelectionProps) {
  const roleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

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
      <div>
        <motion.h2 className="text-lg font-medium mb-4" variants={roleVariants}>
          Choose Your Role
        </motion.h2>

        <div className="space-y-3">
          <motion.button
            type="button"
            className={cn(
              'w-full text-left p-4 border rounded-lg flex items-center gap-3',
              selectedRole === 'applicant'
                ? 'border-[#7D1F2C] bg-[#7D1F2C]/5'
                : 'border-gray-200 hover:border-gray-300'
            )}
            onClick={() => onRoleSelect('applicant')}
            variants={roleVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={cn(
                'w-5 h-5 rounded-full border flex items-center justify-center',
                selectedRole === 'applicant'
                  ? 'border-[#7D1F2C]'
                  : 'border-gray-400'
              )}
            >
              {selectedRole === 'applicant' && (
                <motion.div
                  className="w-3 h-3 rounded-full bg-[#7D1F2C]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
            <div>
              <span className="font-medium">Home Seeker</span>
              <span className="text-gray-500 ml-2">
                – Find and finance your dream home
              </span>
            </div>
          </motion.button>

          <motion.button
            type="button"
            className={cn(
              'w-full text-left p-4 border rounded-lg flex items-center gap-3',
              selectedRole === 'developer'
                ? 'border-[#7D1F2C] bg-[#7D1F2C]/5'
                : 'border-gray-200 hover:border-gray-300'
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
                  ? 'border-[#7D1F2C]'
                  : 'border-gray-400'
              )}
            >
              {selectedRole === 'developer' && (
                <motion.div
                  className="w-3 h-3 rounded-full bg-[#7D1F2C]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
            <div>
              <span className="font-medium">Developer</span>
              <span className="text-gray-500 ml-2">
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
            : 'bg-gray-400 text-white cursor-not-allowed'
        )}
        onClick={onContinue}
        disabled={!selectedRole}
        variants={roleVariants}
        whileHover={selectedRole ? { scale: 1.03 } : {}}
        whileTap={selectedRole ? { scale: 0.97 } : {}}
      >
        Continue
      </motion.button>
    </motion.div>
  )
}
