'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

import { useLenis } from '@/lib/animations/lenis-setup'
import { EASE_OUT } from '@/lib/animations/framer-utils'

export function ScrollToTopButton() {
  const { scrollTo } = useLenis()
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          className="fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-foreground/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          onClick={() => scrollTo(0)}
          aria-label="Scroll to top"
        >
          <motion.span whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <ArrowUp className="h-5 w-5" aria-hidden />
          </motion.span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}
