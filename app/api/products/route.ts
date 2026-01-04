import { NextRequest, NextResponse } from 'next/server'

import { getPayloadServerURL } from '@/lib/payload-client'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const payloadURL = new URL('/api/products', getPayloadServerURL())
  payloadURL.search = url.search

  const res = await fetch(payloadURL, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  const body = await res.text()
  return new NextResponse(body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') ?? 'application/json',
    },
  })
}
