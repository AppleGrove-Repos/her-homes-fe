import type { Metadata } from 'next/types'
import { sora } from '@/lib/utils/fonts'
import './globals.css'
import Providers from '@/lib/providers/reactQuery.provider'
import { Toaster } from 'react-hot-toast'



export const metadata: Metadata = {
  title: 'Her Homes | Real Estate',
  description:
    'Helping individuals and families move into homes they love—with payment plans that work.',
  icons: {
    icon: '/favicon.ico',
  },
  // Optional: Add Open Graph metadata
  // openGraph: {
  //   title: 'Her Homes | Real Estate',
  //   description:
  //     'Helping individuals and families move into homes they love—with payment plans that work.',
  //   siteName: 'Her Homes',
  //   images: [
  //     {
  //       url: '/og-image.jpg',
  //       width: 1200,
  //       height: 630,
  //       alt: 'Her Homes',
  //     },
  //   ],
  //   locale: 'en_US',
  //   type: 'website',
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Toaster position="bottom-right" />
      <body className={`${sora.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
