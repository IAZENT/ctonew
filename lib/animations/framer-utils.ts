import type { Transition, Variants } from 'framer-motion'
import { useInView, useReducedMotion } from 'framer-motion'
import * as React from 'react'

export const EASE_OUT: Transition['ease'] = [0.23, 1, 0.32, 1]

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE_OUT } },
}

export const staggerContainer = (stagger = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
})

export function useInViewOnce<T extends Element>(options?: Parameters<typeof useInView>[1]) {
  const ref = React.useRef<T | null>(null)
  const inView = useInView(ref, { amount: 0.2, once: true, ...options })
  return { ref, inView }
}

export function useMotionEnabled() {
  const reduced = useReducedMotion()
  return !reduced
}
