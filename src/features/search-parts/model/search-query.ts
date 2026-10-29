import { isOfferSortKey, type OfferSortKey } from '@/entities/part'

export type SearchQuery = {
  number: string
  brand: string | null
  sort: OfferSortKey | null
  dir: 'asc' | 'desc' | null
  page: number
}

export function parseSearchQuery(search: string): SearchQuery {
  const params = new URLSearchParams(search)
  const number = params.get('number')?.trim() ?? ''
  const brand = params.get('brand')?.trim() || null
  const sortRaw = params.get('sort')
  const sort = sortRaw && isOfferSortKey(sortRaw) ? sortRaw : null
  const dir: SearchQuery['dir'] =
    sort && params.get('dir') === 'desc' ? 'desc' : sort ? 'asc' : null
  const pageRaw = Number(params.get('page'))
  const page = Number.isInteger(pageRaw) && pageRaw > 1 ? pageRaw : 1

  return { number, brand, sort, dir, page }
}

export function buildSearchPath(query: {
  number: string
  brand?: string | null
  sort?: string | null
  dir?: 'asc' | 'desc' | null
  page?: number | null
}) {
  const params = new URLSearchParams()
  params.set('number', query.number)
  if (query.brand) {
    params.set('brand', query.brand)
  }
  if (query.sort && isOfferSortKey(query.sort)) {
    params.set('sort', query.sort)
    params.set('dir', query.dir === 'desc' ? 'desc' : 'asc')
  }
  if (query.page && query.page > 1) {
    params.set('page', String(query.page))
  }
  return `/search?${params.toString()}`
}
