'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { useLenis } from '@/lib/animations/lenis-setup'
import { EASE_OUT, fadeInUp } from '@/lib/animations/framer-utils'

export type HeroProduct = {
  productName: string
  modelNumber: string
  price: number
  features: string[]
  imageSrc: string
}

const fallbackProducts: HeroProduct[] = [
  {
    productName: 'Aurora X1 UltraQuiet',
    modelNumber: 'AX1-24',
    price: 1499,
    features: ['Whisper 19dB indoor unit', 'A+++ efficiency', 'Smart app control', 'Nano filtration'],
    imageSrc: '/images/hero-product-1.svg',
  },
  {
    productName: 'Boreal Pro Inverter',
    modelNumber: 'BP-18',
    price: 1199,
    features: ['Variable inverter compressor', 'Rapid cool mode', 'Eco refrigerant', 'Self-clean cycle'],
    imageSrc: '/images/hero-product-2.svg',
  },
  {
    productName: 'Nimbus Smart Series',
    modelNumber: 'NS-20',
    price: 1349,
    features: ['AI comfort sensing', 'Zoned airflow control', 'Energy insights dashboard', 'Low-profile design'],
    imageSrc: '/images/hero-product-3.svg',
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export function HeroSection({ products }: { products?: HeroProduct[] }) {
  const reduced = useReducedMotion()
  const { scrollTo } = useLenis()

  const list = products && products.length ? products : fallbackProducts

  const [activeIndex, setActiveIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const rx = useTransform(rotateX, (v) => `${v}deg`)
  const ry = useTransform(rotateY, (v) => `${v}deg`)

  const resumeTimeoutRef = React.useRef<number | null>(null)

  const setIndex = React.useCallback(
    (next: number) => {
      const mod = ((next % list.length) + list.length) % list.length
      setActiveIndex(mod)
    },
    [list.length],
  )

  React.useEffect(() => {
    if (reduced) return
    if (paused) return

    const id = window.setInterval(() => {
      setIndex(activeIndex + 1)
    }, 5000)

    return () => window.clearInterval(id)
  }, [activeIndex, paused, reduced, setIndex])

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex(activeIndex + 1)
      if (e.key === 'ArrowLeft') setIndex(activeIndex - 1)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, setIndex])

  const product = list[activeIndex]

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(0,102,204,0.18),transparent_55%),radial-gradient(circle_at_80%_15%,rgba(16,185,129,0.14),transparent_50%),radial-gradient(circle_at_60%_90%,rgba(0,163,224,0.14),transparent_55%)]" />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-6 py-14 lg:grid-cols-[3fr_2fr]">
        <div
          className="relative"
          onMouseEnter={() => {
            setPaused(true)
            if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current)
          }}
          onMouseLeave={() => {
            rotateX.set(0)
            rotateY.set(0)

            if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current)
            resumeTimeoutRef.current = window.setTimeout(() => setPaused(false), 2000)
          }}
          onMouseMove={(e) => {
            if (reduced) return
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
            const px = (e.clientX - rect.left) / rect.width
            const py = (e.clientY - rect.top) / rect.height

            const max = 10
            rotateY.set((px - 0.5) * max * 2)
            rotateX.set(-(py - 0.5) * max * 2)
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={product.modelNumber}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] border border-foreground/10 bg-card/60 shadow-2xl shadow-foreground/10"
              style={{ transformStyle: 'preserve-3d', perspective: 1200, rotateX: rx, rotateY: ry }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              <Image
                src={product.imageSrc}
                alt={product.productName}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/20 via-transparent to-background/10" />
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Product selection">
            {list.map((p, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={p.modelNumber}
                  type="button"
                  onClick={() => setIndex(idx)}
                  className={
                    'relative h-3 w-3 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
                    (isActive ? 'bg-primary' : 'bg-foreground/20 hover:bg-foreground/30')
                  }
                  aria-label={`Show ${p.productName}`}
                  aria-current={isActive}
                >
                  {isActive ? (
                    <motion.span
                      className="absolute inset-0 rounded-full ring-4 ring-primary/25"
                      layoutId="hero-dot"
                    />
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        <div className="relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }}
            className="inline-flex items-center gap-2 rounded-full bg-background/70 px-4 py-2 text-xs font-semibold tracking-wide text-foreground/70 ring-1 ring-foreground/10"
          >
            Premium climate control
            <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
            Engineered to feel effortless
          </motion.div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={product.modelNumber + '-content'}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                {product.productName}
              </h1>
              <div className="mt-2 font-mono text-sm text-foreground/60">Model {product.modelNumber}</div>

              <ul className="mt-6 space-y-2 text-sm text-foreground/80">
                {product.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-end justify-between gap-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
                    Starting at
                  </div>
                  <div className="mt-1 text-3xl font-semibold tracking-tight text-primary">
                    {formatPrice(product.price)}
                  </div>
                </div>

                <Link
                  href="/products"
                  data-cursor="VIEW"
                  className="group inline-flex min-h-14 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-foreground/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <motion.span whileHover={{ scale: 1.05 }} transition={{ duration: 0.25, ease: EASE_OUT }}>
                    Explore products
                  </motion.span>
                  <motion.span
                    className="ml-2"
                    initial={false}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => scrollTo('#brand-story')}
            className="group absolute -bottom-2 left-0 hidden items-center gap-3 text-sm text-foreground/70 transition hover:text-foreground md:flex"
            aria-label="Scroll to brand story"
          >
            <motion.span
              className="relative inline-flex h-10 w-6 items-start justify-center rounded-full border border-foreground/20"
              animate={reduced ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: EASE_OUT }}
              aria-hidden
            >
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </motion.span>
            Scroll
          </button>
        </div>
      </div>
    </section>
  )
}
