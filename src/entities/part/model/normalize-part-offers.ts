import { parseGoodsPayload, type ParsedGood } from './parse-goods'
import type { PartOfferRow } from './types'

function buildRowId(
  good: ParsedGood,
  warehouseId: string,
  warehouseCode: string,
  isAnalogue: boolean,
  index: number,
): string {
  const warehouseKey = warehouseId || warehouseCode || `idx-${index}`
  const goodsKey = good.goodsId || `${good.brand}:${good.number}`
  return `${isAnalogue ? 'a' : 'o'}:${goodsKey}:${warehouseKey}:${index}`
}

function rowsFromGood(
  good: ParsedGood,
  isAnalogue: boolean,
  rows: PartOfferRow[],
): void {
  good.warehouses.forEach((warehouse, index) => {
    rows.push({
      rowId: buildRowId(good, warehouse.id, warehouse.code, isAnalogue, index),
      goodsId: good.goodsId,
      number: good.number,
      name: good.name,
      brand: good.brand,
      warehouseCode: warehouse.code,
      warehouseId: warehouse.id,
      price: warehouse.price,
      stock: warehouse.stock,
      isAnalogue,
      notRefund: warehouse.notRefund || good.notRefund,
    })
  })
}

/**
 * goods + аналоги → одна строка UI на склад.
 * Цена только из warehouses[].price, не из goods.price.
 */
export function normalizePartOffers(payload: unknown): PartOfferRow[] {
  const goods = parseGoodsPayload(payload)
  const rows: PartOfferRow[] = []

  for (const good of goods) {
    rowsFromGood(good, false, rows)
    for (const analogue of good.analogues) {
      rowsFromGood(analogue, true, rows)
    }
  }

  return rows
}
