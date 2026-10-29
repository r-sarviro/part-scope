import {
  ApiError,
  HttpError,
  isAbortError,
  ResponseFormatError,
  type ApiErrorCode,
} from '@/shared/api'

const SEARCH_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  empty_key: 'Проблема конфигурации доступа к сервису поиска.',
  invalid_key: 'Сервис поиска недоступен. Проверьте ключ доступа.',
  empty_number: 'Укажите артикул детали.',
  quota_exceeded: 'Превышен лимит запросов. Повторите попытку позже.',
  unknown: 'Не удалось выполнить поиск. Попробуйте ещё раз.',
}

const NETWORK_MESSAGE =
  'Нет соединения с сервисом поиска. Проверьте сеть и повторите попытку.'

const FALLBACK_MESSAGE = 'Не удалось выполнить поиск. Попробуйте ещё раз.'

/** Текст для UI: без ключа API и сырых payload. */
export function getSearchErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return SEARCH_ERROR_MESSAGES[error.code]
  }
  if (error instanceof HttpError) {
    return FALLBACK_MESSAGE
  }
  if (error instanceof ResponseFormatError) {
    return 'Не удалось разобрать ответ сервера.'
  }
  if (error instanceof TypeError) {
    return NETWORK_MESSAGE
  }
  return FALLBACK_MESSAGE
}

/** Диагностика в консоль без секретов. */
export function logSearchError(error: unknown): void {
  if (error instanceof ApiError) {
    console.error('[parts-search]', error.code, error.apiMessage)
    return
  }
  if (error instanceof HttpError) {
    console.error('[parts-search]', 'HTTP', error.status)
    return
  }
  if (isAbortError(error)) {
    return
  }
  console.error('[parts-search]', error)
}
