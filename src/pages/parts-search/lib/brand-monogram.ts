export function brandMonogram(brand: string): string {
  return brand.trim().charAt(0).toUpperCase() || '?'
}
