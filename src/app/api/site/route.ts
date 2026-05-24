import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export let siteSettings: any = {
  title: 'iGrow 2026',
  tagline: 'Grow with confidence',
  logoUrl: '/logo.png',
  footerText: '© iGrow 2026'
}

export async function GET() {
  try {
    return NextResponse.json(siteSettings)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAdminAuth(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    siteSettings = { ...siteSettings, ...body }
    return NextResponse.json({ message: 'Site settings updated', siteSettings })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
