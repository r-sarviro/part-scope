const MAX_VISIBLE_PAGES = 5

export function pageItems(
  page: number,
  pageCount: number,
): Array<number | 'gap'> {
  if (pageCount <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  if (page <= 3) {
    return [1, 2, 3, 4, 'gap', pageCount]
  }

  if (page >= pageCount - 2) {
    return [1, 'gap', pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
  }

  return [1, 'gap', page - 1, page, page + 1, 'gap', pageCount]
}
