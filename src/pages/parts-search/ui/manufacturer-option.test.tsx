import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ManufacturerList } from './manufacturer-list'
import { ManufacturerOption } from './manufacturer-option'

describe('ManufacturerOption', () => {
  it('shows selected state and calls onSelect with original brand', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <ManufacturerOption brand="CAFFARO" selected onSelect={onSelect} />,
    )

    const option = screen.getByRole('button', { name: /CAFFARO/ })
    expect(option).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Выбрано')).toBeInTheDocument()

    await user.click(option)
    expect(onSelect).toHaveBeenCalledWith('CAFFARO')
  })
})

describe('ManufacturerList', () => {
  it('renders options and forwards selection', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <ManufacturerList
        manufacturers={['CAFFARO', 'Bosch']}
        selectedBrand="CAFFARO"
        onSelect={onSelect}
      />,
    )

    expect(
      screen.getByRole('group', { name: 'Выберите производителя' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'Выберите производителя',
        level: 2,
      }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Bosch/ }))
    expect(onSelect).toHaveBeenCalledWith('Bosch')
  })
})
