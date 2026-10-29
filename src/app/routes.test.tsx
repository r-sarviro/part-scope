import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'

import { ThemeProvider } from '@/shared/lib'
import { createTestQueryClient } from '@/shared/testing'

import { QueryProvider } from './query-provider'
import { createAppRoutes } from './router'

function renderAt(path: string) {
  const router = createMemoryRouter(createAppRoutes(), {
    initialEntries: [path],
  })

  render(
    <QueryProvider client={createTestQueryClient()}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>,
  )
}

describe('app routes', () => {
  it('indexes the home page with a single h1', () => {
    renderAt('/')

    expect(
      screen.getByRole('heading', { name: 'Поиск автозапчастей', level: 1 }),
    ).toBeInTheDocument()
    expect(document.title).not.toBe('Поиск — Part Scope')
    expect(document.querySelector('meta[name="robots"]')).toBeNull()
  })

  it('keeps search out of the index and shows an h1', () => {
    renderAt('/search')

    expect(document.title).toBe('Поиск — Part Scope')
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, follow',
    )
    expect(
      screen.getByRole('heading', { name: 'Поиск автозапчастей', level: 1 }),
    ).toBeInTheDocument()
  })

  it('renders a not-found page for an unknown path', () => {
    renderAt('/missing')

    expect(
      screen.getByRole('heading', { name: 'Страница не найдена', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'На главную' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, follow',
    )
    expect(
      screen.queryByRole('heading', { name: 'Поиск автозапчастей' }),
    ).not.toBeInTheDocument()
  })
})
