import { useQuery } from '@tanstack/react-query'

import { isApiError } from '@/shared/api'

import { extractManufacturers } from '../model/extract-manufacturers'
import { normalizePartOffers } from '../model/normalize-part-offers'

import { fetchManufacturersByArticle, fetchPartOffers } from './parts-api'
import { partQueryKeys } from './parts-query-keys'

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (isApiError(error)) {
    return false
  }
  return failureCount < 1
}

export function useManufacturersQuery(article: string) {
  const trimmed = article.trim()

  return useQuery({
    queryKey: partQueryKeys.manufacturers(trimmed),
    queryFn: async ({ signal }) => {
      const payload = await fetchManufacturersByArticle(trimmed, signal)
      return extractManufacturers(payload)
    },
    enabled: trimmed.length > 0,
    retry: shouldRetry,
  })
}

export function usePartOffersQuery(article: string, brand: string | null) {
  const trimmedArticle = article.trim()
  const trimmedBrand = brand?.trim() ?? ''

  return useQuery({
    queryKey: partQueryKeys.offers(trimmedArticle, trimmedBrand),
    queryFn: async ({ signal }) => {
      const payload = await fetchPartOffers(
        trimmedArticle,
        trimmedBrand,
        signal,
      )
      return normalizePartOffers(payload)
    },
    enabled: trimmedArticle.length > 0 && trimmedBrand.length > 0,
    retry: shouldRetry,
  })
}
