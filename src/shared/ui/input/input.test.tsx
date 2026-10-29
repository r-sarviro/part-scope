import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Input } from './input'

function ControlledArticleInput() {
  const [value, setValue] = useState('0189')
  return (
    <Input
      label="Артикул детали"
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  )
}

describe('Input', () => {
  it('associates an accessible label with the field', () => {
    render(<Input label="Артикул детали" />)

    expect(screen.getByLabelText('Артикул детали')).toBeInTheDocument()
  })

  it('shows an error message linked to the field', () => {
    render(<Input label="Артикул детали" error="Введите артикул" />)

    const field = screen.getByLabelText('Артикул детали')
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Введите артикул')
  })

  it('keeps leading zeros in article values', async () => {
    const user = userEvent.setup()
    render(<ControlledArticleInput />)

    const field = screen.getByLabelText('Артикул детали')
    expect(field).toHaveValue('0189')

    await user.clear(field)
    await user.type(field, '00123')
    expect(field).toHaveValue('00123')
  })
})
