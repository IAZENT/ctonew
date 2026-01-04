import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { getPayloadServerURL } from '@/lib/payload-client'
import { checkRateLimit } from '@/lib/rateLimit'

const schema = z.object({
  formType: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0]
  const rl = checkRateLimit(`submissions:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 })
  if (!rl.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const json = await req.json().catch(() => null)
  const parsed = schema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const payloadURL = new URL('/api/formSubmissions', getPayloadServerURL())
  const res = await fetch(payloadURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
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
