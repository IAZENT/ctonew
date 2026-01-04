import Link from 'next/link'

import { getProducts } from '@/lib/payload-client'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products = await getProducts().catch(() => [])

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
        <p className="mt-2 text-foreground/70">Showing data from Payload (when running).</p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {products.map((p) => (
            <li key={p.id} className="rounded-xl border border-foreground/10 bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium">{p.productName}</h2>
                  <p className="mt-1 font-mono text-sm text-foreground/70">{p.modelNumber}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">${p.price.toFixed(2)}</div>
                  {p.featured ? (
                    <div className="mt-1 inline-flex rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                      Featured
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-4">
                <Link className="text-sm font-medium text-primary hover:underline" href={`/products/${p.modelNumber}`}>
                  View details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
