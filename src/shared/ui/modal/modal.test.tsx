import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Modal } from './modal'

function ControlledModal({ onClose }: { onClose?: () => void }) {
  const [open, setOpen] = useState(true)
  return (
    <Modal
      open={open}
      title="Предложение"
      onClose={() => {
        setOpen(false)
        onClose?.()
      }}
    >
      <p>Склад МСК</p>
    </Modal>
  )
}

describe('Modal', () => {
  it('shows the title and closes from the button, Escape, and the backdrop', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { unmount } = render(<ControlledModal onClose={onClose} />)

    const dialog = screen.getByRole('dialog', { name: 'Предложение' })
    expect(dialog).toHaveTextContent('Склад МСК')

    await user.click(screen.getByRole('button', { name: 'Закрыть' }))
    expect(onClose).toHaveBeenCalledTimes(1)
    unmount()

    const escapeClose = vi.fn()
    const escapeView = render(<ControlledModal onClose={escapeClose} />)
    fireEvent.keyDown(screen.getByRole('dialog', { name: 'Предложение' }), {
      key: 'Escape',
    })
    expect(escapeClose).toHaveBeenCalledTimes(1)
    escapeView.unmount()

    const backdropClose = vi.fn()
    render(<ControlledModal onClose={backdropClose} />)
    await user.click(screen.getByRole('dialog', { name: 'Предложение' }))
    expect(backdropClose).toHaveBeenCalledTimes(1)
  })
})
