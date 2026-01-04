'use client'

import * as React from 'react'

import { loadGSAP } from '@/lib/animations/gsap-config'

type LenisInstance = import('lenis').default

type ScrollTarget = Parameters<LenisInstance['scrollTo']>[0]

type LenisContextValue = {
  lenis: LenisInstance | null
  scrollTo: (target: ScrollTarget, options?: Parameters<LenisInstance['scrollTo']>[1]) => void
  isEnabled: boolean
}

const LenisContext = React.createContext<LenisContextValue | null>(null)

function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = React.useState<LenisInstance | null>(null)
  const [isEnabled, setIsEnabled] = React.useState(false)

  React.useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) {
      setIsEnabled(false)
      return
    }

    let rafId = 0
    let destroyed = false

    async function init() {
      const Lenis = (await import('lenis')).default
      if (destroyed) return

      const instance = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        smoothTouch: false,
      })

      setLenis(instance)
      setIsEnabled(true)

      const raf = (time: number) => {
        instance.raf(time)
        rafId = window.requestAnimationFrame(raf)
      }
      rafId = window.requestAnimationFrame(raf)

      loadGSAP()
        .then(({ ScrollTrigger }) => {
          instance.on('scroll', () => ScrollTrigger.update())
          ScrollTrigger.refresh()
        })
        .catch(() => {})
    }

    init()

    return () => {
      destroyed = true
      window.cancelAnimationFrame(rafId)
      setIsEnabled(false)
      setLenis((current) => {
        current?.destroy()
        return null
      })
    }
  }, [])

  const scrollTo = React.useCallback<LenisContextValue['scrollTo']>((target, options) => {
    if (lenis) {
      lenis.scrollTo(target, {
        offset: 0,
        ...options,
      })
      return
    }

    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' })
      return
    }

    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth' })
      return
    }

    if (typeof target === 'string') {
      const el = document.querySelector<HTMLElement>(target)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [lenis])

  const value = React.useMemo<LenisContextValue>(
    () => ({
      lenis,
      scrollTo,
      isEnabled,
    }),
    [lenis, scrollTo, isEnabled],
  )

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
}

export function useLenis() {
  const ctx = React.useContext(LenisContext)
  if (!ctx) throw new Error('useLenis must be used within <LenisProvider>')
  return ctx
}
