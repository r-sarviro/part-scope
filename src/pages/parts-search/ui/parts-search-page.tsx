import { SearchX } from 'lucide-react'

import { ArticleSearchForm } from '@/features/search-parts'
import { Card, EmptyState, ErrorState, LoadingState } from '@/shared/ui'

import { usePartsSearch } from '../model/use-parts-search'

import { ManufacturerPanel } from './manufacturer-panel'
import { OffersPanel } from './offers-panel'
import styles from './parts-search-page.module.css'

export function PartsSearchPage() {
  const search = usePartsSearch()

  return (
    <div className={['container', styles.page].join(' ')}>
      <h1 className={styles.pageTitle}>Поиск автозапчастей</h1>
      <Card className={styles.searchCard}>
        <ArticleSearchForm
          value={search.draftArticle}
          onChange={search.setDraftArticle}
          onSubmit={search.submitArticle}
          submitDisabled={search.busy}
        />
      </Card>

      {!search.hasSubmitted ? null : search.manufacturersLoading ? (
        <Card className={styles.statusCard}>
          <LoadingState label="Загрузка" />
        </Card>
      ) : search.manufacturersFailed ? (
        <Card className={styles.statusCard}>
          <ErrorState
            title="Не удалось загрузить производителей"
            description={search.manufacturersErrorMessage}
            onRetry={search.refetchManufacturers}
          />
        </Card>
      ) : search.manufacturers.length === 0 ? (
        <Card className={styles.statusCard}>
          <EmptyState
            title="Производители не найдены"
            description="По этому артикулу нет доступных производителей."
            icon={<SearchX size={18} aria-hidden="true" />}
          />
        </Card>
      ) : (
        <div className={styles.workspace}>
          {search.showWorkspace ? (
            <ManufacturerPanel
              manufacturers={search.manufacturers}
              selectedBrand={search.query.brand}
              onSelect={search.selectBrand}
            />
          ) : null}

          <Card className={styles.panel}>
            <OffersPanel
              article={search.query.number}
              selectedBrand={search.query.brand}
              view={search.offersView}
              onSortChange={search.changeSort}
              onPageChange={search.changePage}
            />
          </Card>
        </div>
      )}
    </div>
  )
}
