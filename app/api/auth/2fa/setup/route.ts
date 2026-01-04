import { authenticator } from 'otplib'
import * as QRCode from 'qrcode'
import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'

export async function POST() {
  const session = await auth()
  const user = (session as any)?.user

  if (!user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const secret = authenticator.generateSecret()
  const otpauth = authenticator.keyuri(user.email, 'Aircon', secret)
  const qrCodeDataUrl = await QRCode.toDataURL(otpauth)

  return NextResponse.json({ secret, otpauth, qrCodeDataUrl })
}
