'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Filter, Search, Star } from 'lucide-react'

import type { ProductListItem } from '@/lib/payload-client'
import { EASE_OUT, fadeInUp, staggerContainer } from '@/lib/animations/framer-utils'

type ProductStatus = 'published' | 'draft' | 'archived'

type ProductUI = ProductListItem & {
  category: string
  energyRating: number
  capacity: number
  status: ProductStatus
  imageSrc: string
}

const categories = [
  { slug: 'wall-mounted', label: 'Wall Mounted' },
  { slug: 'ducted', label: 'Ducted' },
  { slug: 'portable', label: 'Portable' },
  { slug: 'commercial', label: 'Commercial' },
]

type SortKey = 'newest' | 'capacity' | 'efficiency' | 'price' | 'alpha'

function hash(input: string) {
  let h = 0
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0
  return h
}

function derive(products: ProductListItem[]): ProductUI[] {
  const placeholders = ['/images/product-card-1.svg', '/images/product-card-2.svg', '/images/product-card-3.svg']

  return products.map((p, idx) => {
    const h = hash(p.modelNumber)
    const category = categories[h % categories.length]!.slug
    const energyRating = (h % 5) + 1
    const capacity = 2.0 + ((h % 34) / 10)
    const status: ProductStatus = p.featured ? 'published' : h % 7 === 0 ? 'draft' : 'published'

    return {
      ...p,
      category,
      energyRating,
      capacity,
      status,
      imageSrc: placeholders[idx % placeholders.length]!,
    }
  })
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export function ProductsListingClient({ products }: { products: ProductListItem[] }) {
  const items = React.useMemo(() => derive(products), [products])

  const prices = React.useMemo(() => items.map((p) => p.price), [items])
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 2500

  const [search, setSearch] = React.useState('')
  const [status, setStatus] = React.useState<'all' | ProductStatus>('all')
  const [selectedCategories, setSelectedCategories] = React.useState<Set<string>>(new Set())
  const [minEnergy, setMinEnergy] = React.useState(1)
  const [priceRange, setPriceRange] = React.useState<[number, number]>([minPrice, maxPrice])
  const [sort, setSort] = React.useState<SortKey>('newest')

  React.useEffect(() => setPriceRange([minPrice, maxPrice]), [minPrice, maxPrice])

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase()

    let list = items

    if (status !== 'all') list = list.filter((p) => p.status === status)
    if (selectedCategories.size) list = list.filter((p) => selectedCategories.has(p.category))
    if (minEnergy > 1) list = list.filter((p) => p.energyRating >= minEnergy)

    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (query) {
      list = list.filter((p) => {
        const s = `${p.productName} ${p.modelNumber}`.toLowerCase()
        return s.includes(query)
      })
    }

    const sorted = [...list]

    switch (sort) {
      case 'capacity':
        sorted.sort((a, b) => b.capacity - a.capacity)
        break
      case 'efficiency':
        sorted.sort((a, b) => b.energyRating - a.energyRating)
        break
      case 'price':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'alpha':
        sorted.sort((a, b) => a.productName.localeCompare(b.productName))
        break
      case 'newest':
      default:
        sorted.sort((a, b) => b.modelNumber.localeCompare(a.modelNumber))
        break
    }

    return sorted
  }, [items, minEnergy, priceRange, search, selectedCategories, sort, status])

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const pills: Array<{ key: string; label: string; onRemove: () => void }> = []

  if (status !== 'all') pills.push({ key: 'status', label: `Status: ${status}`, onRemove: () => setStatus('all') })
  selectedCategories.forEach((slug) => {
    const label = categories.find((c) => c.slug === slug)?.label ?? slug
    pills.push({ key: `cat-${slug}`, label: `Category: ${label}`, onRemove: () => toggleCategory(slug) })
  })
  if (minEnergy > 1) pills.push({ key: 'energy', label: `Energy: ${minEnergy}★+`, onRemove: () => setMinEnergy(1) })
  if (priceRange[0] !== minPrice || priceRange[1] !== maxPrice) {
    pills.push({
      key: 'price',
      label: `Price: ${formatPrice(priceRange[0])} – ${formatPrice(priceRange[1])}`,
      onRemove: () => setPriceRange([minPrice, maxPrice]),
    })
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm text-foreground/60">
            <Link className="hover:underline" href="/">
              Home
            </Link>{' '}
            / Products
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-2 text-sm text-foreground/70">Premium models with interactive filtering.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-[min(92vw,340px)]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="h-12 w-full rounded-2xl border border-foreground/10 bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary"
            />
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-12 rounded-2xl border border-foreground/10 bg-background px-3 text-sm outline-none transition focus:border-primary"
              aria-label="Sort products"
            >
              <option value="newest">Newest</option>
              <option value="capacity">Capacity</option>
              <option value="efficiency">Energy efficiency</option>
              <option value="price">Price</option>
              <option value="alpha">Alphabetical</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
          </div>
        </div>
      </div>

      {pills.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {pills.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={p.onRemove}
              className="rounded-full bg-card px-3 py-1 text-xs font-medium text-foreground/70 ring-1 ring-foreground/10 transition hover:bg-foreground/5"
            >
              {p.label} ×
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <details className="group rounded-3xl border border-foreground/10 bg-card p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
              <span className="inline-flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" aria-hidden />
                Filters
              </span>
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden />
            </summary>

            <div className="mt-5 space-y-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-foreground/60">Status</div>
                <div className="mt-3 grid gap-2">
                  {(['all', 'published', 'draft', 'archived'] as const).map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="status"
                        checked={status === s}
                        onChange={() => setStatus(s)}
                      />
                      <span className="capitalize">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-foreground/60">Category</div>
                <div className="mt-3 grid gap-2">
                  {categories.map((c) => (
                    <label key={c.slug} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(c.slug)}
                        onChange={() => toggleCategory(c.slug)}
                      />
                      {c.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-foreground/60">Energy rating</div>
                <div className="mt-3">
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={minEnergy}
                    onChange={(e) => setMinEnergy(Number(e.target.value))}
                    className="w-full"
                    aria-label="Minimum energy rating"
                  />
                  <div className="mt-2 flex items-center gap-1 text-sm text-foreground/70">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={
                          'h-4 w-4 ' + (i + 1 <= minEnergy ? 'fill-accent text-accent' : 'fill-transparent text-foreground/30')
                        }
                        aria-hidden
                      />
                    ))}
                    <span className="ml-2 text-xs">{minEnergy}★+</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-foreground/60">Price range</div>
                <div className="mt-3 space-y-3">
                  <div>
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full"
                      aria-label="Minimum price"
                    />
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full"
                      aria-label="Maximum price"
                    />
                  </div>
                  <div className="text-xs text-foreground/70">
                    {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setStatus('all')
                  setSelectedCategories(new Set())
                  setMinEnergy(1)
                  setPriceRange([minPrice, maxPrice])
                  setSort('newest')
                }}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-background text-sm font-medium ring-1 ring-foreground/10 transition hover:bg-foreground/5"
              >
                Reset filters
              </button>
            </div>
          </details>
        </aside>

        <div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={filtered.map((p) => p.id).join(',')}
              className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
              variants={staggerContainer(0.1)}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              {filtered.map((p) => (
                <motion.li key={p.id} variants={fadeInUp} className="h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card shadow-sm shadow-foreground/5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/10">
                    <div className="relative aspect-[4/3] bg-background">
                      <Image
                        src={p.imageSrc}
                        alt={p.productName}
                        fill
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE1IiBmaWxsPSJyZ2JhKDIyMiw0MCwxMiwwLjA4KSIvPjwvc3ZnPg=="
                        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">{p.productName}</div>
                          <div className="mt-1 font-mono text-xs text-foreground/60">{p.modelNumber}</div>
                        </div>
                        <div className="text-right text-sm font-semibold text-primary">{formatPrice(p.price)}</div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-foreground/70">
                        <div className="rounded-full bg-background px-3 py-1 ring-1 ring-foreground/10">
                          {p.capacity.toFixed(1)} kW
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={
                                'h-3.5 w-3.5 ' +
                                (i + 1 <= p.energyRating
                                  ? 'fill-accent text-accent'
                                  : 'fill-transparent text-foreground/30')
                              }
                              aria-hidden
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mt-5">
                        <Link
                          href={`/products/${encodeURIComponent(p.modelNumber)}`}
                          data-cursor="VIEW"
                          className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-95"
                        >
                          View details
                          <motion.span
                            initial={false}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.25, ease: EASE_OUT }}
                            aria-hidden
                          >
                            →
                          </motion.span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>

          {!filtered.length ? (
            <div className="mt-10 rounded-3xl border border-foreground/10 bg-card p-8 text-center text-sm text-foreground/70">
              No products match your filters.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}
