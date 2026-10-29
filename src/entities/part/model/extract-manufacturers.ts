import { parseGoodsPayload } from './parse-goods'

/** Уникальные бренды из ответа stage 1, порядок первого появления. */
export function extractManufacturers(payload: unknown): string[] {
  const goods = parseGoodsPayload(payload)
  const brands: string[] = []
  const seen = new Set<string>()

  for (const good of goods) {
    if (!good.brand || seen.has(good.brand)) {
      continue
    }
    seen.add(good.brand)
    brands.push(good.brand)
  }

  return brands
}
