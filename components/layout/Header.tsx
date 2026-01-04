'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, Search, SunMedium, MoonStar, X } from 'lucide-react'

import { MegaMenu } from '@/components/layout/MegaMenu'
import { MobileNav } from '@/components/layout/MobileNav'
import { useTheme } from '@/components/theme/ThemeProvider'
import { EASE_OUT } from '@/lib/animations/framer-utils'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const pathname = usePathname()
  const { resolvedTheme, toggleTheme } = useTheme()

  const [megaOpen, setMegaOpen] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)

  const [isHidden, setIsHidden] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true

      window.requestAnimationFrame(() => {
        const y = window.scrollY
        setIsScrolled(y > 8)

        const delta = y - lastY
        const shouldHide = y > 80 && delta > 6
        const shouldShow = delta < -6

        if (shouldHide) setIsHidden(true)
        if (shouldShow) setIsHidden(false)

        lastY = y
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  React.useEffect(() => {
    if (!mobileOpen) return
    setMegaOpen(false)
  }, [mobileOpen])

  return (
    <>
      <motion.header
        className={
          'fixed inset-x-0 top-0 z-40 border-b border-transparent transition-colors ' +
          (isScrolled ? 'border-foreground/10 bg-background/75 backdrop-blur-xl' : 'bg-transparent')
        }
        animate={{ y: isHidden ? -80 : 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <motion.span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              aria-hidden
            >
              A
            </motion.span>
            <span className="hidden sm:inline">Aircon</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative rounded-xl px-3 py-2 text-sm font-medium text-foreground/80 transition hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span>{item.label}</span>
                  {isActive ? (
                    <motion.span
                      layoutId="active-nav"
                      className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-primary"
                      transition={{ duration: 0.25, ease: EASE_OUT }}
                    />
                  ) : null}
                </Link>
              )
            })}

            <button
              type="button"
              onClick={() => setMegaOpen(true)}
              className="ml-1 rounded-xl px-3 py-2 text-sm font-medium text-foreground/80 ring-1 ring-transparent transition hover:bg-foreground/5 hover:text-foreground hover:ring-foreground/10"
            >
              Mega menu
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-foreground/10 transition hover:bg-foreground/5"
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </Dialog.Trigger>

              <AnimatePresence>
                {searchOpen ? (
                  <Dialog.Portal forceMount>
                    <Dialog.Overlay asChild>
                      <motion.div
                        className="fixed inset-0 z-50 bg-background/60 backdrop-blur"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    </Dialog.Overlay>
                    <Dialog.Content asChild>
                      <motion.div
                        className="fixed left-1/2 top-24 z-50 w-[min(92vw,560px)] -translate-x-1/2 rounded-3xl border border-foreground/10 bg-card p-5 shadow-2xl"
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.25, ease: EASE_OUT }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <Dialog.Title className="text-sm font-semibold">Search</Dialog.Title>
                          <Dialog.Close asChild>
                            <button
                              type="button"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-foreground/10 transition hover:bg-foreground/5"
                              aria-label="Close search"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </Dialog.Close>
                        </div>
                        <div className="mt-4">
                          <input
                            autoFocus
                            placeholder="Search by model, name, features..."
                            className="h-12 w-full rounded-2xl border border-foreground/10 bg-background px-4 text-sm outline-none ring-0 transition focus:border-primary"
                          />
                          <p className="mt-3 text-xs text-foreground/60">
                            Search is UI-only in Phase 2.
                          </p>
                        </div>
                      </motion.div>
                    </Dialog.Content>
                  </Dialog.Portal>
                ) : null}
              </AnimatePresence>
            </Dialog.Root>

            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium ring-1 ring-foreground/10 transition hover:bg-foreground/5"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
              <span className="hidden sm:inline">{resolvedTheme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-foreground/10 transition hover:bg-foreground/5 lg:hidden"
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            >
              <motion.span animate={{ rotate: mobileOpen ? 90 : 0 }} transition={{ duration: 0.25 }}>
                <Menu className="h-5 w-5" />
              </motion.span>
            </button>
          </div>
        </div>
      </motion.header>

      <MegaMenu open={megaOpen} onOpenChange={setMegaOpen} />
      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </>
  )
}
