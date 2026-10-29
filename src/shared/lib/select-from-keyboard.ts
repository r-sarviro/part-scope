import type { KeyboardEvent } from 'react'

/** Выбор по Enter или Space. */
export function selectFromKeyboard(
  event: KeyboardEvent<HTMLElement>,
  onSelect: () => void,
) {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return
  }
  event.preventDefault()
  onSelect()
}
