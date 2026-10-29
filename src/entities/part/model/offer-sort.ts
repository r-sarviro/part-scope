import type { PartOfferRow } from './types'

export type OfferSortKey =
  | 'number'
  | 'name'
  | 'brand'
  | 'price'
  | 'stock'
  | 'warehouseCode'

const OFFER_SORT_KEYS = [
  'number',
  'name',
  'brand',
  'price',
  'stock',
  'warehouseCode',
] as const satisfies readonly OfferSortKey[]

export type OfferSort = {
  key: OfferSortKey
  direction: 'asc' | 'desc'
}

export function isOfferSortKey(value: string): value is OfferSortKey {
  return (OFFER_SORT_KEYS as readonly string[]).includes(value)
}

export function nextOfferSort(
  current: OfferSort | null,
  key: OfferSortKey,
): OfferSort | null {
  if (current?.key !== key) {
    return { key, direction: 'asc' }
  }
  if (current.direction === 'asc') {
    return { key, direction: 'desc' }
  }
  return null
}

function comparePartOffers(
  left: PartOfferRow,
  right: PartOfferRow,
  sort: OfferSort,
): number {
  if (sort.key === 'price' || sort.key === 'stock') {
    const leftValue = left[sort.key]
    const rightValue = right[sort.key]
    if (leftValue === null && rightValue === null) {
      return 0
    }
    if (leftValue === null) {
      return 1
    }
    if (rightValue === null) {
      return -1
    }
    const difference = leftValue - rightValue
    return sort.direction === 'asc' ? difference : -difference
  }

  const result = left[sort.key].localeCompare(right[sort.key], 'ru', {
    numeric: true,
    sensitivity: 'base',
  })
  return sort.direction === 'asc' ? result : -result
}

export function sortPartOffers(
  rows: PartOfferRow[],
  sort: OfferSort | null,
): PartOfferRow[] {
  if (!sort) {
    return rows
  }
  const copy = [...rows]
  copy.sort((left, right) => comparePartOffers(left, right, sort))
  return copy
}
