import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './button'

describe('Button', () => {
  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <Button disabled onClick={onClick}>
        Найти
      </Button>,
    )

    await user.click(screen.getByRole('button', { name: 'Найти' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('shows loading state and blocks interaction', () => {
    const onClick = vi.fn()

    render(
      <Button loading onClick={onClick}>
        Найти
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Найти' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(onClick).not.toHaveBeenCalled()
  })
})
