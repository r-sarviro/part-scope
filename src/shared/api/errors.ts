export type ApiErrorCode =
  | 'empty_key'
  | 'invalid_key'
  | 'empty_number'
  | 'quota_exceeded'
  | 'unknown'

const KNOWN_API_ERRORS: Record<string, ApiErrorCode> = {
  'Empty key!': 'empty_key',
  'Invalid key client!': 'invalid_key',
  'Empty number goods!': 'empty_number',
  'Request quota exceeded!': 'quota_exceeded',
}

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly apiMessage: string

  constructor(code: ApiErrorCode, apiMessage: string) {
    super(apiMessage)
    this.name = 'ApiError'
    this.code = code
    this.apiMessage = apiMessage
  }
}

export class HttpError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`HTTP ${status}`)
    this.name = 'HttpError'
    this.status = status
  }
}

export class ResponseFormatError extends Error {
  constructor(message = 'Invalid response format.') {
    super(message)
    this.name = 'ResponseFormatError'
  }
}

export function mapApiErrorMessage(apiMessage: string): ApiError {
  const code = KNOWN_API_ERRORS[apiMessage] ?? 'unknown'
  return new ApiError(code, apiMessage)
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  )
}
