import PropTypes from 'prop-types'
import BookCard from './BookCard'

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 xl:grid-cols-4" aria-label="Loading books" aria-busy="true">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[2/3] rounded-2xl bg-charcoal/10" />
          <div className="mt-4 h-6 w-4/5 rounded bg-charcoal/10" />
          <div className="mt-2 h-4 w-3/5 rounded bg-charcoal/10" />
        </div>
      ))}
    </div>
  )
}

function BookGallery({ books, status, onRetry }) {
  if (status === 'loading') return <GallerySkeleton />

  if (status === 'error') {
    return (
      <div className="rounded-3xl border border-burgundy/15 bg-white/60 px-6 py-14 text-center" role="alert">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-burgundy/10 text-2xl text-burgundy">!</div>
        <h2 className="mt-5 font-display text-3xl text-primary">We lost our place</h2>
        <p className="mx-auto mt-2 max-w-md text-charcoal/75">The library could not be reached. Check your connection and try once more.</p>
        <button type="button" onClick={onRetry} className="mt-6 rounded-button bg-highlight px-button py-3 font-bold text-on-primary transition hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight">
          Try again
        </button>
      </div>
    )
  }

  if (!books.length) {
    return (
      <div className="rounded-3xl border border-teal/15 bg-white/60 px-6 py-14 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal/10 text-teal">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z" />
            <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
          </svg>
        </div>
        <h2 className="mt-5 font-display text-3xl text-primary">No books on this shelf</h2>
        <p className="mx-auto mt-2 max-w-md text-charcoal/75">Try a different title or remove one of your filters to discover more reads.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 xl:grid-cols-4">
      {books.map((book) => <BookCard key={book.id} book={book} />)}
    </div>
  )
}

BookGallery.propTypes = {
  books: PropTypes.arrayOf(PropTypes.object).isRequired,
  status: PropTypes.oneOf(['loading', 'success', 'error']).isRequired,
  onRetry: PropTypes.func.isRequired,
}

export default BookGallery
