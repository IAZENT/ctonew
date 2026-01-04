type RateLimitOptions = {
  limit: number
  windowMs: number
}

type Entry = {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

export function checkRateLimit(key: string, { limit, windowMs }: RateLimitOptions) {
  const now = Date.now()
  const current = store.get(key)

  if (!current || now > current.resetAt) {
    const entry: Entry = { count: 1, resetAt: now + windowMs }
    store.set(key, entry)
    return { ok: true, remaining: limit - 1, resetAt: entry.resetAt }
  }

  if (current.count >= limit) {
    return { ok: false, remaining: 0, resetAt: current.resetAt }
  }

  current.count += 1
  store.set(key, current)
  return { ok: true, remaining: limit - current.count, resetAt: current.resetAt }
}
