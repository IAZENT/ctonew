import Link from 'next/link'

import { getProductByModel } from '@/lib/payload-client'

export const dynamic = 'force-dynamic'

type Props = {
  params: { model: string }
}

export default async function ProductDetailPage({ params }: Props) {
  const { model } = params
  const product = await getProductByModel(model).catch(() => null)

  if (!product) {
    return (
      <main className="min-h-dvh bg-background text-foreground">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-2xl font-semibold">Product not found</h1>
          <p className="mt-4 text-foreground/70">
            Start Payload + seed to populate initial data.
          </p>
          <Link className="mt-8 inline-flex text-primary hover:underline" href="/products">
            Back to products
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link className="text-sm text-primary hover:underline" href="/products">
          ← Products
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">{product.productName}</h1>
        <div className="mt-2 font-mono text-sm text-foreground/70">{product.modelNumber}</div>

        <div className="mt-8 rounded-xl border border-foreground/10 bg-card p-6">
          <div className="text-sm text-foreground/70">Starting at</div>
          <div className="mt-1 text-2xl font-medium">${product.price.toFixed(2)}</div>
        </div>
      </div>
    </main>
  )
}
