import type { PartOfferRow } from '@/entities/part'
import { selectFromKeyboard } from '@/shared/lib'
import { Card } from '@/shared/ui'

import { Price } from './price'
import styles from './product-offer-card.module.css'
import { StockQuantity } from './stock-quantity'

export type ProductOfferCardProps = {
  offer: PartOfferRow
  className?: string
  onSelect?: (offer: PartOfferRow) => void
}

export function ProductOfferCard({
  offer,
  className,
  onSelect,
}: ProductOfferCardProps) {
  const selectable = Boolean(onSelect)

  return (
    <Card
      className={[styles.card, selectable ? styles.selectable : null, className]
        .filter(Boolean)
        .join(' ')}
      role={selectable ? 'button' : undefined}
      tabIndex={selectable ? 0 : undefined}
      onClick={onSelect ? () => onSelect(offer) : undefined}
      onKeyDown={
        onSelect
          ? (event) => selectFromKeyboard(event, () => onSelect(offer))
          : undefined
      }
    >
      <h3 className={styles.name} title={offer.name}>
        {offer.name}
      </h3>
      <p className={styles.meta}>
        <span className={styles.metaItem} title={offer.brand}>
          {offer.brand}
        </span>
        <span aria-hidden="true">·</span>
        <span
          className={['tabular-nums', styles.article, styles.metaItem].join(
            ' ',
          )}
          title={offer.number}
        >
          {offer.number}
        </span>
      </p>
      <div className={styles.priceRow}>
        <Price value={offer.price} className={styles.price} />
      </div>
      <div className={styles.stockRow}>
        <StockQuantity value={offer.stock} className={styles.stock} />
      </div>
      {offer.warehouseCode ? (
        <p className={styles.warehouse} title={offer.warehouseCode}>
          Склад: {offer.warehouseCode}
        </p>
      ) : null}
    </Card>
  )
}
