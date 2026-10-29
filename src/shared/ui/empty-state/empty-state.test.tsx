import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ErrorState } from '@/shared/ui'

import { EmptyState } from './empty-state'

describe('EmptyState and ErrorState', () => {
  it('uses status role for empty results and alert for errors', () => {
    const { rerender } = render(
      <EmptyState
        title="По этому артикулу ничего не найдено"
        description="Проверьте написание и попробуйте другой артикул"
      />,
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'По этому артикулу ничего не найдено',
    )

    rerender(
      <ErrorState
        title="Не удалось связаться с сервисом"
        description="Проверьте соединение и попробуйте ещё раз"
        onRetry={() => undefined}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Не удалось связаться с сервисом',
    )
    expect(
      screen.getByRole('button', { name: 'Повторить' }),
    ).toBeInTheDocument()
  })
})
