import { Moon, Sun } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

import type { ResolvedTheme } from '@/shared/lib'

import styles from './theme-toggle.module.css'

export type ThemeToggleProps = {
  theme: ResolvedTheme
  onToggle: () => void
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'>

export function ThemeToggle({
  theme,
  onToggle,
  className,
  type = 'button',
  ...rest
}: ThemeToggleProps) {
  const isDark = theme === 'dark'
  const Icon = isDark ? Sun : Moon
  const classes = [styles.trigger, className].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      onClick={onToggle}
      {...rest}
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  )
}
