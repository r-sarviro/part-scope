type WarehouseLike = {
  code?: unknown
  id?: unknown
  own?: unknown
  shipmentDate?: unknown
  price?: unknown
  stock?: unknown
  notRefund?: unknown
}

type GoodLike = {
  goodsID?: unknown
  brand?: unknown
  number?: unknown
  name?: unknown
  count?: unknown
  price?: unknown
  rate?: unknown
  analogues?: unknown
  warehouses?: unknown
  notRefund?: unknown
}

type ParsedWarehouse = {
  code: string
  id: string
  price: number | null
  stock: number | null
  notRefund: boolean
}

export type ParsedGood = {
  goodsId: string
  brand: string
  number: string
  name: string
  warehouses: ParsedWarehouse[]
  analogues: ParsedGood[]
  notRefund: boolean
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }
  return value as Record<string, unknown>
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asNullableNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function parseWarehouse(value: unknown): ParsedWarehouse | null {
  const raw = asRecord(value) as WarehouseLike | null
  if (!raw) {
    return null
  }

  return {
    code: asString(raw.code),
    id: asString(raw.id),
    price: asNullableNumber(raw.price),
    stock: asNullableNumber(raw.stock),
    notRefund: raw.notRefund === true,
  }
}

function hasIdentity(good: {
  brand: string
  number: string
  name: string
  warehouses: ParsedWarehouse[]
}): boolean {
  return Boolean(
    good.brand || good.number || good.name || good.warehouses.length > 0,
  )
}

function parseGood(value: unknown, parseAnalogues: boolean): ParsedGood | null {
  const raw = asRecord(value) as GoodLike | null
  if (!raw) {
    return null
  }

  const warehousesRaw = Array.isArray(raw.warehouses) ? raw.warehouses : []
  const warehouses = warehousesRaw
    .map(parseWarehouse)
    .filter((item): item is ParsedWarehouse => item !== null)

  const good: ParsedGood = {
    goodsId: asString(raw.goodsID),
    brand: asString(raw.brand),
    number: asString(raw.number),
    name: asString(raw.name),
    warehouses,
    analogues: [],
    notRefund: raw.notRefund === true,
  }

  if (!hasIdentity(good)) {
    return null
  }

  if (parseAnalogues && Array.isArray(raw.analogues)) {
    good.analogues = raw.analogues
      .map((item) => parseGood(item, false))
      .filter((item): item is ParsedGood => item !== null)
  }

  return good
}

export function parseGoodsPayload(payload: unknown): ParsedGood[] {
  const root = asRecord(payload)
  if (!root) {
    return []
  }

  const goods = root.goods
  if (!Array.isArray(goods)) {
    return []
  }

  return goods
    .map((item) => parseGood(item, true))
    .filter((item): item is ParsedGood => item !== null)
}
