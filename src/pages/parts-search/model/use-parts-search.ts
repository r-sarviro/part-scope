import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

import {
  useManufacturersQuery,
  usePartOffersQuery,
  type OfferSort,
  type OfferSortKey,
  type PartOfferRow,
} from '@/entities/part'
import {
  parseSearchQuery,
  useSearchNavigation,
} from '@/features/search-parts'
import { isAbortError } from '@/shared/api'

import { getSearchErrorMessage, logSearchError } from './search-errors'

export type OffersViewState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string; onRetry: () => void }
  | { status: 'empty' }
  | {
      status: 'results'
      offers: PartOfferRow[]
      sort: OfferSort | null
      page: number
    }

export function usePartsSearch() {
  const location = useLocation()
  const query = parseSearchQuery(location.search)
  const { submitArticle, selectBrand, clearBrand, changeSort, changePage } =
    useSearchNavigation()
  const [draftArticle, setDraftArticle] = useState(query.number)
  const [seenArticle, setSeenArticle] = useState(query.number)

  if (seenArticle !== query.number) {
    setSeenArticle(query.number)
    setDraftArticle(query.number)
  }

  const manufacturersQuery = useManufacturersQuery(query.number)
  const offersQuery = usePartOffersQuery(query.number, query.brand)
  const manufacturers = manufacturersQuery.data ?? []
  const offers = offersQuery.data ?? []

  useEffect(() => {
    if (manufacturersQuery.isError) {
      logSearchError(manufacturersQuery.error)
    }
  }, [manufacturersQuery.isError, manufacturersQuery.error])

  useEffect(() => {
    if (offersQuery.isError) {
      logSearchError(offersQuery.error)
    }
  }, [offersQuery.isError, offersQuery.error])

  useEffect(() => {
    if (!manufacturersQuery.isSuccess || !query.brand) {
      return
    }
    const list = manufacturersQuery.data ?? []
    if (!list.includes(query.brand)) {
      clearBrand(query.number)
    }
  }, [
    clearBrand,
    manufacturersQuery.data,
    manufacturersQuery.isSuccess,
    query.brand,
    query.number,
  ])

  const hasSubmitted = query.number.length > 0
  const manufacturersLoading =
    hasSubmitted &&
    (manufacturersQuery.isPending ||
      (manufacturersQuery.isFetching &&
        manufacturers.length === 0 &&
        !manufacturersQuery.isError))
  const manufacturersFailed =
    manufacturersQuery.isError && !isAbortError(manufacturersQuery.error)
  const showWorkspace =
    hasSubmitted &&
    !manufacturersLoading &&
    !manufacturersFailed &&
    manufacturers.length > 0

  const offersEnabled = Boolean(query.brand)
  const offersLoading =
    offersEnabled &&
    (offersQuery.isPending ||
      (offersQuery.isFetching && offers.length === 0 && !offersQuery.isError))
  const offersFailed =
    offersEnabled && offersQuery.isError && !isAbortError(offersQuery.error)
  const busy = manufacturersLoading || offersLoading

  const sort: OfferSort | null = query.sort
    ? { key: query.sort as OfferSortKey, direction: query.dir ?? 'asc' }
    : null

  let offersView: OffersViewState = { status: 'idle' }
  if (offersEnabled) {
    if (offersLoading) {
      offersView = { status: 'loading' }
    } else if (offersFailed) {
      offersView = {
        status: 'error',
        message: getSearchErrorMessage(offersQuery.error),
        onRetry: () => {
          void offersQuery.refetch()
        },
      }
    } else if (offers.length === 0) {
      offersView = { status: 'empty' }
    } else {
      offersView = {
        status: 'results',
        offers,
        sort,
        page: query.page,
      }
    }
  }

  return {
    query,
    draftArticle,
    setDraftArticle,
    manufacturers,
    manufacturersLoading,
    manufacturersFailed,
    manufacturersErrorMessage: getSearchErrorMessage(manufacturersQuery.error),
    refetchManufacturers: () => {
      void manufacturersQuery.refetch()
    },
    busy,
    showWorkspace,
    hasSubmitted,
    offersView,
    submitArticle,
    selectBrand: (brand: string) => {
      selectBrand(query.number, brand)
    },
    changeSort: (nextSort: OfferSort | null) => {
      changeSort(query, nextSort)
    },
    changePage: (page: number) => {
      changePage(query, page)
    },
  }
}
