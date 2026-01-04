import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Aircon — Premium Air Conditioning
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg text-foreground/80">
          Phase 1 scaffold: Next.js App Router + Tailwind design tokens + Payload CMS collections +
          Prisma schema + Auth.js.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link className="btn" href="/products">
            Browse products
          </Link>
          <Link className="btn btn-secondary" href="/admin">
            Admin
          </Link>
        </div>
      </div>
    </main>
  )
}
