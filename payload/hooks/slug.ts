function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ensureSlugFromField(fieldName: string) {
  return async ({ data, operation }: any) => {
    if (!data) return data
    if (operation === 'create' || operation === 'update') {
      if (!data.slug && data[fieldName]) {
        data.slug = slugify(String(data[fieldName]))
      }
    }
    return data
  }
}
