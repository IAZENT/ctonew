'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Cpu, Fan, Leaf, Volume2 } from 'lucide-react'

import { loadGSAP } from '@/lib/animations/gsap-config'
import { fadeInUp, staggerContainer } from '@/lib/animations/framer-utils'

const features = [
  {
    title: 'Energy Efficiency Technology',
    description: 'Inverter compressor logic that adapts output to real-time load.',
    badge: 'A+++',
    Icon: Leaf,
  },
  {
    title: 'Smart Cooling Systems',
    description: 'Sensors + automation to maintain comfort while reducing waste.',
    badge: 'AI',
    Icon: Cpu,
  },
  {
    title: 'Eco-Friendly Refrigerants',
    description: 'Low GWP refrigerants to reduce environmental impact.',
    badge: 'R32',
    Icon: Leaf,
  },
  {
    title: 'Quiet Operation Innovation',
    description: 'Acoustic damping & blade design for whisper-level airflow.',
    badge: '19dB',
    Icon: Volume2,
  },
]

export function TechnologySection() {
  const sectionRef = React.useRef<HTMLElement | null>(null)
  const svgRef = React.useRef<SVGSVGElement | null>(null)

  React.useEffect(() => {
    const section = sectionRef.current
    const svg = svgRef.current
    if (!section || !svg) return

    let ctx: import('gsap').Context | null = null
    let cancelled = false

    loadGSAP()
      .then(({ gsap }) => {
        if (cancelled) return

        ctx = gsap.context(() => {
          const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path'))
          paths.forEach((p) => {
            const len = p.getTotalLength()
            p.style.strokeDasharray = String(len)
            p.style.strokeDashoffset = String(len)
          })

          gsap.to(paths, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: 'power2.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
            },
          })
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
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div className="rounded-[2.5rem] border border-foreground/10 bg-card p-6 shadow-lg shadow-foreground/5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">
            <Fan className="h-4 w-4 text-primary" aria-hidden />
            Technical overview
          </div>

          <svg
            ref={svgRef}
            viewBox="0 0 640 420"
            className="mt-6 h-auto w-full"
            role="img"
            aria-label="Animated cooling technology diagram"
          >
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="hsl(var(--primary))" offset="0" />
                <stop stopColor="hsl(var(--accent))" offset="1" />
              </linearGradient>
            </defs>
            <path d="M80 210h190" stroke="url(#g)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M270 210c40-70 110-70 150 0" stroke="url(#g)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M420 210h140" stroke="url(#g)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M140 120c40 20 60 50 60 90s-20 70-60 90" stroke="url(#g)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M500 120c-40 20-60 50-60 90s20 70 60 90" stroke="url(#g)" strokeWidth="6" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.25, once: true }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {features.map(({ title, description, badge, Icon }) => (
            <motion.div
              key={title}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 transition"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="absolute inset-0 opacity-0 shadow-[0_0_0_1px_rgba(0,163,224,0.6),0_20px_60px_rgba(0,163,224,0.15)] transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground/70 ring-1 ring-foreground/10">
                    {badge}
                  </div>
                </div>

                <div className="mt-4 text-base font-semibold tracking-tight">{title}</div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
