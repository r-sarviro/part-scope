import { useTheme } from '@/shared/lib'
import { ThemeToggle } from '@/shared/ui'

export type ThemeSwitcherProps = {
  className?: string
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { resolvedTheme, setMode } = useTheme()

  return (
    <ThemeToggle
      theme={resolvedTheme}
      onToggle={() => setMode(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={className}
    />
  )
}
