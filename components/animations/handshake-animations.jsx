'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Home } from 'lucide-react'

export const HandshakeAnimation = () => {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative h-64 w-64 mx-auto">
      {/* First person */}
      <motion.div
        initial={{ x: -80 }}
        animate={{
          x: animationComplete ? -30 : [-80, -30, -30, -30, -30],
          rotate: animationComplete ? 0 : [0, 5, -5, 5, 0],
        }}
        transition={{
          duration: animationComplete ? 0.5 : 2,
          times: [0, 0.2, 0.4, 0.6, 1],
          repeat: animationComplete ? 0 : Number.POSITIVE_INFINITY,
        }}
        className="absolute left-1/2 top-1/2 -translate-y-1/2"
      >
        <div className="relative">
          {/* Head */}
          <div className="w-12 h-12 rounded-full bg-[#7C0A02]"></div>
          {/* Body */}
          <div className="w-16 h-24 rounded-t-lg bg-[#7C0A02] absolute -bottom-24 left-1/2 -translate-x-1/2"></div>
          {/* Arm */}
          <motion.div
            initial={{ rotate: -20 }}
            animate={{
              rotate: animationComplete ? 0 : [-20, 0, 0, 0, -20],
            }}
            transition={{
              duration: animationComplete ? 0.5 : 2,
              times: [0, 0.2, 0.6, 0.8, 1],
              repeat: animationComplete ? 0 : Number.POSITIVE_INFINITY,
            }}
            className="w-20 h-4 bg-[#7C0A02] absolute top-8 left-6 origin-left rounded-full"
          ></motion.div>
        </div>
      </motion.div>

      {/* Second person */}
      <motion.div
        initial={{ x: 80 }}
        animate={{
          x: animationComplete ? 30 : [80, 30, 30, 30, 30],
          rotate: animationComplete ? 0 : [0, -5, 5, -5, 0],
        }}
        transition={{
          duration: animationComplete ? 0.5 : 2,
          times: [0, 0.2, 0.4, 0.6, 1],
          repeat: animationComplete ? 0 : Number.POSITIVE_INFINITY,
        }}
        className="absolute left-1/2 top-1/2 -translate-y-1/2"
      >
        <div className="relative">
          {/* Head */}
          <div className="w-12 h-12 rounded-full bg-gray-700"></div>
          {/* Body */}
          <div className="w-16 h-24 rounded-t-lg bg-gray-700 absolute -bottom-24 left-1/2 -translate-x-1/2"></div>
          {/* Arm */}
          <motion.div
            initial={{ rotate: 20 }}
            animate={{
              rotate: animationComplete ? 0 : [20, 0, 0, 0, 20],
            }}
            transition={{
              duration: animationComplete ? 0.5 : 2,
              times: [0, 0.2, 0.6, 0.8, 1],
              repeat: animationComplete ? 0 : Number.POSITIVE_INFINITY,
            }}
            className="w-20 h-4 bg-gray-700 absolute top-8 right-6 origin-right rounded-full"
          ></motion.div>
        </div>
      </motion.div>

      {/* House icon */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{
          y: animationComplete ? 0 : [50, 0, 0],
          opacity: animationComplete ? 1 : [0, 1, 1],
        }}
        transition={{
          delay: 1,
          duration: 1,
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full"
      >
        <Home size={48} className="text-[#7C0A02]" />
      </motion.div>

      {/* Checkmark */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.2, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          delay: 2.5,
          duration: 0.5,
        }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full bg-green-500 rounded-full p-2"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>
    </div>
  )
}
