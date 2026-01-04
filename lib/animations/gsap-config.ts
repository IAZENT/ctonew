export type GSAPBundle = {
  gsap: (typeof import('gsap'))['gsap']
  ScrollTrigger: (typeof import('gsap/ScrollTrigger'))['ScrollTrigger']
}

let gsapBundle: GSAPBundle | null = null

export async function loadGSAP(): Promise<GSAPBundle> {
  if (typeof window === 'undefined') {
    throw new Error('GSAP can only be loaded in the browser')
  }

  if (gsapBundle) return gsapBundle

  const gsapModule = await import('gsap')
  const scrollTriggerModule = await import('gsap/ScrollTrigger')

  const gsap = gsapModule.gsap
  const ScrollTrigger = scrollTriggerModule.ScrollTrigger

  gsap.registerPlugin(ScrollTrigger)

  gsapBundle = { gsap, ScrollTrigger }
  return gsapBundle
}

export async function refreshScrollTriggers() {
  const { ScrollTrigger } = await loadGSAP()
  ScrollTrigger.refresh()
}
