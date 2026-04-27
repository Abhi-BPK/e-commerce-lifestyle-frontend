// Tests for CartSummary — checks that subtotal, tax, total, and the
// checkout button render correctly.
// CartSummary receives subtotal + isEmpty as props (not from Redux),
// so we pass them directly and only wrap with MemoryRouter for the Link.

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartSummary } from './CartSummary'

// ── Helpers ───────────────────────────────────────────────────────
function renderSummary({ subtotal = 0, isEmpty = false } = {}) {
  return render(
    <MemoryRouter>
      <CartSummary subtotal={subtotal} isEmpty={isEmpty} />
    </MemoryRouter>
  )
}

// ── Tests ─────────────────────────────────────────────────────────
describe('CartSummary', () => {
  it('renders Order Summary heading', () => {
    renderSummary()
    expect(screen.getByText(/order summary/i)).toBeInTheDocument()
  })

  it('shows $0.00 subtotal when subtotal is 0', () => {
    renderSummary({ subtotal: 0 })
    // Multiple $0.00 values expected (subtotal, tax, total all zero)
    const zeros = screen.getAllByText('$0.00')
    expect(zeros.length).toBeGreaterThan(0)
  })

  it('renders the given subtotal', () => {
    // 100.00 passed as subtotal
    renderSummary({ subtotal: 100 })
    expect(screen.getByText('$100.00')).toBeInTheDocument()
  })

  it('shows "Free" for shipping', () => {
    renderSummary({ subtotal: 100 })
    expect(screen.getByText(/free/i)).toBeInTheDocument()
  })

  it('calculates 10% tax correctly', () => {
    // Tax = 100 × 0.10 = $10.00
    renderSummary({ subtotal: 100 })
    expect(screen.getByText('$10.00')).toBeInTheDocument()
  })

  it('calculates total = subtotal + tax', () => {
    // Total = 100.00 + 10.00 = $110.00
    renderSummary({ subtotal: 100 })
    expect(screen.getByText('$110.00')).toBeInTheDocument()
  })

  it('renders the checkout link with correct href when cart is not empty', () => {
    renderSummary({ subtotal: 100, isEmpty: false })
    const link = screen.getByRole('link', { name: /proceed to checkout/i })
    expect(link).toHaveAttribute('href', '/checkout')
  })

  it('checkout link href is "#" when cart is empty', () => {
    renderSummary({ subtotal: 0, isEmpty: true })
    const link = screen.getByRole('link', { name: /proceed to checkout/i })
    expect(link).toHaveAttribute('href', '#')
  })

  it('checkout link has aria-disabled when cart is empty', () => {
    renderSummary({ subtotal: 0, isEmpty: true })
    const link = screen.getByRole('link', { name: /proceed to checkout/i })
    expect(link).toHaveAttribute('aria-disabled', 'true')
  })
})
