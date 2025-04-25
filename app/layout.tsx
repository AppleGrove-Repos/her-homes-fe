import type { Metadata } from 'next/types'
import { Manrope } from 'next/font/google'
import './globals.css'

const inter = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Her Homes | Real Estate Investment Brand ',
  description:
    'HerHomes inspires women to build wealth on their own terms together.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
