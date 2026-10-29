import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { PartOfferRow } from '@/entities/part'
import { formatPrice } from '@/shared/lib'

import { OfferDetailModal } from './offer-detail-modal'

const offer: PartOfferRow = {
  rowId: 'a-1',
  goodsId: 'g1',
  number: '0189',
  name: 'Ролик натяжителя',
  brand: 'CAFFARO',
  warehouseCode: 'MSK-01',
  warehouseId: 'w1',
  price: 1250.5,
  stock: 4,
  isAnalogue: true,
  notRefund: true,
}

const longOffer: PartOfferRow = {
  ...offer,
  name: 'Очень длинное наименование детали без пробелов-ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-и-ещё-длиннее',
  number: 'ART-VERY-LONG-NUMBER-99887766554433221100-EXTRA',
  brand: 'SUPERLONGMANUFACTURERNAMEWITHOUTBREAKS',
  warehouseCode: 'WAREHOUSE-CODE-VERY-LONG-MSK-SPB-01-EXTRA',
  price: 123456789012.34,
  stock: 999999999,
}

describe('OfferDetailModal', () => {
  it('shows labeled name and article, with type notes at the end', () => {
    const { container } = render(
      <OfferDetailModal offer={offer} onClose={vi.fn()} />,
    )

    expect(
      screen.getByRole('dialog', { name: 'Предложение' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Наименование')).toBeInTheDocument()
    expect(screen.getByText('Ролик натяжителя')).toBeInTheDocument()
    expect(screen.getByText('Артикул')).toBeInTheDocument()
    expect(screen.getByText('0189')).toBeInTheDocument()
    expect(screen.getByText('Производитель')).toBeInTheDocument()
    expect(screen.getByText('CAFFARO')).toBeInTheDocument()
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'SPAN' &&
          element.textContent === formatPrice(1250.5),
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Склад')).toBeInTheDocument()
    expect(screen.getByText('Невозвратная позиция')).toBeInTheDocument()
    expect(screen.getByText('Аналог')).toBeInTheDocument()

    const text = container.textContent ?? ''
    expect(text.indexOf('Склад')).toBeLessThan(text.indexOf('Аналог'))
    expect(text.indexOf('Невозвратная позиция')).toBeLessThan(
      text.indexOf('Аналог'),
    )
  })

  it('marks the original part and hides the refund warning when false', () => {
    render(
      <OfferDetailModal
        offer={{ ...offer, isAnalogue: false, notRefund: false }}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByText('Исходная деталь')).toBeInTheDocument()
    expect(screen.queryByText('Аналог')).not.toBeInTheDocument()
    expect(screen.queryByText('Невозвратная позиция')).not.toBeInTheDocument()
  })

  it('keeps long values inside the dialog without inventing content', () => {
    render(<OfferDetailModal offer={longOffer} onClose={vi.fn()} />)

    expect(screen.getByText(longOffer.name)).toBeInTheDocument()
    expect(screen.getByText(longOffer.number)).toBeInTheDocument()
    expect(screen.getByText(longOffer.brand)).toBeInTheDocument()
    expect(screen.getByText(longOffer.warehouseCode)).toBeInTheDocument()
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'SPAN' &&
          element.textContent === formatPrice(longOffer.price!),
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('999999999 шт.')).toBeInTheDocument()
  })
})
