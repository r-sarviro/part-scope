import { formatPrice } from '@/shared/lib'

import styles from './price.module.css'

export type PriceProps = {
  value: number | null
  className?: string
  /** Показать значение целиком с переносом вместо однострочного ellipsis. */
  wrap?: boolean
}

export function Price({ value, className, wrap = false }: PriceProps) {
  const classes = [styles.price, wrap ? styles.wrap : null, 'tabular-nums', className]
    .filter(Boolean)
    .join(' ')

  if (value === null) {
    return (
      <span className={classes} title="Нет данных">
        Нет данных
      </span>
    )
  }

  const label = formatPrice(value)
  return (
    <span className={classes} title={label}>
      {label}
    </span>
  )
}
