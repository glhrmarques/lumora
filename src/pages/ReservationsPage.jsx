import { Link } from 'react-router-dom'
import BookCover from '../components/BookCover'
import CartButton from '../components/CartButton'
import useCart from '../hooks/useCart'

function ReservationsPage() {
  const { reservations } = useCart()
  const visibleReservations = Array.isArray(reservations)
    ? reservations.filter((book) => book?.id && book?.title)
    : []

  return (
    <main className="min-h-screen bg-background px-5 pb-32 pt-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-start justify-between gap-4 border-b border-charcoal/10 pb-8">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal">Your library</p>
            <h1 className="mt-2 font-display text-5xl leading-display text-primary sm:text-7xl">Reservations</h1>
          </div>
          <CartButton />
        </header>

        {visibleReservations.length === 0 ? (
          <section className="mt-12 rounded-3xl border border-teal/15 bg-white/55 px-6 py-16 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal/10 text-teal">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z" />
                <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
              </svg>
            </div>
            <h2 className="mt-6 font-display text-4xl text-primary">No reservations yet</h2>
            <p className="mx-auto mt-3 max-w-md leading-7 text-charcoal/75">Books you reserve will be collected here, ready for your next library visit.</p>
            <Link to="/" className="mt-7 inline-flex h-button items-center justify-center rounded-button bg-highlight px-button font-bold text-on-primary transition hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight">
              Browse books
            </Link>
          </section>
        ) : (
          <section className="mt-10" aria-labelledby="reserved-books-heading">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="reserved-books-heading" className="font-display text-3xl text-primary">Ready for pickup</h2>
                <p className="mt-1 text-sm font-semibold text-charcoal/75">Show the pickup code to a library employee.</p>
              </div>
              <p className="text-sm font-bold text-charcoal/75">{visibleReservations.length} {visibleReservations.length === 1 ? 'book' : 'books'}</p>
            </div>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {visibleReservations.map((book) => (
                <li key={book.id} className="flex gap-4 rounded-2xl border border-charcoal/10 bg-white/60 p-4 shadow-sm">
                  <BookCover coverId={book.coverId} title={book.title} size="M" className="h-32 w-[86px] shrink-0 overflow-hidden rounded-lg" />
                  <div className="min-w-0 py-1">
                    <span className="inline-flex rounded-full bg-teal/10 px-2.5 py-1 text-xs font-extrabold text-teal">Reserved</span>
                    <h3 className="mt-3 line-clamp-2 font-display text-xl leading-tight text-primary">{book.title}</h3>
                    <p className="mt-1 line-clamp-1 text-sm font-semibold text-charcoal/75">{Array.isArray(book.authors) ? book.authors.join(', ') : 'Unknown author'}</p>
                    <div className="mt-3 rounded-lg border border-dashed border-highlight/40 bg-highlight/10 px-3 py-2">
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-highlight">Pickup code</p>
                      <p className="mt-0.5 font-mono text-base font-extrabold tracking-wider text-primary">{book.reservationCode || 'Code pending'}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}

export default ReservationsPage
