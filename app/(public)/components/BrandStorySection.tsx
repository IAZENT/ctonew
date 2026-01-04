'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, useMotionValue, animate, useReducedMotion } from 'framer-motion'
import { Award, Leaf, ShieldCheck } from 'lucide-react'

import { loadGSAP } from '@/lib/animations/gsap-config'
import { EASE_OUT, fadeInUp } from '@/lib/animations/framer-utils'

type Stat = {
  label: string
  value: number
  suffix: string
}

const stats: Stat[] = [
  { label: 'Years', value: 24, suffix: '+' },
  { label: 'Installations', value: 250_000, suffix: '+' },
  { label: 'Satisfaction', value: 99, suffix: '%' },
]

function StatCounter({ stat }: { stat: Stat }) {
  const reduced = useReducedMotion()
  const ref = React.useRef<HTMLDivElement | null>(null)
  const motionValue = useMotionValue(0)
  const [display, setDisplay] = React.useState(0)

  React.useEffect(() => motionValue.on('change', (v) => setDisplay(Math.round(v))), [motionValue])

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()

        if (reduced) {
          setDisplay(stat.value)
          return
        }

        animate(motionValue, stat.value, { duration: 2, ease: EASE_OUT })
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [motionValue, reduced, stat.value])

  const formatted = new Intl.NumberFormat('en-US').format(display)

  return (
    <div ref={ref} className="rounded-3xl border border-foreground/10 bg-card p-5">
      <div className="text-3xl font-semibold tracking-tight text-primary">
        {formatted}
        {stat.suffix}
      </div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-foreground/60">
        {stat.label}
      </div>
    </div>
  )
}

export function BrandStorySection() {
  const sectionRef = React.useRef<HTMLElement | null>(null)
  const textRef = React.useRef<HTMLDivElement | null>(null)
  const imageRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const section = sectionRef.current
    const text = textRef.current
    const image = imageRef.current
    if (!section || !text || !image) return

    let ctx: import('gsap').Context | null = null
    let cancelled = false

    loadGSAP()
      .then(({ gsap, ScrollTrigger }) => {
        if (cancelled) return

        ctx = gsap.context(() => {
          gsap.fromTo(
            text,
            { x: -100, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
              },
            },
          )

          gsap.fromTo(
            image,
            { x: 100, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
              },
            },
          )

          gsap.to(text, {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })

          gsap.to(image, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })

          const icons = section.querySelectorAll<HTMLElement>('[data-core-value-icon]')
          gsap.fromTo(
            icons,
            { scale: 0, opacity: 0 },
            {
              scale: 1.2,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.1,
              scrollTrigger: {
                trigger: section,
                start: 'top 75%',
              },
            },
          )
        }, section)

        ScrollTrigger.refresh()
      })
      .catch(() => {})

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <section
      id="brand-story"
      ref={sectionRef}
      className="relative overflow-hidden bg-white text-slate-900"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,102,204,0.08),transparent_55%)]" aria-hidden />

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2">
        <div ref={textRef}>
          <motion.h2
            className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ amount: 0.3, once: true }}
          >
            Built around comfort, engineered for performance.
          </motion.h2>

          <p className="mt-6 max-w-prose text-pretty text-base leading-relaxed text-slate-700">
            Aircon designs premium cooling systems for modern spaces — with a relentless focus on
            energy efficiency, quiet operation, and refined industrial design. Every model is built to
            deliver stable temperatures, intelligent airflow, and long-term durability. Our philosophy
            is simple: technology should disappear into the background, leaving you with effortless
            comfort.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[{
              title: 'Precision',
              desc: 'Tightly controlled cooling curves.',
              Icon: Award,
            },
            {
              title: 'Sustainability',
              desc: 'Eco-friendly refrigerants & insights.',
              Icon: Leaf,
            },
            {
              title: 'Reliability',
              desc: 'Built to run quietly for years.',
              Icon: ShieldCheck,
            }].map(({ title, desc, Icon }) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-white p-5">
                <div
                  data-core-value-icon
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-900"
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="mt-3 text-sm font-semibold">{title}</div>
                <div className="mt-1 text-sm text-slate-600">{desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <StatCounter key={s.label} stat={s} />
            ))}
          </div>
        </div>

        <div ref={imageRef} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-50">
            <Image
              src="/images/brand-story.svg"
              alt="Premium aircon installation"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
