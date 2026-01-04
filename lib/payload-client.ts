type PayloadDocsResponse<T> = {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page?: number
  pagingCounter?: number
  hasPrevPage?: boolean
  hasNextPage?: boolean
  prevPage?: number | null
  nextPage?: number | null
}

export function getPayloadServerURL() {
  return process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3001'
}

async function payloadFetch(path: string, init?: RequestInit) {
  const url = new URL(path, getPayloadServerURL())
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Payload request failed (${res.status}): ${text}`)
  }

  return res
}

export type ProductListItem = {
  id: string
  productName: string
  modelNumber: string
  slug: string
  price: number
  featured?: boolean
}

export async function getProducts(): Promise<ProductListItem[]> {
  const res = await payloadFetch('/api/products?limit=50')
  const json = (await res.json()) as PayloadDocsResponse<ProductListItem>
  return json.docs
}

export async function getProductByModel(model: string): Promise<ProductListItem | null> {
  const res = await payloadFetch(`/api/products?where[modelNumber][equals]=${encodeURIComponent(model)}`)
  const json = (await res.json()) as PayloadDocsResponse<ProductListItem>
  return json.docs[0] ?? null
}
