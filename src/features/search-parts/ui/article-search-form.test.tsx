import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ArticleSearchForm } from './article-search-form'

describe('ArticleSearchForm', () => {
  it('renders article label and submit button', () => {
    render(<ArticleSearchForm value="0189" />)

    expect(screen.getByLabelText('Артикул детали')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Найти' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('0189')).toBeInTheDocument()
  })
})
