import type { HTMLAttributes } from 'react'

import { ManufacturerOption } from './manufacturer-option'
import styles from './manufacturer-list.module.css'

export type ManufacturerListProps = {
  manufacturers: string[]
  selectedBrand?: string | null
  onSelect: (brand: string) => void
  label?: string
  showHeading?: boolean
} & Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'>

export function ManufacturerList({
  manufacturers,
  selectedBrand = null,
  onSelect,
  label = 'Выберите производителя',
  showHeading = true,
  className,
  ...rest
}: ManufacturerListProps) {
  const classes = [styles.list, className].filter(Boolean).join(' ')

  return (
    <div className={classes} role="group" aria-label={label} {...rest}>
      {showHeading ? <h2 className={styles.heading}>{label}</h2> : null}
      <ul className={styles.items}>
        {manufacturers.map((brand) => (
          <li key={brand} className={styles.item}>
            <ManufacturerOption
              brand={brand}
              selected={selectedBrand === brand}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
