import styles from './stock-quantity.module.css'

export type StockQuantityProps = {
  value: number | null
  className?: string
  /** Показать значение целиком с переносом вместо однострочного ellipsis. */
  wrap?: boolean
}

export function StockQuantity({
  value,
  className,
  wrap = false,
}: StockQuantityProps) {
  const classes = [styles.root, wrap ? styles.wrap : null, className]
    .filter(Boolean)
    .join(' ')

  if (value === null) {
    return (
      <span className={classes} title="Нет данных">
        Нет данных
      </span>
    )
  }

  const label = `${value} шт.`
  return (
    <span className={[classes, 'tabular-nums'].join(' ')} title={label}>
      {label}
    </span>
  )
}
