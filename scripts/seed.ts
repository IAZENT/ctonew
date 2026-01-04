import 'dotenv/config'

import config from '../payload.config'

type CategorySeed = { categoryName: string; slug: string; displayOrder: number }

type ProductSeed = {
  productName: string
  modelNumber: string
  categorySlug: string
  coolingCapacity: number
  energyRating: number
  price: number
  featured?: boolean
}

const categories: CategorySeed[] = [
  { categoryName: 'Window AC Units', slug: 'window-ac-units', displayOrder: 1 },
  { categoryName: 'Split AC Systems', slug: 'split-ac-systems', displayOrder: 2 },
  {
    categoryName: 'Portable & Cassette Units',
    slug: 'portable-cassette-units',
    displayOrder: 3,
  },
]

const products: ProductSeed[] = [
  // Window
  {
    productName: 'Aircon Twin Window 12,000',
    modelNumber: 'AC-TWIN-12000',
    categorySlug: 'window-ac-units',
    coolingCapacity: 12000,
    energyRating: 4,
    price: 299.99,
  },
  {
    productName: 'Aircon Twin Window 18,000',
    modelNumber: 'AC-TWIN-18000',
    categorySlug: 'window-ac-units',
    coolingCapacity: 18000,
    energyRating: 4.5,
    price: 449.99,
  },
  {
    productName: 'Aircon Twin Window 24,000',
    modelNumber: 'AC-TWIN-24000',
    categorySlug: 'window-ac-units',
    coolingCapacity: 24000,
    energyRating: 4.5,
    price: 599.99,
  },

  // Split
  {
    productName: 'Aircon Split Inverter Wall 12,000',
    modelNumber: 'AC-SPLT-12000-IW',
    categorySlug: 'split-ac-systems',
    coolingCapacity: 12000,
    energyRating: 5,
    price: 699.99,
  },
  {
    productName: 'Aircon Split Inverter Wall 18,000',
    modelNumber: 'AC-SPLT-18000-IW',
    categorySlug: 'split-ac-systems',
    coolingCapacity: 18000,
    energyRating: 5,
    price: 899.99,
  },
  {
    productName: 'Aircon Split Inverter Wall 24,000',
    modelNumber: 'AC-SPLT-24000-IW',
    categorySlug: 'split-ac-systems',
    coolingCapacity: 24000,
    energyRating: 5,
    price: 1199.99,
  },
  {
    productName: 'Aircon Split Inverter Wall 36,000',
    modelNumber: 'AC-SPLT-36000-IW',
    categorySlug: 'split-ac-systems',
    coolingCapacity: 36000,
    energyRating: 4.5,
    price: 1599.99,
    featured: true,
  },

  // Portable & Cassette
  {
    productName: 'Aircon Portable Mobile 12,000',
    modelNumber: 'AC-PORT-12000-MB',
    categorySlug: 'portable-cassette-units',
    coolingCapacity: 12000,
    energyRating: 3.5,
    price: 349.99,
  },
  {
    productName: 'Aircon Portable Mobile 14,000',
    modelNumber: 'AC-PORT-14000-MB',
    categorySlug: 'portable-cassette-units',
    coolingCapacity: 14000,
    energyRating: 4,
    price: 449.99,
  },
  {
    productName: 'Aircon Cassette Ceiling 12,000',
    modelNumber: 'AC-CASS-12000-CL',
    categorySlug: 'portable-cassette-units',
    coolingCapacity: 12000,
    energyRating: 4.5,
    price: 799.99,
  },
  {
    productName: 'Aircon Cassette Ceiling 18,000',
    modelNumber: 'AC-CASS-18000-CL',
    categorySlug: 'portable-cassette-units',
    coolingCapacity: 18000,
    energyRating: 4.5,
    price: 999.99,
  },
  {
    productName: 'Aircon Cassette Ceiling 24,000',
    modelNumber: 'AC-CASS-24000-CL',
    categorySlug: 'portable-cassette-units',
    coolingCapacity: 24000,
    energyRating: 4.5,
    price: 1299.99,
  },
]

async function main() {
  const Payload = await import('payload')
  const getPayload = (Payload as any).getPayload
  if (typeof getPayload !== 'function') {
    throw new Error('Payload getPayload API not available')
  }

  const payload = await getPayload({ config })

  const categoryIdBySlug = new Map<string, string>()

  for (const c of categories) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: c.slug } },
      limit: 1,
    })

    const doc = existing.docs?.[0]
      ? await payload.update({
          collection: 'categories',
          id: existing.docs[0].id,
          data: c,
        })
      : await payload.create({
          collection: 'categories',
          data: c,
        })

    categoryIdBySlug.set(c.slug, doc.id)
  }

  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.categorySlug)
    if (!categoryId) throw new Error(`Missing category: ${p.categorySlug}`)

    const data = {
      ...p,
      category: categoryId,
      featured: Boolean(p.featured),
      status: 'published',
      publishedAt: new Date().toISOString(),
    }

    const existing = await payload.find({
      collection: 'products',
      where: { modelNumber: { equals: p.modelNumber } },
      limit: 1,
    })

    if (existing.docs?.[0]) {
      await payload.update({
        collection: 'products',
        id: existing.docs[0].id,
        data,
      })
    } else {
      await payload.create({
        collection: 'products',
        data,
      })
    }
  }

  console.info('Seed completed')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
