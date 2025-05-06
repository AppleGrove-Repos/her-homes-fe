import type { Metadata } from 'next/types'
import { Manrope } from 'next/font/google'
import './globals.css'
import { Providers } from '../lib/providers'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope', // Optional: allows you to use it as a CSS variable
})

export const metadata: Metadata = {
  title: 'Her Homes | Real Estate',
  description:
    'Helping individuals and families move into homes they love—with payment plans that work.',
  icons: {
    icon: '/favicon.ico',
  },
  // Optional: Add Open Graph metadata
  openGraph: {
    title: 'Her Homes | Real Estate',
    description:
      'Helping individuals and families move into homes they love—with payment plans that work.',
    url: 'https://herhomes.com',
    siteName: 'Her Homes',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Her Homes',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
