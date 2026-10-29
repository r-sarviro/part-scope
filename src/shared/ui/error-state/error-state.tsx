import { CircleAlert } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'

import { Button } from '../button'

import styles from './error-state.module.css'

export type ErrorStateProps = {
  title: ReactNode
  description?: ReactNode
  onRetry?: () => void
  retryLabel?: string
  action?: ReactNode
} & HTMLAttributes<HTMLDivElement>

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = 'Повторить',
  action,
  className,
  ...rest
}: ErrorStateProps) {
  const classes = [styles.root, className].filter(Boolean).join(' ')

  return (
    <div className={classes} role="alert" {...rest}>
      <div className={styles.icon}>
        <CircleAlert size={18} aria-hidden="true" />
      </div>
      <div className={styles.copy}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {action ??
        (onRetry ? (
          <div className={styles.action}>
            <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
              {retryLabel}
            </Button>
          </div>
        ) : null)}
    </div>
  )
}
