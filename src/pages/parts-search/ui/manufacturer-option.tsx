import { Check } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

import { brandMonogram } from '../lib/brand-monogram'

import styles from './manufacturer-option.module.css'

export type ManufacturerOptionProps = {
  brand: string
  selected?: boolean
  onSelect?: (brand: string) => void
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect' | 'children'>

export function ManufacturerOption({
  brand,
  selected = false,
  onSelect,
  className,
  type = 'button',
  onClick,
  ...rest
}: ManufacturerOptionProps) {
  const classes = [
    styles.option,
    selected ? styles.selected : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      aria-pressed={selected}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          onSelect?.(brand)
        }
      }}
      {...rest}
    >
      <span className={styles.monogram} aria-hidden="true">
        {brandMonogram(brand)}
      </span>
      <span className={styles.brand} title={brand}>
        {brand}
      </span>
      {selected ? (
        <span className={styles.mark}>
          <Check size={14} strokeWidth={2.5} aria-hidden="true" />
          <span className="visually-hidden">Выбрано</span>
        </span>
      ) : null}
    </button>
  )
}
