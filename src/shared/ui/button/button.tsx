import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { Spinner } from '../spinner'

import styles from './button.module.css'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'icon'

export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children?: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const variantClass: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  danger: styles.danger,
  icon: styles.icon,
}

const sizeClass: Record<ButtonSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading
  const classes = [
    styles.button,
    variantClass[variant],
    sizeClass[size],
    loading ? styles.loading : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Spinner
          size={size === 'lg' ? 'md' : 'sm'}
          decorative
          className={styles.spinner}
        />
      ) : null}
      <span className={loading ? styles.contentLoading : undefined}>
        {children}
      </span>
    </button>
  )
}
