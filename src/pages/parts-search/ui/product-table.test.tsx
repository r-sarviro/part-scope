import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { PartOfferRow } from '@/entities/part'
import { formatPrice } from '@/shared/lib'

import { ProductOfferCard } from './product-offer-card'
import { ProductTable } from './product-table'

const offerA: PartOfferRow = {
  rowId: 'a-1',
  goodsId: 'g1',
  number: '0189',
  name: 'Ролик натяжителя',
  brand: 'CAFFARO',
  warehouseCode: 'MSK-01',
  warehouseId: 'w1',
  price: 1250.5,
  stock: 4,
  isAnalogue: false,
  notRefund: false,
}

const offerB: PartOfferRow = {
  rowId: 'b-1',
  goodsId: 'g1',
  number: '0189',
  name: 'Ролик натяжителя',
  brand: 'CAFFARO',
  warehouseCode: 'SPB-02',
  warehouseId: 'w2',
  price: null,
  stock: null,
  isAnalogue: false,
  notRefund: false,
}

describe('ProductTable', () => {
  it('renders warehouse-specific price and stock, not inventing values for null', () => {
    render(<ProductTable rows={[offerA, offerB]} />)

    expect(screen.getByRole('columnheader', { name: 'Цена' })).toBeInTheDocument()
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'SPAN' &&
          element.textContent === formatPrice(1250.5),
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('4 шт.')).toBeInTheDocument()
    expect(screen.getAllByText('Нет данных')).toHaveLength(2)
    expect(screen.getByText('MSK-01')).toBeInTheDocument()
    expect(screen.getByText('SPB-02')).toBeInTheDocument()
  })

  it('shows a zero stock as 0 шт.', () => {
    render(<ProductTable rows={[{ ...offerA, rowId: 'zero', stock: 0 }]} />)

    expect(screen.getByText('0 шт.')).toBeInTheDocument()
  })

  it('selects a row without treating the sort control as the row', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onSort = vi.fn()
    render(
      <ProductTable
        rows={[offerA]}
        sort={null}
        onSort={onSort}
        onSelect={onSelect}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Цена' }))
    expect(onSort).toHaveBeenCalledWith('price')
    expect(onSelect).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /Ролик натяжителя/ }))
    expect(onSelect).toHaveBeenCalledWith(offerA)
  })
})

describe('ProductOfferCard', () => {
  it('keeps price and stock bound to a single offer', () => {
    render(<ProductOfferCard offer={offerA} />)

    expect(
      screen.getByRole('heading', { name: 'Ролик натяжителя' }),
    ).toBeInTheDocument()
    expect(screen.getByText('CAFFARO')).toBeInTheDocument()
    expect(screen.getByText('0189')).toBeInTheDocument()
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'SPAN' &&
          element.textContent === formatPrice(1250.5),
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('4 шт.')).toBeInTheDocument()
    expect(screen.getByText('Склад: MSK-01')).toBeInTheDocument()
  })

  it('shows нет данных when price or stock is null', () => {
    render(<ProductOfferCard offer={offerB} />)

    expect(screen.getAllByText('Нет данных')).toHaveLength(2)
  })

  it('keeps long offer values inside the card', () => {
    const longOffer = {
      ...offerA,
      name: 'ОченьдлинноенаименованиедеталибезпробеловABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      number: 'ART-VERY-LONG-NUMBER-99887766554433221100-EXTRA',
      brand: 'SUPERLONGMANUFACTURERNAMEWITHOUTBREAKS',
      warehouseCode: 'WAREHOUSE-CODE-VERY-LONG-MSK-SPB-01-EXTRA',
      price: 123456789012.34,
      stock: 999999999,
    }

    render(<ProductOfferCard offer={longOffer} />)

    expect(screen.getByText(longOffer.name)).toBeInTheDocument()
    expect(screen.getByText(longOffer.number)).toBeInTheDocument()
    expect(screen.getByText(longOffer.brand)).toBeInTheDocument()
    expect(
      screen.getByText(`Склад: ${longOffer.warehouseCode}`),
    ).toBeInTheDocument()
    expect(screen.getByText('999999999 шт.')).toBeInTheDocument()
  })
})
