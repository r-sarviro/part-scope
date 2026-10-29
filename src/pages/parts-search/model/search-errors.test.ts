import { describe, expect, it } from 'vitest'

import { HttpError, mapApiErrorMessage } from '@/shared/api'

import { getSearchErrorMessage } from './search-errors'

describe('getSearchErrorMessage', () => {
  it('maps known API errors to user-facing copy', () => {
    expect(getSearchErrorMessage(mapApiErrorMessage('Invalid key client!'))).toBe(
      'Сервис поиска недоступен. Проверьте ключ доступа.',
    )
    expect(getSearchErrorMessage(mapApiErrorMessage('Empty key!'))).toBe(
      'Проблема конфигурации доступа к сервису поиска.',
    )
  })

  it('maps HTTP and network failures', () => {
    expect(getSearchErrorMessage(new HttpError(503))).toBe(
      'Не удалось выполнить поиск. Попробуйте ещё раз.',
    )
    expect(getSearchErrorMessage(new TypeError('Failed to fetch'))).toBe(
      'Нет соединения с сервисом поиска. Проверьте сеть и повторите попытку.',
    )
  })
})
