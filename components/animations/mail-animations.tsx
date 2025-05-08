'use client'

import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { useEffect, useState } from 'react'

interface MailAnimationProps {
  email: string
}

export function MailAnimation({ email }: MailAnimationProps) {
  const [animationCycle, setAnimationCycle] = useState(0)

  // Create a continuous animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationCycle((prev) => (prev + 1) % 1000) // Large number to avoid resetting too quickly
    }, 4000) // Complete cycle every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-64">
      {/* Background elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#f9f9f9] to-transparent" />

      {/* Mailbox */}
      <div className="absolute bottom-0 right-1/4 w-24 h-40">
        {/* Mailbox post */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-20 bg-[#7C0A02]" />

        {/* Mailbox body */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 w-20 h-16 bg-[#7C0A02] rounded-t-lg"
          animate={{
            rotateX: [0, -40, 0],
          }}
          transition={{
            duration: 0.8,
            times: [0, 0.5, 1],
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 3.2,
          }}
        >
          {/* Mailbox flag */}
          <motion.div
            className="absolute -right-1 top-2 w-2 h-10 bg-white"
            animate={{
              rotateZ: [0, 90, 0],
            }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3.2,
            }}
          />

          {/* Mailbox slot */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-2 bg-[#600000] rounded-full" />
        </motion.div>
      </div>

      {/* Character */}
      <motion.div
        className="absolute bottom-10 left-0 w-20 h-32"
        animate={{
          x: [
            -100, // Start off-screen
            80, // Move to delivery position
            80, // Stay for delivery
            -100, // Move back off-screen
          ],
        }}
        transition={{
          duration: 4,
          times: [0, 0.25, 0.75, 1],
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 0,
        }}
      >
        {/* Body */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-20 bg-[#333] rounded-t-full" />

        {/* Head */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#FFD7B5] rounded-full"
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
          }}
        >
          {/* Eyes */}
          <motion.div
            className="absolute top-4 left-2 w-2 h-2 bg-black rounded-full"
            animate={{
              scaleY: [1, 0.1, 1],
            }}
            transition={{
              duration: 3,
              times: [0, 0.1, 0.2],
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2.5,
            }}
          />
          <motion.div
            className="absolute top-4 right-2 w-2 h-2 bg-black rounded-full"
            animate={{
              scaleY: [1, 0.1, 1],
            }}
            transition={{
              duration: 3,
              times: [0, 0.1, 0.2],
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2.5,
            }}
          />
          {/* Smile */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-2 border-b-2 border-black rounded-full" />
        </motion.div>

        {/* Legs with walking animation */}
        <motion.div
          className="absolute bottom-0 left-2 w-3 h-8 bg-[#222] rounded-full origin-top"
          animate={{
            rotate: [0, 30, 0, -30, 0],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'loop',
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute bottom-0 right-2 w-3 h-8 bg-[#222] rounded-full origin-top"
          animate={{
            rotate: [0, -30, 0, 30, 0],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'loop',
            ease: 'linear',
          }}
        />

        {/* Arm with letter */}
        <motion.div
          className="absolute top-8 right-0 w-12 h-4 bg-[#333] origin-left"
          animate={{
            rotate: [
              -20, // Default position
              -20, // Hold
              30, // Raise to deliver
              -20, // Return to default
            ],
          }}
          transition={{
            duration: 4,
            times: [0, 0.25, 0.5, 0.75],
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          {/* Hand */}
          <div className="absolute right-0 top-0 w-4 h-4 bg-[#FFD7B5] rounded-full" />

          {/* Letter */}
          <motion.div
            className="absolute right-0 top-0 -rotate-45 w-10 h-7 bg-white border border-gray-300 rounded-sm flex items-center justify-center"
            animate={{
              opacity: [
                1, // Visible
                1, // Stay visible
                0, // Disappear when delivered
                0, // Stay invisible
                1, // Reappear for next cycle
              ],
            }}
            transition={{
              duration: 4,
              times: [0, 0.4, 0.5, 0.9, 1],
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <Mail className="h-4 w-4 text-[#7C0A02]" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Flying email - appears in sync with character's delivery motion */}
      <motion.div
        className="absolute bottom-28 left-20 w-10 h-7 bg-white border border-gray-300 rounded-sm flex items-center justify-center shadow-md"
        animate={{
          x: [80, 150],
          y: [0, -40, 0],
          opacity: [0, 1, 1, 0, 0],
          rotate: [-45, 0, 0],
        }}
        transition={{
          duration: 4,
          times: [0.3, 0.4, 0.45, 0.5, 1],
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <Mail className="h-4 w-4 text-[#7C0A02]" />
      </motion.div>

      {/* Email address bubble - always visible */}
      <motion.div
        className="absolute top-0 right-10 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-md"
        initial={{ opacity: 1, scale: 1 }}
        animate={{
          y: [0, -5, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
        }}
      >
        <div className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
          {email}
        </div>
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45" />
      </motion.div>

      {/* Continuous floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 6 + 3 + 'px',
            height: Math.random() * 6 + 3 + 'px',
            backgroundColor: ['#7C0A02', '#FFD700', '#4CAF50', '#2196F3'][
              Math.floor(Math.random() * 4)
            ],
            left: 150 + i * 20 + 'px',
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0, 0.7, 0],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: i * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'loop',
          }}
        />
      ))}

      {/* Success checkmark - always visible but with subtle animation */}
      <motion.div
        className="absolute bottom-4 right-10 bg-green-100 rounded-full p-1"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, 0, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
          }}
        >
          <svg
            className="h-8 w-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}
