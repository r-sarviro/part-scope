/** Числовая цена для UI без выдуманного символа валюты. */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
  }).format(value)
}
