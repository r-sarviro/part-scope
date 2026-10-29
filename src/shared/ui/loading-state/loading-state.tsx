import type { HTMLAttributes, ReactNode } from 'react'

import { Spinner } from '../spinner'

import styles from './loading-state.module.css'

export type LoadingStateProps = {
  label?: ReactNode
} & HTMLAttributes<HTMLDivElement>

export function LoadingState({
  label = 'Загрузка…',
  className,
  ...rest
}: LoadingStateProps) {
  const classes = [styles.root, className].filter(Boolean).join(' ')

  return (
    <div className={classes} role="status" aria-busy="true" {...rest}>
      <Spinner size="lg" label="Загрузка" />
      <p className={styles.label}>{label}</p>
    </div>
  )
}
