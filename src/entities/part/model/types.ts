export type PartOfferRow = {
  rowId: string
  goodsId: string
  number: string
  name: string
  brand: string
  warehouseCode: string
  warehouseId: string
  price: number | null
  stock: number | null
  isAnalogue: boolean
  notRefund: boolean
}
