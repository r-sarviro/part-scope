import type { HTMLAttributes, ReactNode } from 'react'

import styles from './card.module.css'

export type CardVariant = 'default' | 'subtle' | 'interactive'

export type CardProps = {
  variant?: CardVariant
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

const variantClass: Record<CardVariant, string | undefined> = {
  default: undefined,
  subtle: styles.subtle,
  interactive: styles.interactive,
}

export function Card({
  variant = 'default',
  className,
  children,
  ...rest
}: CardProps) {
  const classes = [styles.card, variantClass[variant], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}
