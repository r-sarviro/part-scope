import { X } from 'lucide-react'
import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'

import { Button } from '../button'

import styles from './input.module.css'

export type InputProps = {
  label: string
  hint?: ReactNode
  error?: ReactNode
  leadingIcon?: ReactNode
  clearable?: boolean
  onClear?: () => void
  ref?: Ref<HTMLInputElement>
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>

export function Input({
  label,
  hint,
  error,
  leadingIcon,
  clearable = false,
  onClear,
  id,
  className,
  type = 'text',
  value,
  defaultValue,
  disabled,
  ref,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`
  const describedBy = [
    error ? errorId : null,
    hint && !error ? hintId : null,
  ]
    .filter(Boolean)
    .join(' ')

  const currentValue = value ?? defaultValue ?? ''
  const showClear =
    clearable && !disabled && String(currentValue).length > 0 && onClear

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <div
        className={[
          styles.control,
          error ? styles.invalid : null,
          disabled ? styles.disabled : null,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {leadingIcon ? (
          <span className={styles.leading} aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={styles.field}
          type={type}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          {...rest}
        />
        {showClear ? (
          <Button
            type="button"
            variant="icon"
            size="sm"
            className={styles.clear}
            aria-label="Очистить поле"
            onClick={onClear}
          >
            <X size={16} aria-hidden="true" />
          </Button>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {!error && hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
