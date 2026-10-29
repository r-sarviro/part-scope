import type { PartOfferRow } from '@/entities/part'
import { Badge, Modal } from '@/shared/ui'

import { Price } from './price'
import styles from './offer-detail-modal.module.css'
import { StockQuantity } from './stock-quantity'

export type OfferDetailModalProps = {
  offer: PartOfferRow | null
  onClose: () => void
}

export function OfferDetailModal({ offer, onClose }: OfferDetailModalProps) {
  return (
    <Modal open={offer !== null} title="Предложение" onClose={onClose}>
      {offer ? <OfferDetailContent offer={offer} /> : null}
    </Modal>
  )
}

function OfferDetailContent({ offer }: { offer: PartOfferRow }) {
  return (
    <div className={styles.content}>
      <dl className={styles.facts}>
        <Fact label="Наименование" value={offer.name} />
        <Fact label="Артикул" value={offer.number} numeric />
        <Fact label="Производитель" value={offer.brand} />
        <div className={styles.fact}>
          <dt>Цена</dt>
          <dd>
            <Price value={offer.price} wrap />
          </dd>
        </div>
        <div className={styles.fact}>
          <dt>Остаток</dt>
          <dd>
            <StockQuantity value={offer.stock} wrap />
          </dd>
        </div>
        <Fact label="Склад" value={offer.warehouseCode || 'Нет данных'} />
      </dl>

      {offer.notRefund ? (
        <section className={styles.section} aria-label="Условия возврата">
          <Badge variant="warning">Невозвратная позиция</Badge>
          <p className={styles.explanation}>
            Эту позицию нельзя вернуть после покупки.
          </p>
        </section>
      ) : null}

      <section className={styles.section} aria-label="Тип детали">
        {offer.isAnalogue ? (
          <>
            <Badge variant="info">Аналог</Badge>
            <p className={styles.explanation}>
              Совместимая замена для выбранной детали. Артикул и производитель
              могут отличаться от исходного запроса.
            </p>
          </>
        ) : (
          <>
            <Badge variant="neutral">Исходная деталь</Badge>
            <p className={styles.explanation}>
              Предложение по детали выбранного производителя, а не по замене.
            </p>
          </>
        )}
      </section>
    </div>
  )
}

function Fact({
  label,
  value,
  numeric = false,
}: {
  label: string
  value: string
  numeric?: boolean
}) {
  return (
    <div className={styles.fact}>
      <dt>{label}</dt>
      <dd
        className={[styles.value, numeric ? 'tabular-nums' : null]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </dd>
    </div>
  )
}
