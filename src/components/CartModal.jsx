import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import BookCover from './BookCover'
import Button from './Button'
import CategoryCarousel from './CategoryCarousel'
import FEATURED_CATEGORIES from '../config/featuredCategories'
import useCart from '../hooks/useCart'

function CartModal() {
  const { items, isOpen, closeCart, removeItem } = useCart()
  const navigate = useNavigate()
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeCart()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeCart, isOpen])

  const handleClose = () => {
    closeCart()
  }

  const handleProceed = () => {
    closeCart()
    navigate('/payment')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/55 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && handleClose()}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-background shadow-2xl sm:rounded-3xl"
      >
        <header className="flex items-center justify-between border-b border-charcoal/10 px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal">Your selection</p>
            <h2 id="cart-title" className="mt-1 font-display text-3xl text-primary">Reservation cart</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-charcoal/60 text-xl text-charcoal transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            aria-label="Close reservation cart"
          >
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <div className="overflow-y-auto px-5 py-10 sm:px-7">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal/10 text-teal">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z" />
                <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
              </svg>
            </div>
            <h3 className="mt-5 font-display text-3xl text-primary">Your cart is waiting</h3>
            <p className="mt-2 text-charcoal/75">Reserve a book and it will appear here.</p>
            <div className="mt-8 border-t border-charcoal/10 pt-6 text-left">
              <CategoryCarousel category={FEATURED_CATEGORIES[0]} onBookClick={handleClose} />
            </div>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2 sm:px-7">
              <ul className="divide-y divide-charcoal/10">
                {items.map((book) => (
                  <li key={book.id} className="flex gap-4 py-5">
                    <BookCover coverId={book.coverId} title={book.title} size="M" className="h-28 w-[74px] shrink-0 overflow-hidden rounded-lg shadow-sm" />
                    <div className="min-w-0 flex-1 py-1">
                      <h3 className="line-clamp-2 font-display text-xl leading-tight text-primary">{book.title}</h3>
                      <p className="mt-1 line-clamp-1 text-sm font-semibold text-charcoal/75">{book.authors.join(', ')}</p>
                      <button type="button" onClick={() => removeItem(book.id)} className="mt-4 text-sm font-extrabold text-burgundy underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy">
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <footer className="border-t border-charcoal/10 bg-white/45 px-5 py-5 sm:px-7">
              <div className="mb-4 flex items-center justify-between text-sm font-bold text-charcoal/75">
                <span>{items.length} {items.length === 1 ? 'book' : 'books'}</span>
                <span>Payment at next step</span>
              </div>
              <Button onClick={handleProceed} className="w-full">Proceed to payment</Button>
            </footer>
          </>
        )}
      </section>
    </div>
  )
}

export default CartModal
