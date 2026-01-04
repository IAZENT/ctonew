'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Drill, Sparkles, TestTube2, Truck, Wrench } from 'lucide-react'

import { loadGSAP } from '@/lib/animations/gsap-config'

const steps = [
  {
    title: 'Consultation',
    description: 'We assess space, usage, and efficiency goals.',
    Icon: ClipboardList,
  },
  {
    title: 'System Design',
    description: 'Capacity planning, airflow layout, and unit selection.',
    Icon: Sparkles,
  },
  {
    title: 'Delivery',
    description: 'Scheduled delivery with protective packaging.',
    Icon: Truck,
  },
  {
    title: 'Installation',
    description: 'Precision mounting, line sets, and electrical work.',
    Icon: Drill,
  },
  {
    title: 'Testing',
    description: 'Calibration, pressure checks, and noise verification.',
    Icon: TestTube2,
  },
  {
    title: 'Handover',
    description: 'Smart setup, usage walkthrough, and support details.',
    Icon: Wrench,
  },
]

export function InstallationTimeline() {
  const sectionRef = React.useRef<HTMLElement | null>(null)
  const lineRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const section = sectionRef.current
    const line = lineRef.current
    if (!section || !line) return

    let ctx: import('gsap').Context | null = null
    let cancelled = false

    loadGSAP()
      .then(({ gsap }) => {
        if (cancelled) return

        ctx = gsap.context(() => {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              transformOrigin: 'top',
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 60%',
                scrub: true,
              },
            },
          )

          const icons = section.querySelectorAll<HTMLElement>('[data-timeline-icon]')
          gsap.fromTo(
            icons,
            { scale: 0, rotate: -180, opacity: 0 },
            {
              scale: 1.2,
              rotate: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.2,
              scrollTrigger: {
                trigger: section,
                start: 'top 75%',
              },
            },
          )
        }, section)
      })
      .catch(() => {})

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-semibold tracking-tight">Installation process</h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          A premium experience from consultation to calibration.
        </p>

        <div className="relative mt-12">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-foreground/10 md:block" />
          <div
            ref={lineRef}
            className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-primary to-iceBlue md:block"
            style={{ transform: 'translateX(-50%) scaleY(0)' }}
            aria-hidden
          />

          <ol className="space-y-10 md:space-y-0">
            {steps.map((step, idx) => {
              const isLeft = idx % 2 === 0
              return (
                <li
                  key={step.title}
                  className="relative grid gap-4 md:grid-cols-2 md:items-center"
                >
                  <div className={isLeft ? 'md:pr-10' : 'md:col-start-2 md:pl-10'}>
                    <div className="rounded-3xl border border-foreground/10 bg-card p-6 shadow-sm shadow-foreground/5">
                      <div className="flex items-start gap-4">
                        <div
                          data-timeline-icon
                          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                        >
                          <step.Icon className="h-5 w-5" aria-hidden />
                        </div>
                        <div>
                          <div className="text-base font-semibold tracking-tight">{step.title}</div>
                          <div className="mt-1 text-sm text-foreground/70">{step.description}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={isLeft ? 'hidden md:block' : 'hidden md:block md:col-start-1'}>
                    <motion.div
                      className="mx-auto h-3 w-3 rounded-full bg-primary"
                      initial={{ scale: 0.8, opacity: 0.4 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                    />
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
