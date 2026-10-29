import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { ResolvedTheme } from '@/shared/lib'

import { ThemeToggle } from './theme-toggle'

function ControlledThemeToggle({
  onToggle,
}: {
  onToggle?: (theme: ResolvedTheme) => void
}) {
  const [theme, setTheme] = useState<ResolvedTheme>('light')
  return (
    <ThemeToggle
      theme={theme}
      onToggle={() => {
        const next = theme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        onToggle?.(next)
      }}
    />
  )
}

describe('ThemeToggle', () => {
  it('switches between light and dark on click', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<ControlledThemeToggle onToggle={onToggle} />)

    await user.click(
      screen.getByRole('button', { name: 'Включить тёмную тему' }),
    )
    expect(onToggle).toHaveBeenLastCalledWith('dark')
    expect(
      screen.getByRole('button', { name: 'Включить светлую тему' }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Включить светлую тему' }),
    )
    expect(onToggle).toHaveBeenLastCalledWith('light')
  })
})
