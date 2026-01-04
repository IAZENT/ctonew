export default function PublicLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-2xl bg-primary/30" aria-hidden />
        <div className="h-4 w-40 animate-pulse rounded bg-foreground/10" aria-hidden />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse rounded-[2.5rem] bg-foreground/10" aria-hidden />
        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded bg-foreground/10" aria-hidden />
          <div className="h-4 w-full animate-pulse rounded bg-foreground/10" aria-hidden />
          <div className="h-4 w-11/12 animate-pulse rounded bg-foreground/10" aria-hidden />
          <div className="h-4 w-10/12 animate-pulse rounded bg-foreground/10" aria-hidden />
          <div className="mt-6 h-12 w-48 animate-pulse rounded-2xl bg-primary/25" aria-hidden />
        </div>
      </div>
    </main>
  )
}
