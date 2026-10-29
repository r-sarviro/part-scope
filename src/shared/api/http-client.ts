import { HttpError, ResponseFormatError } from './errors'

export type HttpRequestOptions = {
  signal?: AbortSignal
  params?: Record<string, string>
}

export async function httpGet(
  baseUrl: string,
  options: HttpRequestOptions = {},
): Promise<unknown> {
  const url = new URL(baseUrl)

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      url.searchParams.set(key, value)
    }
  }

  const response = await fetch(url, {
    method: 'GET',
    signal: options.signal,
  })

  if (!response.ok) {
    throw new HttpError(response.status)
  }

  const text = await response.text()

  if (!text.trim()) {
    return null
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new ResponseFormatError()
  }
}
