'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Cpu, Leaf, ShieldCheck, Sparkles, Volume2 } from 'lucide-react'

import { useLenis } from '@/lib/animations/lenis-setup'
import { fadeInUp, staggerContainer } from '@/lib/animations/framer-utils'

type Benefit = {
  title: string
  description: string
  metric: string
  Icon: React.ComponentType<{ className?: string }>
}

const benefits: Benefit[] = [
  {
    title: 'Ultra-quiet operation',
    description: 'Acoustically optimized airflow and vibration damping.',
    metric: '19dB',
    Icon: Volume2,
  },
  {
    title: 'Efficient by design',
    description: 'Smart inverter control to reduce energy waste.',
    metric: 'A+++',
    Icon: Leaf,
  },
  {
    title: 'Reliability built-in',
    description: 'Premium components for long service life.',
    metric: '10yr',
    Icon: ShieldCheck,
  },
  {
    title: 'Smarter comfort',
    description: 'Sensors and automation maintain stable temperatures.',
    metric: 'AI',
    Icon: Cpu,
  },
  {
    title: 'Premium finishes',
    description: 'Refined aesthetics for modern interiors.',
    metric: 'Metal',
    Icon: Sparkles,
  },
]

export function WhyChooseSection() {
  const reduced = useReducedMotion()
  const { isEnabled } = useLenis()

  const containerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1024) return
      if (!el.matches(':hover')) return

      e.preventDefault()
      el.scrollBy({ left: e.deltaY, behavior: isEnabled ? 'auto' : 'smooth' })
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [isEnabled])

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth < 1024) return
      if (document.activeElement !== el) return

      if (e.key === 'ArrowRight') el.scrollBy({ left: 320, behavior: 'smooth' })
      if (e.key === 'ArrowLeft') el.scrollBy({ left: -320, behavior: 'smooth' })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <section className="bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-semibold tracking-tight">Why choose Aircon</h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          Designed for everyday comfort — tuned for efficiency, silence, and premium experiences.
        </p>

        <motion.div
          ref={containerRef}
          tabIndex={0}
          aria-label="Aircon benefits"
          className="mt-10 flex gap-6 overflow-x-auto rounded-[2rem] pb-2 outline-none lg:snap-x lg:snap-mandatory lg:pb-6 [scrollbar-color:hsl(var(--primary))_transparent]"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.2, once: true }}
        >
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              variants={fadeInUp}
              className="relative w-[320px] shrink-0 snap-start rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm shadow-foreground/5 transition hover:-translate-y-1 hover:border-foreground/15 hover:shadow-lg hover:shadow-foreground/10"
            >
              <motion.div
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                whileHover={reduced ? undefined : { rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <b.Icon className="h-5 w-5" aria-hidden />
              </motion.div>

              <div className="mt-4 text-lg font-semibold tracking-tight">{b.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{b.description}</p>

              <div className="mt-5 flex items-center justify-between">
                <div className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-foreground/70 ring-1 ring-foreground/10">
                  {b.metric}
                </div>
                <ArrowRight className="h-4 w-4 text-foreground/50" aria-hidden />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-6 text-xs text-foreground/60 lg:hidden">
          Horizontal scroll is enabled on desktop. On mobile, cards flow naturally.
        </p>
      </div>
    </section>
  )
}
