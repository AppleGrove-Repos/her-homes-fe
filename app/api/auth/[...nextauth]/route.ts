import { type NextRequest, NextResponse } from 'next/server'
import { https } from '@/lib/config/axios.config'

// GET handler
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const { nextauth } = await context.params

  if (nextauth.includes('init-google')) {
    try {
      const role = request.nextUrl.searchParams.get('role') || 'applicant'
      const response = await https.get(`/auth/init-google?role=${role}`)
      return NextResponse.json(response.data)
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      )
    }
  }

  if (nextauth.includes('google') && nextauth.includes('redirect')) {
    try {
      const response = await https.get('/auth/google/redirect')
      const role = response.data?.user?.role
      const redirectUrl =
        role === 'developer' ? '/developer/dashboard' : '/user/dashboard'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    } catch (error: any) {
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(error.message)}`,
          request.url
        )
      )
    }
  }

  return NextResponse.json(
    { success: false, message: 'Invalid route' },
    { status: 404 }
  )
}

// POST handler
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const { nextauth } = await context.params

  if (nextauth.includes('signin')) {
    try {
      const { email, password, phoneNumber } = await request.json()
      const response = await https.post('/auth/signin', {
        email,
        password,
        phoneNumber,
      })
      return NextResponse.json(response.data)
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          message: error.response?.data?.message || 'Authentication failed',
        },
        { status: error.response?.status || 500 }
      )
    }
  }

  if (nextauth.includes('session') && nextauth.includes('refresh')) {
    try {
      const { refreshToken } = await request.json()
      const response = await https.post('/auth/session/refresh', {
        refreshToken,
      })
      return NextResponse.json(response.data)
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { success: false, message: 'Invalid route' },
    { status: 404 }
  )
}
