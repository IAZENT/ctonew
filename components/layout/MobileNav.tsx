'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown, X } from 'lucide-react'

import { fadeIn, fadeInUp } from '@/lib/animations/framer-utils'

export type MobileNavProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categories = [
  { label: 'Wall Mounted', href: '/products?category=wall-mounted' },
  { label: 'Ducted Systems', href: '/products?category=ducted' },
  { label: 'Portable Units', href: '/products?category=portable' },
  { label: 'Commercial', href: '/products?category=commercial' },
]

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
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
          className="fixed inset-0 z-50 lg:hidden"
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={fadeIn}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onOpenChange(false)
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur" />

          <motion.div
            className="relative h-full w-[min(92vw,360px)] bg-card shadow-2xl"
            initial={{ x: '-100%' }}
            animate={{ x: 0, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } }}
            exit={{ x: '-100%', transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }}
          >
            <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4">
              <div className="text-sm font-semibold tracking-tight">Menu</div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-foreground/10 transition hover:bg-foreground/5"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="px-5 py-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    onClick={() => onOpenChange(false)}
                    className="flex min-h-14 items-center rounded-2xl px-4 font-medium ring-1 ring-transparent transition hover:bg-foreground/5 hover:ring-foreground/10"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Accordion.Root type="single" collapsible>
                    <Accordion.Item value="products" className="rounded-2xl ring-1 ring-foreground/10">
                      <Accordion.Header>
                        <Accordion.Trigger className="flex min-h-14 w-full items-center justify-between gap-3 px-4 text-left font-medium">
                          Products
                          <ChevronDown className="h-4 w-4 shrink-0 transition data-[state=open]:rotate-180" />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                        <ul className="space-y-1 px-2 pb-3">
                          {categories.map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                onClick={() => onOpenChange(false)}
                                className="flex min-h-14 items-center rounded-2xl px-3 text-sm text-foreground/80 transition hover:bg-foreground/5"
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion.Root>
                </li>

                {[
                  { href: '/categories', label: 'Categories' },
                  { href: '/about', label: 'About' },
                  { href: '/contact', label: 'Contact' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => onOpenChange(false)}
                      className="flex min-h-14 items-center rounded-2xl px-4 font-medium ring-1 ring-transparent transition hover:bg-foreground/5 hover:ring-foreground/10"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <motion.div className="mt-6 rounded-3xl bg-gradient-to-br from-primary/15 via-background to-accent/15 p-4" variants={fadeInUp}>
                <div className="text-sm font-semibold">Need help choosing?</div>
                <p className="mt-1 text-sm text-foreground/70">
                  Compare energy ratings, capacity, and smart features.
                </p>
                <Link
                  href="/products"
                  onClick={() => onOpenChange(false)}
                  className="mt-3 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-primary text-sm font-medium text-primary-foreground"
                >
                  Browse all products
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
