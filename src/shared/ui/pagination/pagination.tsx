import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '../button'

import { pageItems } from './page-items'
import styles from './pagination.module.css'

export type PaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  from: number
  to: number
  total: number
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  from,
  to,
  total,
}: PaginationProps) {
  const safePage = Math.min(Math.max(page, 1), pageCount)
  const items = pageItems(safePage, pageCount)

  return (
    <nav className={styles.root} aria-label="Страницы">
      <p className={styles.range}>
        {from}–{to} из {total}
      </p>
      <div className={styles.controls}>
        <Button
          type="button"
          variant="icon"
          size="sm"
          aria-label="Назад"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </Button>
        <ol className={styles.pages}>
          {items.map((item, index) =>
            item === 'gap' ? (
              <li key={`gap-${index}`} className={styles.gap} aria-hidden="true">
                …
              </li>
            ) : (
              <li key={item}>
                <Button
                  type="button"
                  variant={item === safePage ? 'secondary' : 'ghost'}
                  size="sm"
                  className={styles.page}
                  aria-label={`Страница ${item}`}
                  aria-current={item === safePage ? 'page' : undefined}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </Button>
              </li>
            ),
          )}
        </ol>
        <Button
          type="button"
          variant="icon"
          size="sm"
          aria-label="Дальше"
          disabled={safePage >= pageCount}
          onClick={() => onPageChange(safePage + 1)}
        >
          <ChevronRight size={16} aria-hidden="true" />
        </Button>
      </div>
    </nav>
  )
}
