import type { Metadata } from 'next/types'
import { Manrope } from 'next/font/google'
import './globals.css'

const inter = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Her Homes | Real Estate ',
  description:
    'Helping individuals and families move into homes they love—with payment plans that work..',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
