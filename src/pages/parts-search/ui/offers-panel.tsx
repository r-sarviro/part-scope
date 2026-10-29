import { MousePointerClick, PackageSearch } from 'lucide-react'

import type { OfferSort } from '@/entities/part'
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui'

import { offerCountLabel } from '../lib/offer-count-label'
import type { OffersViewState } from '../model/use-parts-search'

import { OfferResults } from './offer-results'
import styles from './offers-panel.module.css'

type OffersPanelProps = {
  article: string
  selectedBrand: string | null
  view: OffersViewState
  onSortChange: (sort: OfferSort | null) => void
  onPageChange: (page: number) => void
}

export function OffersPanel({
  article,
  selectedBrand,
  view,
  onSortChange,
  onPageChange,
}: OffersPanelProps) {
  return (
    <div className={styles.results}>
      {!selectedBrand || view.status === 'idle' ? (
        <EmptyState
          title="Выберите производителя"
          description="После выбора бренда появятся предложения и аналоги."
          icon={<MousePointerClick size={18} aria-hidden="true" />}
        />
      ) : (
        <>
          <div className={styles.panelHead}>
            <h2 id="offers-heading" className={styles.panelTitle}>
              Найденные детали и аналоги
            </h2>
          </div>
          <p className={styles.context}>
            <span>
              Артикул <strong className="tabular-nums">{article}</strong>
            </span>
            <span className={styles.dot} aria-hidden="true" />
            <span>
              Производитель <strong>{selectedBrand}</strong>
            </span>
            {view.status === 'results' ? (
              <>
                <span className={styles.dot} aria-hidden="true" />
                <span>
                  <strong className="tabular-nums">{view.offers.length}</strong>{' '}
                  {offerCountLabel(view.offers.length)}
                </span>
              </>
            ) : null}
          </p>
          {view.status === 'loading' ? (
            <div className={styles.statusInset}>
              <LoadingState label="Загрузка" />
            </div>
          ) : null}
          {view.status === 'error' ? (
            <div className={styles.statusInset}>
              <ErrorState
                title="Не удалось загрузить предложения"
                description={view.message}
                onRetry={view.onRetry}
              />
            </div>
          ) : null}
          {view.status === 'empty' ? (
            <EmptyState
              title="Нет складских предложений"
              description="Для выбранного производителя нет предложений со складов."
              icon={<PackageSearch size={18} aria-hidden="true" />}
            />
          ) : null}
          {view.status === 'results' ? (
            <OfferResults
              rows={view.offers}
              sort={view.sort}
              page={view.page}
              onSortChange={onSortChange}
              onPageChange={onPageChange}
            />
          ) : null}
        </>
      )}
    </div>
  )
}
