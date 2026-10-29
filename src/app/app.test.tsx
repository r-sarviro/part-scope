import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { App } from './app'

describe('App', () => {
  it('renders the idle parts search screen', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Поиск автозапчастей', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Артикул детали')).toBeInTheDocument()
    expect(
      screen.queryByRole('group', { name: 'Выберите производителя' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', {
        name: 'Найденные детали и аналоги',
        level: 2,
      }),
    ).not.toBeInTheDocument()
  })
})
