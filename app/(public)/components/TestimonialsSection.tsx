'use client'

import * as React from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

import { EASE_OUT } from '@/lib/animations/framer-utils'

type Testimonial = {
  name: string
  location: string
  product: string
  quote: string
  rating: number
  avatarSrc: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Sofia M.',
    location: 'Austin, TX',
    product: 'Aurora X1',
    quote: 'It’s unbelievably quiet. The room feels perfectly balanced without the usual cold blasts.',
    rating: 5,
    avatarSrc: '/images/avatar-1.svg',
  },
  {
    name: 'Daniel K.',
    location: 'San Diego, CA',
    product: 'Nimbus Smart',
    quote: 'Energy usage dropped instantly. The app insights and automation are genuinely useful.',
    rating: 5,
    avatarSrc: '/images/avatar-2.svg',
  },
  {
    name: 'Harper J.',
    location: 'Seattle, WA',
    product: 'Boreal Pro',
    quote: 'Installation was seamless and the unit looks premium — like it belongs in the space.',
    rating: 5,
    avatarSrc: '/images/avatar-3.svg',
  },
  {
    name: 'Ravi S.',
    location: 'Chicago, IL',
    product: 'Glacier Quiet',
    quote: 'No more noisy nights. The bedroom is cool, calm, and silent.',
    rating: 5,
    avatarSrc: '/images/avatar-4.svg',
  },
]

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

function RatingStars({ rating }: { rating: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < rating)

  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {stars.map((filled, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 + idx * 0.08, ease: EASE_OUT }}
        >
          <Star
            className={
              'h-4 w-4 ' + (filled ? 'fill-accent text-accent' : 'fill-transparent text-foreground/30')
            }
            aria-hidden
          />
        </motion.span>
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const reduced = useReducedMotion()
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)

  const next = React.useCallback(() => setIndex((i) => mod(i + 1, testimonials.length)), [])
  const prev = React.useCallback(() => setIndex((i) => mod(i - 1, testimonials.length)), [])

  React.useEffect(() => {
    if (reduced) return
    if (paused) return

    const id = window.setInterval(next, 8000)
    return () => window.clearInterval(id)
  }, [next, paused, reduced])

  const visible = [mod(index - 1, testimonials.length), index, mod(index + 1, testimonials.length)]

  return (
    <section className="bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Testimonials</h2>
            <p className="mt-2 max-w-2xl text-sm text-foreground/70">
              Real customers. Real comfort.
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={prev}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-background ring-1 ring-foreground/10 transition hover:bg-foreground/5"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-background ring-1 ring-foreground/10 transition hover:bg-foreground/5"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          className="mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {visible.map((idx, position) => {
              const t = testimonials[idx]
              const isCenter = position === 1

              return (
                <AnimatePresence key={t.name} mode="wait" initial={false}>
                  <motion.article
                    key={t.name + index}
                    className="rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm shadow-foreground/5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: isCenter ? 1 : 0.55,
                      scale: isCenter ? 1 : 0.92,
                      y: 0,
                    }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                    drag={isCenter ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (!isCenter) return
                      if (info.offset.x < -80 || info.velocity.x < -400) next()
                      if (info.offset.x > 80 || info.velocity.x > 400) prev()
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <RatingStars rating={t.rating} />
                      <div className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-foreground/70 ring-1 ring-foreground/10">
                        {t.product}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-foreground/80">“{t.quote}”</p>

                    <div className="mt-6 flex items-center gap-3">
                      <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
                        <Image src={t.avatarSrc} alt={t.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{t.name}</div>
                        <div className="text-xs text-foreground/60">{t.location}</div>
                      </div>
                    </div>
                  </motion.article>
                </AnimatePresence>
              )
            })}
          </div>

          <div className="mt-8 flex justify-center gap-2" aria-label="Testimonial navigation">
            {testimonials.map((t, idx) => {
              const active = idx === index
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setIndex(idx)}
                  className={
                    'h-2.5 w-2.5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
                    (active ? 'bg-primary' : 'bg-foreground/25 hover:bg-foreground/35')
                  }
                  aria-label={`Go to testimonial ${idx + 1}`}
                  aria-current={active}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
