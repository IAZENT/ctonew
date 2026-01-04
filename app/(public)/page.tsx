import { HeroSection, type HeroProduct } from '@/app/(public)/components/HeroSection'
import { BrandStorySection } from '@/app/(public)/components/BrandStorySection'
import { TechnologySection } from '@/app/(public)/components/TechnologySection'
import { CategoriesSection } from '@/app/(public)/components/CategoriesSection'
import { WhyChooseSection } from '@/app/(public)/components/WhyChooseSection'
import { InstallationTimeline } from '@/app/(public)/components/InstallationTimeline'
import { TestimonialsSection } from '@/app/(public)/components/TestimonialsSection'
import { ContactSection } from '@/app/(public)/components/ContactSection'
import { getProducts } from '@/lib/payload-client'

export const dynamic = 'force-dynamic'

function toHeroProducts(products: Awaited<ReturnType<typeof getProducts>>): HeroProduct[] {
  const placeholders = ['/images/hero-product-1.svg', '/images/hero-product-2.svg', '/images/hero-product-3.svg']

  return products.slice(0, 3).map((p, idx) => ({
    productName: p.productName,
    modelNumber: p.modelNumber,
    price: p.price,
    features: ['Ultra-quiet operation', 'High efficiency inverter control', 'Smart scheduling & sensors', 'Premium build quality'],
    imageSrc: placeholders[idx % placeholders.length]!,
  }))
}

export default async function HomePage() {
  const products = await getProducts().catch(() => [])

  return (
    <main>
      <HeroSection products={toHeroProducts(products)} />
      <BrandStorySection />
      <TechnologySection />
      <CategoriesSection />
      <WhyChooseSection />
      <InstallationTimeline />
      <TestimonialsSection />
      <ContactSection />
    </main>
  )
}
