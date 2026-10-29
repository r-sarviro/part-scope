import { QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { formatPrice, ThemeProvider } from '@/shared/lib'
import { createTestQueryClient } from '@/shared/testing'

import { PartsSearchPage } from './parts-search-page'

vi.mock('@/shared/config', () => ({
  env: {
    apiBaseUrl: 'http://api.example.test/hs/hsprice/',
    apiKey: 'test-key',
  },
}))

function renderPage() {
  const client = createTestQueryClient()
  const router = createMemoryRouter(
    [
      { path: '/', element: <PartsSearchPage /> },
      { path: '/search', element: <PartsSearchPage /> },
    ],
    { initialEntries: ['/'] },
  )

  render(
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>,
  )

  return router
}

function jsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    text: async () => JSON.stringify(body),
  }
}

type JsonResponse = ReturnType<typeof jsonResponse>

function defer<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

function priceNodes(value: number) {
  const formatted = formatPrice(value)
  return (_content: string, node: Element | null) => node?.textContent === formatted
}

const caffaroGood = {
  brand: 'CAFFARO',
  number: '0189',
  name: 'Ролик',
  warehouses: [] as unknown[],
}

const inaGood = {
  brand: 'INA',
  number: '0189',
  name: 'Ролик INA',
  warehouses: [] as unknown[],
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('PartsSearchPage', () => {
  it('stays idle until a non-empty article is submitted', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    renderPage()

    expect(
      screen.getByRole('heading', { name: 'Поиск автозапчастей', level: 1 }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Найти' }))
    expect(fetchMock).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText('Артикул детали'), '   ')
    await user.click(screen.getByRole('button', { name: 'Найти' }))
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('loads manufacturers, then offers after brand select', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('analogues=on')) {
        return jsonResponse({
          goods: [
            {
              goodsID: 'g1',
              brand: 'CAFFARO',
              number: '0189',
              name: 'Ролик',
              price: 9999,
              warehouses: [
                { code: 'MSK', id: 'w1', price: 1250.5, stock: 4 },
                { code: 'SPB', id: 'w2', price: 1189, stock: 0 },
              ],
            },
          ],
        })
      }
      return jsonResponse({
        goods: [
          {
            goodsID: 'g1',
            brand: 'CAFFARO',
            number: '0189',
            name: 'Ролик',
            warehouses: [],
          },
          {
            goodsID: 'g2',
            brand: 'INA',
            number: '0189',
            name: 'Ролик INA',
            warehouses: [],
          },
        ],
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const router = renderPage()

    await user.type(screen.getByLabelText('Артикул детали'), '0189')
    await user.click(screen.getByRole('button', { name: 'Найти' }))

    expect(
      await screen.findByRole('button', { name: 'CAFFARO' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'INA' })).toBeInTheDocument()

    const stage1Url = String(fetchMock.mock.calls[0]?.[0])
    expect(stage1Url).toContain('number=0189')
    expect(stage1Url).not.toContain('analogues=')

    await user.click(screen.getByRole('button', { name: 'CAFFARO' }))

    expect(router.state.location.search).toContain('brand=CAFFARO')
    expect(
      await screen.findByRole('heading', {
        name: 'Найденные детали и аналоги',
      }),
    ).toBeInTheDocument()

    expect(await screen.findAllByText('Ролик')).not.toHaveLength(0)
    // В цене может быть узкий NBSP от Intl — сравниваем полный formatPrice.
    expect(
      screen.getAllByText((_, node) => node?.textContent === formatPrice(1250.5))
        .length,
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByText((_, node) => node?.textContent === formatPrice(1189))
        .length,
    ).toBeGreaterThan(0)
    expect(
      screen.queryByText((_, node) => node?.textContent === formatPrice(9999)),
    ).toBeNull()

    await waitFor(() => {
      expect(fetchMock.mock.calls.length).toBeGreaterThan(1)
    })
    const stage2Url = String(fetchMock.mock.calls.at(-1)?.[0])
    expect(stage2Url).toContain('brand=CAFFARO')
    expect(stage2Url).toContain('analogues=on')
    expect(screen.getAllByText('0 шт.').length).toBeGreaterThan(0)
    expect(
      screen.getByRole('table', {
        name: 'Предложения по запчастям',
        hidden: true,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('heading', { level: 3, name: 'Ролик' }).length,
    ).toBeGreaterThan(0)
    expect(screen.getByLabelText('Артикул детали')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Найти' })).toBeInTheDocument()
  })

  it('shows empty state when manufacturers are not found', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ goods: [{}] })),
    )

    renderPage()
    await user.type(screen.getByLabelText('Артикул детали'), 'none')
    await user.click(screen.getByRole('button', { name: 'Найти' }))

    expect(
      await screen.findByRole('heading', { name: 'Производители не найдены' }),
    ).toBeInTheDocument()
  })

  it('shows API error with retry for invalid key', async () => {
    const user = userEvent.setup()
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ error: 'Invalid key client!' }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          goods: [
            {
              brand: 'CAFFARO',
              number: '1',
              name: 'Part',
              warehouses: [],
            },
          ],
        }),
      )
    vi.stubGlobal('fetch', fetchMock)

    renderPage()
    await user.type(screen.getByLabelText('Артикул детали'), '0189')
    await user.click(screen.getByRole('button', { name: 'Найти' }))

    const alert = await screen.findByRole('alert')
    expect(
      within(alert).getByText(
        'Сервис поиска недоступен. Проверьте ключ доступа.',
      ),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Повторить' }))
    expect(
      await screen.findByRole('button', { name: 'CAFFARO' }),
    ).toBeInTheDocument()
  })

  it('resets selected brand when article changes', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('analogues=on')) {
        return jsonResponse({
          goods: [
            {
              brand: 'CAFFARO',
              number: '0189',
              name: 'Part',
              warehouses: [{ id: 'w1', price: 10, stock: 1 }],
            },
          ],
        })
      }
      if (url.includes('number=2222')) {
        return jsonResponse({
          goods: [
            {
              brand: 'SKF',
              number: '2222',
              name: 'Other',
              warehouses: [],
            },
          ],
        })
      }
      return jsonResponse({
        goods: [
          {
            brand: 'CAFFARO',
            number: '0189',
            name: 'Part',
            warehouses: [],
          },
        ],
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const router = renderPage()
    const input = screen.getByLabelText('Артикул детали')

    await user.type(input, '0189')
    await user.click(screen.getByRole('button', { name: 'Найти' }))
    await user.click(await screen.findByRole('button', { name: 'CAFFARO' }))
    expect(
      await screen.findByRole('heading', {
        name: 'Найденные детали и аналоги',
      }),
    ).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Артикул детали'))
    await user.type(screen.getByLabelText('Артикул детали'), '2222')
    await user.click(screen.getByRole('button', { name: 'Найти' }))

    expect(await screen.findByRole('button', { name: 'SKF' })).toBeInTheDocument()
    expect(router.state.location.search).toContain('number=2222')
    expect(router.state.location.search).not.toContain('brand=')
    expect(
      screen.getByRole('heading', { name: 'Выберите производителя' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', {
        name: 'Найденные детали и аналоги',
      }),
    ).not.toBeInTheDocument()
  })

  it('shows a loading state until manufacturers arrive', async () => {
    const user = userEvent.setup()
    const request = defer<JsonResponse>()
    vi.stubGlobal(
      'fetch',
      vi.fn(() => request.promise),
    )

    renderPage()
    await user.type(screen.getByLabelText('Артикул детали'), '0189')
    await user.click(screen.getByRole('button', { name: 'Найти' }))

    expect((await screen.findAllByText('Загрузка')).length).toBeGreaterThan(0)
    expect(
      screen.queryByRole('button', { name: 'CAFFARO' }),
    ).not.toBeInTheDocument()

    await act(async () => {
      request.resolve(
        jsonResponse({
          goods: [caffaroGood],
        }),
      )
    })

    expect(
      await screen.findByRole('button', { name: 'CAFFARO' }),
    ).toBeInTheDocument()
    expect(screen.queryAllByText('Загрузка')).toHaveLength(0)
  })

  it('shows a network error and retries the manufacturer search', async () => {
    const user = userEvent.setup()
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(
        jsonResponse({
          goods: [caffaroGood],
        }),
      )
    vi.stubGlobal('fetch', fetchMock)

    renderPage()
    await user.type(screen.getByLabelText('Артикул детали'), '0189')
    await user.click(screen.getByRole('button', { name: 'Найти' }))

    const alert = await screen.findByRole('alert', undefined, { timeout: 4_000 })
    expect(
      within(alert).getByRole('heading', {
        name: 'Не удалось загрузить производителей',
      }),
    ).toBeInTheDocument()
    expect(
      within(alert).getByText(
        'Нет соединения с сервисом поиска. Проверьте сеть и повторите попытку.',
      ),
    ).toBeInTheDocument()

    await user.click(within(alert).getByRole('button', { name: 'Повторить' }))
    expect(
      await screen.findByRole('button', { name: 'CAFFARO' }),
    ).toBeInTheDocument()
  })

  it('shows an empty warehouse state and ignores goods.price', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes('analogues=on')) {
          return jsonResponse({
            goods: [
              {
                ...caffaroGood,
                price: 9999,
                warehouses: [],
              },
            ],
          })
        }
        return jsonResponse({ goods: [caffaroGood] })
      }),
    )

    renderPage()
    await user.type(screen.getByLabelText('Артикул детали'), '0189')
    await user.click(screen.getByRole('button', { name: 'Найти' }))
    await user.click(await screen.findByRole('button', { name: 'CAFFARO' }))

    expect(
      await screen.findByRole('heading', { name: 'Нет складских предложений' }),
    ).toBeInTheDocument()
    expect(screen.queryAllByText(priceNodes(9999))).toHaveLength(0)
  })

  it('renders analogue offers with warehouse price and stock', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes('analogues=on')) {
          return jsonResponse({
            goods: [
              {
                goodsID: 'g1',
                brand: 'CAFFARO',
                number: '0189',
                name: 'Ролик',
                price: 9999,
                warehouses: [{ code: 'MSK', id: 'w1', price: 100, stock: 2 }],
                analogues: [
                  {
                    goodsID: 'g2',
                    brand: 'GATES',
                    number: '0189-A',
                    name: 'Ролик аналог',
                    price: 7777,
                    warehouses: [
                      { code: 'EKB', id: 'w3', price: 980.25, stock: 12 },
                    ],
                  },
                ],
              },
            ],
          })
        }
        return jsonResponse({ goods: [caffaroGood] })
      }),
    )

    renderPage()
    await user.type(screen.getByLabelText('Артикул детали'), '0189')
    await user.click(screen.getByRole('button', { name: 'Найти' }))
    await user.click(await screen.findByRole('button', { name: 'CAFFARO' }))

    expect(await screen.findAllByText('Ролик аналог')).not.toHaveLength(0)
    expect(screen.getAllByText('GATES').length).toBeGreaterThan(0)
    expect(screen.getAllByText(priceNodes(980.25)).length).toBeGreaterThan(0)
    expect(screen.getAllByText(priceNodes(100)).length).toBeGreaterThan(0)
    expect(screen.getAllByText('12 шт.').length).toBeGreaterThan(0)
    expect(screen.queryAllByText(priceNodes(9999))).toHaveLength(0)
    expect(screen.queryAllByText(priceNodes(7777))).toHaveLength(0)
  })

  it('keeps leading zeros in the manufacturer request', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        goods: [
          { brand: 'INA', number: '01089', name: 'Part', warehouses: [] },
        ],
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    renderPage()
    await user.type(screen.getByLabelText('Артикул детали'), '01089')
    await user.click(screen.getByRole('button', { name: 'Найти' }))

    expect(
      await screen.findByRole('button', { name: 'INA' }),
    ).toBeInTheDocument()
    const url = new URL(String(fetchMock.mock.calls[0]?.[0]))
    expect(url.searchParams.get('number')).toBe('01089')
  })

  it('ignores a stale manufacturer response after the article changes', async () => {
    const user = userEvent.setup()
    const pending: Array<ReturnType<typeof defer<JsonResponse>>> = []
    const fetchMock = vi.fn(() => {
      const request = defer<JsonResponse>()
      pending.push(request)
      return request.promise
    })
    vi.stubGlobal('fetch', fetchMock)

    const router = renderPage()
    await user.type(screen.getByLabelText('Артикул детали'), '0189')
    await user.click(screen.getByRole('button', { name: 'Найти' }))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    // Пока идёт stage 1, submit недоступен — следующий артикул задаём через URL.
    await act(async () => {
      await router.navigate('/search?number=2222')
    })
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))

    await act(async () => {
      pending[0]?.resolve(
        jsonResponse({
          goods: [
            {
              brand: 'CAFFARO',
              number: '0189',
              name: 'Старый',
              warehouses: [],
            },
          ],
        }),
      )
    })

    expect(
      screen.queryByRole('button', { name: 'CAFFARO' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Старый')).not.toBeInTheDocument()

    await act(async () => {
      pending[1]?.resolve(
        jsonResponse({
          goods: [
            { brand: 'SKF', number: '2222', name: 'Актуальный', warehouses: [] },
          ],
        }),
      )
    })

    expect(
      await screen.findByRole('button', { name: 'SKF' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'CAFFARO' }),
    ).not.toBeInTheDocument()
    expect(router.state.location.search).toContain('number=2222')
  })

  it('shows offers for the latest selected manufacturer', async () => {
    const user = userEvent.setup()
    const stage2: Array<ReturnType<typeof defer<JsonResponse>>> = []
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        if (String(input).includes('analogues=on')) {
          const request = defer<JsonResponse>()
          stage2.push(request)
          return request.promise
        }
        return Promise.resolve(
          jsonResponse({ goods: [caffaroGood, inaGood] }),
        )
      }),
    )

    const router = renderPage()
    await user.type(screen.getByLabelText('Артикул детали'), '0189')
    await user.click(screen.getByRole('button', { name: 'Найти' }))
    await user.click(await screen.findByRole('button', { name: 'CAFFARO' }))
    await waitFor(() => expect(stage2).toHaveLength(1))

    await user.click(screen.getByRole('button', { name: 'INA' }))
    await waitFor(() => expect(stage2).toHaveLength(2))

    await act(async () => {
      stage2[0]?.resolve(
        jsonResponse({
          goods: [
            {
              brand: 'CAFFARO',
              number: '0189',
              name: 'Ролик CAFFARO',
              warehouses: [{ id: 'w1', price: 10, stock: 1 }],
            },
          ],
        }),
      )
    })

    expect(screen.queryByText('Ролик CAFFARO')).not.toBeInTheDocument()

    await act(async () => {
      stage2[1]?.resolve(
        jsonResponse({
          goods: [
            {
              brand: 'INA',
              number: '0189',
              name: 'Ролик INA',
              warehouses: [{ id: 'w2', price: 20, stock: 2 }],
            },
          ],
        }),
      )
    })

    expect(await screen.findAllByText('Ролик INA')).not.toHaveLength(0)
    expect(screen.queryByText('Ролик CAFFARO')).not.toBeInTheDocument()
    expect(screen.getByText('INA', { selector: 'strong' })).toBeInTheDocument()
    expect(router.state.location.search).toContain('brand=INA')
  })
})
