import { describe, expect, it } from 'vitest'

import { ApiError, HttpError, mapApiErrorMessage } from './errors'

describe('mapApiErrorMessage', () => {
  it.each([
    ['Empty key!', 'empty_key'],
    ['Invalid key client!', 'invalid_key'],
    ['Empty number goods!', 'empty_number'],
    ['Request quota exceeded!', 'quota_exceeded'],
    ['Something else', 'unknown'],
  ] as const)('maps %s', (apiMessage, code) => {
    const error = mapApiErrorMessage(apiMessage)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.code).toBe(code)
    expect(error.apiMessage).toBe(apiMessage)
  })
})

describe('HttpError', () => {
  it('keeps the status without a user-facing search message', () => {
    const error = new HttpError(503)
    expect(error.status).toBe(503)
    expect(error.message).toBe('HTTP 503')
  })
})
