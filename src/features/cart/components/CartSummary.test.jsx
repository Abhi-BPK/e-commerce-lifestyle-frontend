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
    // CartSummary renders the word "Free" twice — once as the shipping
    // value (a styled <span>) and once inside the trust-note paragraph
    // ("Free shipping on all orders · Secure checkout"). We want to assert
    // the value, not the note, so we anchor with an exact-string match.
    renderSummary({ subtotal: 100 })
    expect(screen.getByText('Free')).toBeInTheDocument()
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

  it('checkout link does NOT navigate to /checkout when cart is empty', () => {
    // CartSummary uses `to={isEmpty ? '#' : ROUTES.CHECKOUT}`. React Router
    // does not render `to="#"` as a literal `href="#"` — it resolves it
    // against the current location, so the original assertion was brittle.
    // The meaningful guarantee is "the user is not sent to /checkout when
    // the cart is empty", which we assert directly. The aria-disabled test
    // below covers the accessibility side of the disabled state.
    renderSummary({ subtotal: 0, isEmpty: true })
    const link = screen.getByRole('link', { name: /proceed to checkout/i })
    expect(link).not.toHaveAttribute('href', '/checkout')
  })

  it('checkout link has aria-disabled when cart is empty', () => {
    renderSummary({ subtotal: 0, isEmpty: true })
    const link = screen.getByRole('link', { name: /proceed to checkout/i })
    expect(link).toHaveAttribute('aria-disabled', 'true')
  })
})
