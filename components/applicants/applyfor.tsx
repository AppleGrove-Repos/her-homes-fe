'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, FileText, Search } from 'lucide-react'

export function ApplicationReviewAnimation() {
  const [animationStage, setAnimationStage] = useState(0)

  useEffect(() => {
    // Progress through animation stages
    const timer = setTimeout(() => {
      setAnimationStage(1)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm min-h-[500px] flex flex-col items-center justify-center">
      <motion.div
        className="relative w-full h-64 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Desk */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-16 bg-[#8B4513] rounded-t-md"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        {/* Desk legs */}
        <motion.div
          className="absolute bottom-0 left-1/3 w-4 h-20 bg-[#5D2906]"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        />
        <motion.div
          className="absolute bottom-0 right-1/3 w-4 h-20 bg-[#5D2906]"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        />

        {/* Person */}
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {/* Chair */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#444] rounded-md" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-12 bg-[#333]" />

          {/* Body */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-24 bg-[#3a86ff] rounded-t-2xl" />

          {/* Head */}
          <motion.div
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#FFD7B5] rounded-full"
            animate={{
              rotateZ: [0, -5, 0, 5, 0],
              y: [0, -2, 0, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'loop',
            }}
          >
            {/* Eyes */}
            <motion.div
              className="absolute top-6 left-3 w-2 h-2 bg-black rounded-full"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{
                duration: 3,
                times: [0, 0.1, 0.2],
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 2.5,
              }}
            />
            <motion.div
              className="absolute top-6 right-3 w-2 h-2 bg-black rounded-full"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{
                duration: 3,
                times: [0, 0.1, 0.2],
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 2.5,
              }}
            />

            {/* Mouth */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-1 bg-black rounded-full" />
          </motion.div>

          {/* Arms */}
          <motion.div
            className="absolute top-8 left-0 w-10 h-3 bg-[#3a86ff] origin-right"
            animate={{ rotate: [-20, -10, -20] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'reverse',
            }}
          />
          <motion.div
            className="absolute top-8 right-0 w-10 h-3 bg-[#3a86ff] origin-left"
            animate={{ rotate: [20, 10, 20] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'reverse',
            }}
          />
        </motion.div>

        {/* Documents on desk */}
        <motion.div
          className="absolute bottom-16 left-1/4 w-12 h-16 bg-white border border-gray-300 rotate-[-10deg]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.5 }}
        >
          <div className="w-full h-1 bg-blue-400 mt-2" />
          <div className="w-8 h-1 bg-gray-300 mt-2 mx-auto" />
          <div className="w-8 h-1 bg-gray-300 mt-1 mx-auto" />
          <div className="w-8 h-1 bg-gray-300 mt-1 mx-auto" />
        </motion.div>

        <motion.div
          className="absolute bottom-16 right-1/4 w-12 h-16 bg-white border border-gray-300 rotate-[5deg]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.7 }}
        >
          <div className="w-full h-1 bg-green-400 mt-2" />
          <div className="w-8 h-1 bg-gray-300 mt-2 mx-auto" />
          <div className="w-8 h-1 bg-gray-300 mt-1 mx-auto" />
          <div className="w-8 h-1 bg-gray-300 mt-1 mx-auto" />
        </motion.div>

        {/* Document being reviewed */}
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 w-16 h-20 bg-white border border-gray-300"
          initial={{ opacity: 0, y: -30, rotateZ: 45 }}
          animate={{ opacity: 1, y: 0, rotateZ: 0 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          <div className="w-full h-1.5 bg-maroon-600 mt-2" />
          <div className="w-12 h-1 bg-gray-300 mt-3 mx-auto" />
          <div className="w-12 h-1 bg-gray-300 mt-1 mx-auto" />
          <div className="w-12 h-1 bg-gray-300 mt-1 mx-auto" />
          <div className="w-12 h-1 bg-gray-300 mt-1 mx-auto" />
          <div className="w-12 h-1 bg-gray-300 mt-1 mx-auto" />
          <div className="w-8 h-6 border-2 border-maroon-600 rounded-md mt-2 mx-auto flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
              }}
            >
              <Search className="h-3 w-3 text-maroon-600" />
            </motion.div>
          </div>
        </motion.div>

        {/* Floating documents */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-10 h-14 bg-white border border-gray-200 shadow-sm flex items-center justify-center"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 10}%`,
              zIndex: 10 - i,
              rotate: `${(i % 2 === 0 ? 1 : -1) * (5 + i * 2)}deg`,
            }}
            initial={{ opacity: 0, y: -50 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [-50, 0, 20, -100],
              x: [0, i % 2 === 0 ? 20 : -20, i % 2 === 0 ? 40 : -40],
            }}
            transition={{
              duration: 4 + i,
              delay: 2 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: i * 0.5,
            }}
          >
            <FileText className="h-6 w-6 text-maroon-500 opacity-70" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.5 }}
      >
        <div className="flex justify-center">
          <motion.div
            className="rounded-full bg-maroon-100 p-3"
            animate={{
              scale: [1, 1.1, 1],
              backgroundColor: ['#f8e1e1', '#f5d0d0', '#f8e1e1'],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Clock className="h-8 w-8 text-maroon-600" />
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          Application Under Review
        </h2>

        <p className="text-gray-600 max-w-xs mx-auto">
          Our team is carefully reviewing your loan application. This process
          typically takes 1-2 business days.
        </p>

        <div className="pt-4">
          <motion.div
            className="h-2 bg-gray-200 rounded-full w-64 mx-auto overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <motion.div
              className="h-full bg-maroon-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: animationStage === 0 ? '30%' : '60%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </motion.div>

          <div className="flex justify-between text-xs text-gray-500 w-64 mx-auto mt-1">
            <span>Submitted</span>
            <span>Processing</span>
            <span>Approved</span>
          </div>
        </div>

        <motion.div
          className="flex items-center justify-center gap-2 text-sm text-maroon-600 font-medium mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
        >
          <CheckCircle className="h-4 w-4" />
          <span>We'll notify you by email when there's an update</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
