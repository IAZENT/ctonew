export function auditAfterChange(collection: string) {
  return async ({ req, doc, operation }: any) => {
    const actor = req.user?.email ?? 'anonymous'
    const id = doc?.id ?? 'unknown'
    console.info(`[audit] ${operation} ${collection}#${id} by ${actor}`)
    return doc
  }
}
