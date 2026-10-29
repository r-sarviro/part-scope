export const OFFER_PAGE_SIZE = 15

export function paginateItems<T>(items: T[], page: number, pageSize = OFFER_PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(Math.max(page, 1), pageCount)
  const start = (safePage - 1) * pageSize
  return {
    pageCount,
    safePage,
    start,
    pageItems: items.slice(start, start + pageSize),
  }
}
