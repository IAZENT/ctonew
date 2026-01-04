'use client'

import * as React from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

import { EASE_OUT } from '@/lib/animations/framer-utils'

type CursorState = {
  label: string
  active: boolean
  magneticTarget: HTMLElement | null
}

function isTouch() {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function CustomCursor() {
  const reduced = useReducedMotion()
  const enabled = !reduced && !isTouch()

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  const springX = useSpring(x, { stiffness: 450, damping: 40 })
  const springY = useSpring(y, { stiffness: 450, damping: 40 })

  const [state, setState] = React.useState<CursorState>({
    label: '',
    active: false,
    magneticTarget: null,
  })

  React.useEffect(() => {
    if (!enabled) return

    const handleMove = (e: MouseEvent) => {
      let nextX = e.clientX
      let nextY = e.clientY

      const el = state.magneticTarget
      if (el) {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (cx - e.clientX) * 0.15
        const dy = (cy - e.clientY) * 0.15

        const max = 12
        nextX += Math.max(-max, Math.min(max, dx))
        nextY += Math.max(-max, Math.min(max, dy))
      }

      x.set(nextX)
      y.set(nextY)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [enabled, state.magneticTarget, x, y])

  React.useEffect(() => {
    if (!enabled) return

    const selector = 'a, button, [role="button"], [data-cursor]'
    const observed = new WeakSet<Element>()

    const attach = (el: Element) => {
      if (!(el instanceof HTMLElement) || observed.has(el)) return
      observed.add(el)

      const label = el.getAttribute('data-cursor') || (el.tagName === 'A' ? 'VIEW' : 'CLICK')

      const onEnter = () => {
        setState({ label, active: true, magneticTarget: el })
      }
      const onLeave = () => {
        setState({ label: '', active: false, magneticTarget: null })
      }

      el.addEventListener('pointerenter', onEnter)
      el.addEventListener('pointerleave', onLeave)

      return () => {
        el.removeEventListener('pointerenter', onEnter)
        el.removeEventListener('pointerleave', onLeave)
      }
    }

    const cleanups: Array<() => void> = []

    const scan = () => {
      document.querySelectorAll(selector).forEach((el) => {
        const cleanup = attach(el)
        if (cleanup) cleanups.push(cleanup)
      })
    }

    scan()

    const mutationObserver = new MutationObserver(() => scan())
    mutationObserver.observe(document.documentElement, { subtree: true, childList: true })

    const intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) attach(entry.target)
      }
    })

    document.querySelectorAll(selector).forEach((el) => intersectionObserver.observe(el))

    return () => {
      mutationObserver.disconnect()
      intersectionObserver.disconnect()
      cleanups.forEach((fn) => fn())
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-3 w-3 select-none items-center justify-center rounded-full bg-[rgba(0,102,204,0.25)] text-[10px] font-semibold tracking-widest text-primary-foreground shadow-[0_0_24px_rgba(0,102,204,0.35)] md:flex"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      animate={
        state.active
          ? {
              width: 40,
              height: 40,
              backgroundColor: 'rgba(0,102,204,0.15)',
              borderColor: 'rgba(0,102,204,0.9)',
              borderWidth: 2,
            }
          : {
              width: 12,
              height: 12,
              borderWidth: 0,
              backgroundColor: 'rgba(0,102,204,0.25)',
            }
      }
      transition={{ duration: 0.2, ease: EASE_OUT }}
    >
      {state.active ? <span className="text-[9px] text-foreground">{state.label}</span> : null}
    </motion.div>
  )
}
