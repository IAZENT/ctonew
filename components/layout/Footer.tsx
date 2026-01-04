'use client'

import * as React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Mail, ArrowUpRight } from 'lucide-react'
import { z } from 'zod'

import { useLenis } from '@/lib/animations/lenis-setup'

const newsletterSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

export function Footer() {
  const { scrollTo } = useLenis()

  const [email, setEmail] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<'idle' | 'success'>('idle')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const res = newsletterSchema.safeParse({ email })
    if (!res.success) {
      setError(res.error.issues[0]?.message ?? 'Invalid email')
      setStatus('idle')
      return
    }

    setError(null)
    setStatus('success')
    setEmail('')
  }

  return (
    <footer className="border-t border-foreground/10 bg-card/50">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-lg font-semibold tracking-tight">Aircon</div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              Premium air conditioning engineered for comfort, efficiency, and ultra-quiet operation.
            </p>
            <button
              type="button"
              onClick={() => scrollTo(0)}
              className="mt-6 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-background px-4 text-sm font-medium ring-1 ring-foreground/10 transition hover:bg-foreground/5"
            >
              Back to top
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-foreground/60">Quick Links</div>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { href: '/products', label: 'Products' },
                { href: '/categories', label: 'Categories' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link className="text-foreground/70 transition hover:text-foreground" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-foreground/60">Products</div>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { href: '/products?category=wall-mounted', label: 'Wall Mounted' },
                { href: '/products?category=ducted', label: 'Ducted Systems' },
                { href: '/products?category=portable', label: 'Portable Units' },
                { href: '/products?category=commercial', label: 'Commercial' },
              ].map((item) => (
                <li key={item.href}>
                  <Link className="text-foreground/70 transition hover:text-foreground" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
              Social + Newsletter
            </div>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="#"
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-foreground/10 transition hover:bg-foreground/5"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-foreground/10 transition hover:bg-foreground/5"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-foreground/10 transition hover:bg-foreground/5"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>

            <form onSubmit={onSubmit} className="mt-6">
              <label className="text-sm font-medium" htmlFor="newsletter-email">
                Subscribe
              </label>
              <div className="mt-2 flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                  <input
                    id="newsletter-email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setStatus('idle')
                      setError(null)
                    }}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-2xl border border-foreground/10 bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 min-w-24 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-95"
                >
                  Join
                </button>
              </div>
              {error ? <div className="mt-2 text-xs text-red-500">{error}</div> : null}
              {status === 'success' ? (
                <div className="mt-2 text-xs text-foreground/70">Thanks — you’re subscribed.</div>
              ) : null}
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-foreground/10 pt-8 text-xs text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Aircon. All rights reserved.</div>
          <div className="flex gap-4">
            <a className="transition hover:text-foreground" href="#">
              Privacy
            </a>
            <a className="transition hover:text-foreground" href="#">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
