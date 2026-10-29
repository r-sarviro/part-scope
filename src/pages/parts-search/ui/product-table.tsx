import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

import type { OfferSort, OfferSortKey, PartOfferRow } from '@/entities/part'
import { selectFromKeyboard } from '@/shared/lib'

import { Price } from './price'
import styles from './product-table.module.css'
import { StockQuantity } from './stock-quantity'

export type ProductTableProps = {
  rows: PartOfferRow[]
  className?: string
  caption?: string
  sort?: OfferSort | null
  onSort?: (key: OfferSortKey) => void
  onSelect?: (row: PartOfferRow) => void
}

const COLUMNS: Array<{
  key: OfferSortKey
  label: string
  numeric?: boolean
  warehouse?: boolean
}> = [
  { key: 'number', label: 'Артикул' },
  { key: 'name', label: 'Наименование' },
  { key: 'brand', label: 'Производитель' },
  { key: 'price', label: 'Цена', numeric: true },
  { key: 'stock', label: 'Остаток', numeric: true },
  { key: 'warehouseCode', label: 'Склад', warehouse: true },
]

export function ProductTable({
  rows,
  className,
  caption = 'Предложения по запчастям',
  sort = null,
  onSort,
  onSelect,
}: ProductTableProps) {
  const includeWarehouse = rows.some((row) => Boolean(row.warehouseCode))
  const columns = COLUMNS.filter((column) =>
    column.warehouse ? includeWarehouse : true,
  )

  const classes = [styles.wrap, className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <table className={styles.table}>
        <caption className="visually-hidden">{caption}</caption>
        <colgroup>
          {columns.map((column) => (
            <col key={column.key} className={columnClass(column.key)} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => {
              const active = sort?.key === column.key
              const ariaSort = active
                ? sort.direction === 'asc'
                  ? 'ascending'
                  : 'descending'
                : 'none'
              return (
                <th
                  key={column.key}
                  scope="col"
                  className={column.numeric ? styles.numeric : undefined}
                  aria-sort={onSort ? ariaSort : undefined}
                >
                  {onSort ? (
                    <button
                      type="button"
                      className={[
                        styles.sortButton,
                        column.numeric ? styles.sortNumeric : null,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => onSort(column.key)}
                    >
                      {column.label}
                      <SortMark
                        active={active}
                        direction={active ? sort.direction : null}
                      />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.rowId}
              className={onSelect ? styles.selectable : undefined}
              tabIndex={onSelect ? 0 : undefined}
              role={onSelect ? 'button' : undefined}
              onClick={onSelect ? () => onSelect(row) : undefined}
              onKeyDown={
                onSelect ? (event) => selectFromKeyboard(event, () => onSelect(row)) : undefined
              }
            >
              <td className={styles.article} title={row.number}>
                <span className={[styles.cellText, 'tabular-nums'].join(' ')}>
                  {row.number}
                </span>
              </td>
              <td className={styles.name} title={row.name}>
                <span className={styles.nameText}>{row.name}</span>
              </td>
              <td className={styles.brand} title={row.brand}>
                <span className={styles.cellText}>{row.brand}</span>
              </td>
              <td className={styles.numeric}>
                <Price value={row.price} />
              </td>
              <td className={styles.numeric}>
                <StockQuantity value={row.stock} className={styles.stock} />
              </td>
              {includeWarehouse ? (
                <td
                  className={styles.warehouse}
                  title={row.warehouseCode || undefined}
                >
                  <span className={[styles.cellText, 'tabular-nums'].join(' ')}>
                    {row.warehouseCode || '—'}
                  </span>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function columnClass(key: OfferSortKey) {
  if (key === 'number') return styles.colArticle
  if (key === 'name') return styles.colName
  if (key === 'brand') return styles.colBrand
  if (key === 'price') return styles.colPrice
  if (key === 'stock') return styles.colStock
  return styles.colWarehouse
}

function SortMark({
  active,
  direction,
}: {
  active: boolean
  direction: 'asc' | 'desc' | null
}) {
  const Icon = !active ? ArrowUpDown : direction === 'asc' ? ArrowUp : ArrowDown
  return <Icon size={14} aria-hidden="true" className={styles.sortIcon} />
}
