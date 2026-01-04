'use client'

import * as React from 'react'

import type { ResolvedTheme, ThemeMode } from '@/lib/theme-context'
import { getSystemTheme, resolveTheme, THEME_STORAGE_KEY } from '@/lib/theme-context'

type ThemeContextValue = {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function applyResolvedTheme(resolvedTheme: ResolvedTheme) {
  const root = document.documentElement

  root.classList.add('theme-transition')
  window.setTimeout(() => {
    root.classList.remove('theme-transition')
  }, 300)

  if (resolvedTheme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')

  root.dataset.theme = resolvedTheme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<ThemeMode>('system')
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>('light')

  React.useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    const initial: ThemeMode = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
    setThemeState(initial)
  }, [])

  React.useEffect(() => {
    const nextResolved = resolveTheme(theme)
    setResolvedTheme(nextResolved)
    applyResolvedTheme(nextResolved)
  }, [theme])

  React.useEffect(() => {
    if (theme !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const sys = getSystemTheme()
      setResolvedTheme(sys)
      applyResolvedTheme(sys)
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = React.useCallback((nextTheme: ThemeMode) => {
    setThemeState(nextTheme)
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)

    const nextResolved = resolveTheme(nextTheme)
    setResolvedTheme(nextResolved)
    applyResolvedTheme(nextResolved)
  }, [])

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>')
  return ctx
}
