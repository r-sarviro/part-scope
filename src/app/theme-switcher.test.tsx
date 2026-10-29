import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { ThemeProvider } from '@/shared/lib'

import { ThemeSwitcher } from './theme-switcher'

afterEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('ThemeSwitcher', () => {
  it('follows the system theme until the icon is clicked', async () => {
    const user = userEvent.setup()
    localStorage.clear()

    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    )

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    await user.click(
      screen.getByRole('button', { name: 'Включить тёмную тему' }),
    )
    expect(
      screen.getByRole('button', { name: 'Включить светлую тему' }),
    ).toBeInTheDocument()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('restores the chosen theme after remount', async () => {
    const user = userEvent.setup()
    localStorage.clear()

    const view = render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    )

    await user.click(
      screen.getByRole('button', { name: 'Включить тёмную тему' }),
    )
    expect(localStorage.getItem('part-scope-theme')).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    view.unmount()
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    )

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })
    expect(
      screen.getByRole('button', { name: 'Включить светлую тему' }),
    ).toBeInTheDocument()
  })
})
