import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

import { SESSION_MAX_AGE_SECONDS } from '@/lib/constants'
import { checkRateLimit } from '@/lib/rateLimit'
import { getPayloadServerURL } from '@/lib/payload-client'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

type PayloadLoginResponse = {
  token?: string
  user?: {
    id: string
    email: string
    role?: string
  }
}

async function payloadLogin(email: string, password: string) {
  const url = new URL('/api/users/login', getPayloadServerURL())
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  })

  if (!res.ok) return null
  const json = (await res.json()) as PayloadLoginResponse
  if (!json.user?.id || !json.user.email) return null

  return {
    id: json.user.id,
    email: json.user.email,
    role: json.user.role ?? 'viewer',
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, req) => {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const ip =
          (req?.headers.get('x-forwarded-for') ?? req?.headers.get('x-real-ip') ?? 'unknown').split(
            ',',
          )[0]
        const key = `auth:${ip}:${parsed.data.email}`
        const rl = checkRateLimit(key, { limit: 5, windowMs: 15 * 60 * 1000 })
        if (!rl.ok) return null

        const user = await payloadLogin(parsed.data.email, parsed.data.password)
        if (!user) return null

        return user as any
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = (user as any).id
        token.email = (user as any).email
        token.role = (user as any).role
      }
      return token
    },
    session: async ({ session, token }) => {
      ;(session as any).user = {
        id: token.sub,
        email: token.email,
        role: (token as any).role,
      }
      return session
    },
  },
  pages: {
    signIn: '/admin',
  },
})
