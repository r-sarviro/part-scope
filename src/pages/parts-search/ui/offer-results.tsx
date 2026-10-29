import { useMemo, useState } from 'react'

import {
  nextOfferSort,
  sortPartOffers,
  type OfferSort,
  type OfferSortKey,
  type PartOfferRow,
} from '@/entities/part'
import { Pagination } from '@/shared/ui'

import { OFFER_PAGE_SIZE, paginateItems } from '../model/paginate-offers'

import { OfferDetailModal } from './offer-detail-modal'
import styles from './offer-results.module.css'
import { ProductOfferCard } from './product-offer-card'
import { ProductTable } from './product-table'

type OfferResultsProps = {
  rows: PartOfferRow[]
  sort: OfferSort | null
  page: number
  onSortChange: (sort: OfferSort | null) => void
  onPageChange: (page: number) => void
}

export function OfferResults({
  rows,
  sort,
  page,
  onSortChange,
  onPageChange,
}: OfferResultsProps) {
  const [selectedOffer, setSelectedOffer] = useState<PartOfferRow | null>(null)
  const sorted = useMemo(() => sortPartOffers(rows, sort), [rows, sort])
  const { pageCount, safePage, start, pageItems } = paginateItems(
    sorted,
    page,
    OFFER_PAGE_SIZE,
  )

  const toggleSort = (key: OfferSortKey) => {
    onSortChange(nextOfferSort(sort, key))
  }

  return (
    <div className={styles.root}>
      <div className={styles.tableOnly}>
        <ProductTable
          rows={pageItems}
          sort={sort}
          onSort={toggleSort}
          onSelect={setSelectedOffer}
        />
      </div>
      <ul className={styles.cardsOnly}>
        {pageItems.map((offer) => (
          <li key={offer.rowId}>
            <ProductOfferCard offer={offer} onSelect={setSelectedOffer} />
          </li>
        ))}
      </ul>
      {sorted.length > OFFER_PAGE_SIZE ? (
        <Pagination
          page={safePage}
          pageCount={pageCount}
          from={start + 1}
          to={Math.min(start + OFFER_PAGE_SIZE, sorted.length)}
          total={sorted.length}
          onPageChange={onPageChange}
        />
      ) : null}
      <OfferDetailModal
        offer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
      />
    </div>
  )
}
