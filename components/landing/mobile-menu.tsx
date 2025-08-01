'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPartnersOpen, setIsPartnersOpen] = useState(false)

  const navLinks = [
    { text: 'Properties', href: '/listings' },
    { text: 'About Us', href: '/apply-for-financing' },
    { text: 'Contact Us', href: '/contact-us' },
  ]

  const partnerLinks = [
    { text: 'Communities', href: '/partners/banks' },
    { text: 'Mortgage Institutions', href: '/partners/developers' },
    { text: 'Real Estate Agents', href: '/developers' },
    { text: 'Become a Partner', href: '/partnership' },
  ]

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

  const partnersVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  }

  const partnerItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="text-black w-16 h-16"
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
              {navLinks.map(({ text, href }, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Link
                    href={href}
                    className="text-lg font-medium hover:text-[#e6a287] text-black/90"
                    onClick={() => setIsOpen(false)}
                  >
                    {text}
                  </Link>
                </motion.div>
              ))}

              {/* Partners Dropdown */}
              <motion.div variants={itemVariants} className="w-full max-w-xs">
                <button
                  onClick={() => setIsPartnersOpen(!isPartnersOpen)}
                  className="flex items-center justify-center gap-2 text-lg font-medium hover:text-[#e6a287] text-black/90 w-full py-2"
                >
                  Partners
                  {isPartnersOpen ? (
                    <ChevronUp className="h-4 w-4 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                  )}
                </button>

                <AnimatePresence>
                  {isPartnersOpen && (
                    <motion.div
                      className="overflow-hidden"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={partnersVariants}
                    >
                      <div className="flex flex-col items-center gap-3 pt-3 pb-2">
                        {partnerLinks.map(({ text, href }, index) => (
                          <motion.div
                            key={index}
                            variants={partnerItemVariants}
                          >
                            <Link
                              href={href}
                              className="text-base font-medium hover:text-[#e6a287] text-black/70 px-4 py-1"
                              onClick={() => {
                                setIsOpen(false)
                                setIsPartnersOpen(false)
                              }}
                            >
                              {text}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants} className="w-full max-w-xs">
                <Link href="/signup" passHref legacyBehavior>
                  <Button className="bg-[#6e1a2c] hover:bg-[#5a1523] text-white rounded-md w-full mt-4">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/login" passHref legacyBehavior>
                  <Button className="border-[#6e1a2c] bg-transparent hover:bg-[#5a1523] hover:text-white text-black rounded-md w-full mt-4">
                    Login
                  </Button>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
