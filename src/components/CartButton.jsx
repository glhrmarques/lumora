import PropTypes from 'prop-types'
import useCart from '../hooks/useCart'

function CartButton({ inverse = false }) {
  const { items, openCart } = useCart()

  return (
    <button
      type="button"
      onClick={openCart}
      className={`relative inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${inverse ? 'border-ivory/25 bg-ivory/10 text-ivory hover:bg-ivory/20 focus-visible:outline-ivory' : 'border-charcoal/60 bg-white/70 text-primary hover:border-teal hover:text-teal focus-visible:outline-teal'}`}
      aria-label={`Open reservation cart with ${items.length} ${items.length === 1 ? 'book' : 'books'}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L20.5 8H6" />
        <circle cx="9.5" cy="19" r="1.25" />
        <circle cx="17" cy="19" r="1.25" />
      </svg>
      <span className="hidden sm:inline">Reservation cart</span>
      <span className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs ${inverse ? 'bg-highlight text-ivory' : 'bg-primary text-ivory'}`} aria-hidden="true">
        {items.length}
      </span>
    </button>
  )
}

CartButton.propTypes = {
  inverse: PropTypes.bool,
}

export default CartButton
