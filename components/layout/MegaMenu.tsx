'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { AirVent, Building2, Fan, Snowflake, Sparkles, X } from 'lucide-react'

import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations/framer-utils'

export type MegaMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categories = [
  { label: 'Wall Mounted', href: '/products?category=wall-mounted', icon: AirVent },
  { label: 'Ducted Systems', href: '/products?category=ducted', icon: Fan },
  { label: 'Portable Units', href: '/products?category=portable', icon: Snowflake },
  { label: 'Commercial', href: '/products?category=commercial', icon: Building2 },
]

const featured = [
  { name: 'Aurora X1', model: 'AX1-24', price: '$1,499', href: '/products/AX1-24' },
  { name: 'Boreal Pro', model: 'BP-18', price: '$1,199', href: '/products/BP-18' },
  { name: 'Glacier Quiet', model: 'GQ-12', price: '$999', href: '/products/GQ-12' },
  { name: 'Nimbus Smart', model: 'NS-20', price: '$1,349', href: '/products/NS-20' },
]

export function MegaMenu({ open, onOpenChange }: MegaMenuProps) {
  React.useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange])

  React.useEffect(() => {
    if (!open) return
    const { body } = document
    const prev = body.style.overflow
    body.style.overflow = 'hidden'
    return () => {
      body.style.overflow = prev
    }
  }, [open])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50"
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={fadeIn}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onOpenChange(false)
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Product navigation"
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-xl" />

          <motion.div
            className="relative mx-auto mt-16 w-full max-w-6xl px-6"
            variants={fadeInUp}
          >
            <div className="rounded-3xl border border-foreground/10 bg-card/80 shadow-2xl shadow-foreground/5 backdrop-blur">
              <div className="flex items-center justify-between gap-4 px-6 py-5">
                <div className="text-sm font-medium text-foreground/70">Explore Aircon</div>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-foreground/10 transition hover:bg-foreground/5"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <motion.div
                className="grid gap-8 px-6 pb-8 pt-2 lg:grid-cols-3"
                variants={staggerContainer(0.08)}
              >
                <motion.div variants={fadeInUp}>
                  <div className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
                    Categories
                  </div>
                  <ul className="mt-4 space-y-2" aria-label="Product categories">
                    {categories.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => onOpenChange(false)}
                          className="group flex min-h-14 items-center gap-3 rounded-2xl px-3 py-3 ring-1 ring-transparent transition hover:bg-foreground/5 hover:ring-foreground/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary/15">
                            <c.icon className="h-5 w-5" aria-hidden />
                          </span>
                          <span className="font-medium">{c.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <div className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
                    Featured products
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3" aria-label="Featured products">
                    {featured.map((p) => (
                      <Link
                        key={p.model}
                        href={p.href}
                        onClick={() => onOpenChange(false)}
                        className="rounded-2xl border border-foreground/10 bg-card p-4 transition hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lg hover:shadow-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <div className="text-sm font-semibold">{p.name}</div>
                        <div className="mt-1 font-mono text-xs text-foreground/60">{p.model}</div>
                        <div className="mt-3 text-sm font-medium text-primary">{p.price}</div>
                      </Link>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <div className="rounded-3xl bg-gradient-to-br from-primary/15 via-background to-accent/15 p-6 ring-1 ring-foreground/10">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground/70">
                      <Sparkles className="h-4 w-4 text-accent" aria-hidden />
                      New arrivals
                    </div>
                    <div className="mt-3 text-2xl font-semibold tracking-tight">
                      Meet the 2026 UltraQuiet Series
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                      Precision engineered for whisper-level operation, intelligent climate control, and
                      premium finishes.
                    </p>
                    <div className="mt-5">
                      <Link
                        href="/products"
                        onClick={() => onOpenChange(false)}
                        className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Browse new models
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
