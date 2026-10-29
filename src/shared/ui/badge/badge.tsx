import type { HTMLAttributes, ReactNode } from 'react'

import styles from './badge.module.css'

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'

export type BadgeProps = {
  variant?: BadgeVariant
  children: ReactNode
} & HTMLAttributes<HTMLSpanElement>

const variantClass: Record<BadgeVariant, string> = {
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
  info: styles.info,
  neutral: styles.neutral,
}

export function Badge({
  variant = 'neutral',
  className,
  children,
  ...rest
}: BadgeProps) {
  const classes = [styles.badge, variantClass[variant], className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  )
}
