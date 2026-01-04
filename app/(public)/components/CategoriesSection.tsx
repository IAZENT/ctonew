'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import { fadeInUp, staggerContainer } from '@/lib/animations/framer-utils'

type Category = {
  slug: string
  name: string
  count: number
  imageSrc: string
}

const categories: Category[] = [
  { slug: 'wall-mounted', name: 'Wall Mounted', count: 12, imageSrc: '/images/category-wall.svg' },
  { slug: 'ducted', name: 'Ducted Systems', count: 8, imageSrc: '/images/category-ducted.svg' },
  { slug: 'portable', name: 'Portable Units', count: 6, imageSrc: '/images/category-portable.svg' },
  { slug: 'commercial', name: 'Commercial', count: 9, imageSrc: '/images/category-commercial.svg' },
  { slug: 'multi-split', name: 'Multi-Split', count: 5, imageSrc: '/images/category-multisplit.svg' },
  { slug: 'smart', name: 'Smart Series', count: 7, imageSrc: '/images/category-smart.svg' },
]

export function CategoriesSection() {
  const router = useRouter()

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Categories</h2>
            <p className="mt-2 max-w-2xl text-sm text-foreground/70">
              Explore premium units designed for every space — from compact apartments to large-scale
              commercial projects.
            </p>
          </div>
        </div>

        <motion.ul
          className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.2, once: true }}
        >
          {categories.map((cat) => (
            <motion.li key={cat.slug} variants={fadeInUp}>
              <button
                type="button"
                onClick={() => router.push(`/products?category=${encodeURIComponent(cat.slug)}`)}
                className="group relative block w-full overflow-hidden rounded-[2.2rem] border border-foreground/10 bg-card text-left shadow-lg shadow-foreground/5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="absolute right-5 top-5 z-10 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-foreground/70 ring-1 ring-foreground/10">
                  {cat.count} items
                </div>

                <div className="relative aspect-[4/3]">
                  <Image
                    src={cat.imageSrc}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="text-2xl font-semibold tracking-tight text-white transition-transform duration-500 group-hover:scale-[1.05]">
                      {cat.name}
                    </div>
                  </div>
                </div>
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
