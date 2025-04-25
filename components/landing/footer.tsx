'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Footer() {
  const columnVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + i * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
  }

  return (
    <footer className="w-full bg-[#6e1a2c] text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-2xl md:text-5xl font-bold text-center mb-12"
        >
          Flexible home financing made simple.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={columnVariants}
            >
              {i === 0 && (
                <div className="space-y-4">
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/assets/images/footer-logo.png"
                      alt="footer-logo"
                      width={100}
                      height={100}
                      className="h-10 w-auto object-contain align-middle"
                    />
                    <span className="text-lg font-medium">Her Homes</span>
                  </Link>
                  <p className="text-sm text-white/80">
                    Helping individuals and families move into homes they
                    love—with payment plans that work.
                  </p>
                  <div className="flex gap-4">
                    {[Facebook, Twitter, Instagram, Linkedin].map((Icon, j) => (
                      <Button
                        key={j}
                        size="icon"
                        variant="ghost"
                        className="text-white hover:text-[#546B2F] hover:bg-white/10 h-8 w-8 p-0"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="sr-only">{Icon.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {i === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Browse</h3>
                  <ul className="space-y-2">
                    {[
                      'All Properties',
                      'New Properties',
                      'View Properties',
                      'Search By Location',
                      'Featured Homes',
                    ].map((item, j) => (
                      <li key={j}>
                        <Link
                          href="#"
                          className="text-sm text-white/80 hover:text-[#546B2F]"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {i === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Financing</h3>
                  <ul className="space-y-2">
                    {[
                      'Apply for Financing',
                      'Mortgage Pre-Qualification',
                      'Financing Calculator',
                      'Partner Banks',
                    ].map((item, j) => (
                      <li key={j}>
                        <Link
                          href="#"
                          className="text-sm text-white/80 hover:text-[#546B2F]"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {i === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Help</h3>
                  <ul className="space-y-2">
                    {[
                      'Contact US',
                      'FAQs',
                      'Contact Support',
                      'About Her Homes',
                    ].map((item, j) => (
                      <li key={j}>
                        <Link
                          href="#"
                          className="text-sm text-white/80 hover:text-[#546B2F]"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 pt-6 border-t border-white/20 text-sm text-white/60 text-center"
        >
          © 2025 Her Homes. All rights reserved.
        </motion.div>
      </div>
    </footer>
  )
}
