import Link from 'next/link'

import { getProductByModel } from '@/lib/payload-client'

import { ProductDetailClient } from './ProductDetailClient'

export const dynamic = 'force-dynamic'

type Props = {
  params: { model: string }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductByModel(params.model).catch(() => null)

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <p className="mt-4 text-foreground/70">Start Payload + seed to populate initial data.</p>
        <Link className="mt-8 inline-flex text-primary hover:underline" href="/products">
          Back to products
        </Link>
      </main>
    )
  }

  return <ProductDetailClient product={product} />
}
