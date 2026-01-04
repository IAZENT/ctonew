import { getProducts } from '@/lib/payload-client'

import { ProductsListingClient } from './ProductsListingClient'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products = await getProducts().catch(() => [])

  return <ProductsListingClient products={products} />
}
