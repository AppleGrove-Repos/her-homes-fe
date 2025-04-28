'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const overlayVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="text-black w-16 h-16" // Increased width/height here
      >
        {isOpen ? (
          <X className="h-10 w-10 transition-transform duration-300 rotate-90" />
        ) : (
          <Menu className="h-10 w-10 transition-transform duration-300" />
        )}
        <span className="sr-only">Toggle menu</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-white/60 backdrop-blur-md rounded-lg shadow-lg"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
          >
            <div className="flex justify-end p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-black w-16 h-16"
              >
                <X className="h-16 w-16" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>

            <nav className="flex flex-col items-center gap-6 p-4">
              {['Browse Listings', 'Apply for Financing', 'Contact Us'].map(
                (text, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Link
                      href="#"
                      className="text-lg font-medium hover:text-[#e6a287] text-black/90"
                      onClick={() => setIsOpen(false)}
                    >
                      {text}
                    </Link>
                  </motion.div>
                )
              )}

              <motion.div variants={itemVariants} className="w-full">
                <Button className="bg-[#6e1a2c] hover:bg-[#5a1523] text-white rounded-md w-full mt-4">
                  Sign Up
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
