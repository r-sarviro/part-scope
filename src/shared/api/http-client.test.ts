import { afterEach, describe, expect, it, vi } from 'vitest'

import { HttpError, ResponseFormatError } from './errors'
import { httpGet } from './http-client'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('httpGet', () => {
  it('builds query params with URLSearchParams escaping', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ goods: [] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await httpGet('http://example.test/hsprice/', {
      params: { number: 'a#b&c', brand: 'FOO' },
    })

    expect(fetchMock).toHaveBeenCalledOnce()
    const calledUrl = String(fetchMock.mock.calls[0]?.[0])
    expect(calledUrl).toContain('number=a%23b%26c')
    expect(calledUrl).toContain('brand=FOO')
  })

  it('throws HttpError on non-2xx', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        text: async () => '',
      }),
    )

    await expect(httpGet('http://example.test/')).rejects.toBeInstanceOf(
      HttpError,
    )
  })

  it('throws ResponseFormatError on invalid JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<html>nope</html>',
      }),
    )

    await expect(httpGet('http://example.test/')).rejects.toBeInstanceOf(
      ResponseFormatError,
    )
  })
})
