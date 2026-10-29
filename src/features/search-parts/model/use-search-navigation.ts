import { useCallback } from 'react'
import { useNavigate } from 'react-router'

import type { OfferSort } from '@/entities/part'

import { buildSearchPath, type SearchQuery } from './search-query'

export function useSearchNavigation() {
  const navigate = useNavigate()

  const submitArticle = useCallback(
    (article: string) => {
      const next = article.trim()
      if (!next) {
        return
      }
      navigate(buildSearchPath({ number: next }))
    },
    [navigate],
  )

  const selectBrand = useCallback(
    (article: string, brand: string) => {
      navigate(buildSearchPath({ number: article, brand }), { replace: true })
    },
    [navigate],
  )

  const clearBrand = useCallback(
    (article: string) => {
      navigate(buildSearchPath({ number: article }), { replace: true })
    },
    [navigate],
  )

  const changeSort = useCallback(
    (query: SearchQuery, sort: OfferSort | null) => {
      navigate(
        buildSearchPath({
          number: query.number,
          brand: query.brand,
          sort: sort?.key ?? null,
          dir: sort?.direction ?? null,
        }),
        { replace: true },
      )
    },
    [navigate],
  )

  const changePage = useCallback(
    (query: SearchQuery, page: number) => {
      navigate(
        buildSearchPath({
          number: query.number,
          brand: query.brand,
          sort: query.sort,
          dir: query.dir,
          page,
        }),
        { replace: true },
      )
    },
    [navigate],
  )

  return {
    submitArticle,
    selectBrand,
    clearBrand,
    changeSort,
    changePage,
  }
}
