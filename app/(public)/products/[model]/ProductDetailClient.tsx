'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Copy, X } from 'lucide-react'

import type { ProductListItem } from '@/lib/payload-client'
import { EASE_OUT, fadeInUp } from '@/lib/animations/framer-utils'

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

const galleryImages = ['/images/product-detail-1.svg', '/images/product-detail-2.svg', '/images/product-detail-3.svg']

export function ProductDetailClient({ product }: { product: ProductListItem }) {
  const reduced = useReducedMotion()

  const totalImages = galleryImages.length

  const [activeImage, setActiveImage] = React.useState(0)
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [stickyVisible, setStickyVisible] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  React.useEffect(() => {
    if (!lightboxOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') setActiveImage((i) => (i + 1) % totalImages)
      if (e.key === 'ArrowLeft') setActiveImage((i) => (i - 1 + totalImages) % totalImages)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen, totalImages])

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="text-sm text-foreground/60">
        <Link className="hover:underline" href="/">
          Home
        </Link>{' '}
        /{' '}
        <Link className="hover:underline" href="/products">
          Products
        </Link>{' '}
        / {product.modelNumber}
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-foreground/10 bg-card shadow-2xl shadow-foreground/10">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="group relative block aspect-[4/3] w-full"
              aria-label="Open image lightbox"
              data-cursor="VIEW"
            >
              <motion.div
                className="absolute inset-0"
                whileHover={reduced ? undefined : { scale: 1.3 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
              >
                <Image
                  src={galleryImages[activeImage]!}
                  alt={product.productName}
                  fill
                  className="object-cover"
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-tr from-background/15 via-transparent to-background/10" />
            </button>
          </div>

          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {galleryImages.map((src, idx) => {
              const active = idx === activeImage
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={
                    'relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border bg-card transition ' +
                    (active ? 'border-primary' : 'border-foreground/10 hover:border-foreground/20')
                  }
                  aria-label={`Select image ${idx + 1}`}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="112px" />
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight">{product.productName}</h1>
          <div className="mt-2 flex items-center gap-3">
            <div className="font-mono text-sm text-foreground/70">{product.modelNumber}</div>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(product.modelNumber)}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-card px-3 text-xs font-medium ring-1 ring-foreground/10 transition hover:bg-foreground/5"
              aria-label="Copy model number"
            >
              <Copy className="h-3.5 w-3.5" aria-hidden />
              Copy
            </button>
          </div>

          <div className="mt-8 rounded-3xl border border-foreground/10 bg-card p-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-foreground/60">Starting at</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-primary">{formatPrice(product.price)}</div>

            <div className="mt-6 grid gap-3 text-sm text-foreground/80 sm:grid-cols-2">
              {[
                { k: 'Capacity', v: '2.5–6.0 kW' },
                { k: 'Power', v: 'Inverter' },
                { k: 'Energy rating', v: 'A+++' },
                { k: 'Noise', v: '19dB' },
              ].map((row) => (
                <div key={row.k} className="flex items-center justify-between gap-3 rounded-2xl bg-background px-4 py-3 ring-1 ring-foreground/10">
                  <span className="text-foreground/70">{row.k}</span>
                  <span className="font-medium">{row.v}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-95"
              >
                Request quote
              </Link>
              <Link
                href="/products"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-background px-5 text-sm font-medium ring-1 ring-foreground/10 transition hover:bg-foreground/5"
              >
                Back to products
              </Link>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            <motion.section
              className="rounded-3xl border border-foreground/10 bg-card p-6"
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              <h2 className="text-lg font-semibold">Key features</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-foreground/75">
                <li>3D airflow for consistent room coverage.</li>
                <li>Smart scheduling with energy insights.</li>
                <li>Quiet-night mode with adaptive fan curves.</li>
                <li>Premium filtration for cleaner air.</li>
              </ul>
            </motion.section>

            <motion.section
              className="rounded-3xl border border-foreground/10 bg-card p-6"
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              <h2 className="text-lg font-semibold">Specifications</h2>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                {[
                  { k: 'Cooling capacity', v: '5.0 kW' },
                  { k: 'Heating capacity', v: '5.6 kW' },
                  { k: 'Voltage', v: '220–240V' },
                  { k: 'Dimensions', v: '900 × 300 × 215 mm' },
                ].map((row) => (
                  <div key={row.k} className="rounded-2xl bg-background px-4 py-3 ring-1 ring-foreground/10">
                    <div className="text-xs font-semibold uppercase tracking-wide text-foreground/60">{row.k}</div>
                    <div className="mt-1 font-medium">{row.v}</div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen ? (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setLightboxOpen(false)
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
          >
            <div className="absolute inset-0 bg-background/70 backdrop-blur" />
            <motion.div
              className="relative mx-auto mt-24 w-[min(92vw,980px)] overflow-hidden rounded-[2.5rem] border border-foreground/10 bg-card shadow-2xl"
              initial={{ y: -14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
            >
              <div className="flex items-center justify-between gap-3 border-b border-foreground/10 px-5 py-4">
                <div className="text-sm font-semibold">{product.productName}</div>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-foreground/10 transition hover:bg-foreground/5"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative aspect-[16/10] bg-background">
                <Image
                  src={galleryImages[activeImage]!}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 80vw, 100vw"
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {stickyVisible ? (
          <motion.div
            className="fixed inset-x-0 top-16 z-30 border-b border-foreground/10 bg-background/75 backdrop-blur"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 text-sm">
              <div className="font-medium">{product.modelNumber}</div>
              <div className="hidden items-center gap-3 text-xs text-foreground/70 sm:flex">
                <span>Capacity 5.0kW</span>
                <span className="h-1 w-1 rounded-full bg-foreground/20" aria-hidden />
                <span>A+++</span>
                <span className="h-1 w-1 rounded-full bg-foreground/20" aria-hidden />
                <span>{formatPrice(product.price)}</span>
              </div>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground"
              >
                Inquire
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}
