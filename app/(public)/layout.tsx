import type { Metadata } from 'next'

import { CustomCursor } from '@/components/animations/CustomCursor'
import { PageTransition } from '@/components/animations/PageTransition'
import { ScrollToTopButton } from '@/components/animations/ScrollToTopButton'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { LenisProvider } from '@/lib/animations/lenis-setup'

export const metadata: Metadata = {
  title: {
    default: 'Aircon — Premium Air Conditioning',
    template: '%s — Aircon',
  },
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LenisProvider>
        <div className="min-h-dvh bg-background text-foreground">
          <Header />
          <div className="pt-16">
            <PageTransition>{children}</PageTransition>
          </div>
          <Footer />
          <CustomCursor />
          <ScrollToTopButton />
        </div>
      </LenisProvider>
    </ThemeProvider>
  )
}
