import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api'

vi.mock('@/shared/config', () => ({
  env: {
    apiBaseUrl: 'http://api.example.test/hs/hsprice/',
    apiKey: 'test-key',
  },
}))

import { fetchManufacturersByArticle, fetchPartOffers } from './parts-api'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('parts-api', () => {
  it('requests manufacturers with key and number only', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ goods: [] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await fetchManufacturersByArticle('0189')

    const url = String(fetchMock.mock.calls[0]?.[0])
    expect(url).toContain('key=test-key')
    expect(url).toContain('number=0189')
    expect(url).not.toContain('brand=')
    expect(url).not.toContain('analogues=')
  })

  it('requests offers with brand and analogues=on', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          goods: [
            {
              goodsID: 'g1',
              brand: 'CAFFARO',
              number: '0189',
              name: 'Part',
              warehouses: [{ id: 'w1', price: 10, stock: 1 }],
            },
          ],
        }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await fetchPartOffers('0189', 'CAFFARO')

    const url = String(fetchMock.mock.calls[0]?.[0])
    expect(url).toContain('number=0189')
    expect(url).toContain('brand=CAFFARO')
    expect(url).toContain('analogues=on')
  })

  it('throws mapped ApiError when payload has error field', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          JSON.stringify({ error: 'Invalid key client!' }),
      }),
    )

    await expect(fetchManufacturersByArticle('0189')).rejects.toMatchObject({
      name: 'ApiError',
      code: 'invalid_key',
    } satisfies Partial<ApiError>)
  })
})
