import type { HTMLAttributes, ReactNode } from 'react'

import styles from './empty-state.module.css'

export type EmptyStateVariant = 'panel' | 'inline'

export type EmptyStateProps = {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  variant?: EmptyStateVariant
} & HTMLAttributes<HTMLDivElement>

export function EmptyState({
  title,
  description,
  icon,
  action,
  variant = 'panel',
  className,
  ...rest
}: EmptyStateProps) {
  const classes = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} role="status" {...rest}>
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <div className={styles.copy}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  )
}
