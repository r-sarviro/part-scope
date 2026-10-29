import { Loader2 } from 'lucide-react'
import type { HTMLAttributes } from 'react'

import styles from './spinner.module.css'

type SpinnerSize = 'sm' | 'md' | 'lg'

type SpinnerProps = {
  size?: SpinnerSize
  label?: string
  /** Декоративный спиннер внутри контрола, у которого уже есть busy-состояние. */
  decorative?: boolean
} & HTMLAttributes<HTMLSpanElement>

const sizeClass: Record<SpinnerSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
}

const sizePx: Record<SpinnerSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
}

export function Spinner({
  size = 'md',
  label = 'Загрузка',
  decorative = false,
  className,
  ...rest
}: SpinnerProps) {
  const classes = [styles.spinner, sizeClass[size], className]
    .filter(Boolean)
    .join(' ')

  const icon = (
    <Loader2
      className={styles.visual}
      size={sizePx[size]}
      strokeWidth={2}
      aria-hidden="true"
    />
  )

  if (decorative) {
    return (
      <span className={classes} aria-hidden="true" {...rest}>
        {icon}
      </span>
    )
  }

  return (
    <span className={classes} role="status" aria-live="polite" {...rest}>
      {icon}
      <span className="visually-hidden">{label}</span>
    </span>
  )
}
