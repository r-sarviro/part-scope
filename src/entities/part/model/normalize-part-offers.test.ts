import { describe, expect, it } from 'vitest'

import { extractManufacturers } from './extract-manufacturers'
import { normalizePartOffers } from './normalize-part-offers'

const multiWarehousePayload = {
  goods: [
    {
      goodsID: 'g1',
      brand: 'CAFFARO',
      number: '0189',
      name: 'Ролик',
      price: 9999,
      warehouses: [
        { code: 'MSK', id: 'w1', price: 1250.5, stock: 4 },
        { code: 'SPB', id: 'w2', price: 1189, stock: 0 },
      ],
      analogues: [
        {
          goodsID: 'g2',
          brand: 'GATES',
          number: '0189-A',
          name: 'Ролик аналог',
          price: 1,
          warehouses: [{ code: 'EKB', id: 'w3', price: 980.25, stock: 12 }],
        },
      ],
    },
    {
      goodsID: 'g3',
      brand: 'CAFFARO',
      number: '0189',
      name: 'Дубликат бренда',
      warehouses: [],
    },
  ],
}

describe('extractManufacturers', () => {
  it('returns unique top-level brands in first-seen order and skips hollow goods', () => {
    expect(extractManufacturers(multiWarehousePayload)).toEqual(['CAFFARO'])

    expect(
      extractManufacturers({
        goods: [
          { brand: 'CAFFARO', number: '1', name: 'A', warehouses: [] },
          { brand: 'INA', number: '2', name: 'B', warehouses: [] },
          { brand: 'CAFFARO', number: '3', name: 'C', warehouses: [] },
          {},
        ],
      }),
    ).toEqual(['CAFFARO', 'INA'])

    expect(extractManufacturers({ goods: [{}] })).toEqual([])
    expect(extractManufacturers({ goods: 'nope' })).toEqual([])
    expect(extractManufacturers(null)).toEqual([])
  })

  it('preserves leading zeros in article numbers when present on goods', () => {
    const brands = extractManufacturers({
      goods: [{ brand: 'INA', number: '01089', name: 'Part', warehouses: [] }],
    })
    expect(brands).toEqual(['INA'])
  })
})

describe('normalizePartOffers', () => {
  it('creates one row per warehouse and never uses goods.price', () => {
    const rows = normalizePartOffers(multiWarehousePayload)

    expect(rows).toHaveLength(3)
    expect(rows.map((row) => row.price)).toEqual([1250.5, 1189, 980.25])
    expect(rows.map((row) => row.stock)).toEqual([4, 0, 12])
    expect(rows.every((row) => row.price !== 9999)).toBe(true)
    expect(rows[0]?.isAnalogue).toBe(false)
    expect(rows[2]?.isAnalogue).toBe(true)
    expect(rows[1]?.stock).toBe(0)
  })

  it('returns no rows for hollow goods or missing warehouses', () => {
    expect(normalizePartOffers({ goods: [{}] })).toEqual([])
    expect(
      normalizePartOffers({
        goods: [
          {
            goodsID: 'g1',
            brand: 'CAFFARO',
            number: '0189',
            name: 'Ролик',
            warehouses: [],
          },
        ],
      }),
    ).toEqual([])
  })
})
