import {
  httpGet,
  mapApiErrorMessage,
  ResponseFormatError,
} from '@/shared/api'
import { env } from '@/shared/config'

function assertPayload(payload: unknown): unknown {
  if (
    payload !== null &&
    typeof payload === 'object' &&
    'error' in payload &&
    typeof (payload as { error: unknown }).error === 'string'
  ) {
    throw mapApiErrorMessage((payload as { error: string }).error)
  }

  if (payload === null || typeof payload !== 'object') {
    throw new ResponseFormatError('Ответ сервера не содержит данных поиска.')
  }

  return payload
}

export async function fetchManufacturersByArticle(
  article: string,
  signal?: AbortSignal,
): Promise<unknown> {
  const payload = await httpGet(env.apiBaseUrl, {
    signal,
    params: {
      key: env.apiKey,
      number: article,
    },
  })

  return assertPayload(payload)
}

export async function fetchPartOffers(
  article: string,
  brand: string,
  signal?: AbortSignal,
): Promise<unknown> {
  const payload = await httpGet(env.apiBaseUrl, {
    signal,
    params: {
      key: env.apiKey,
      number: article,
      brand,
      analogues: 'on',
    },
  })

  return assertPayload(payload)
}
