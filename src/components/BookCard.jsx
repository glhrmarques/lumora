import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import BookCover from './BookCover'

function BookCard({ book }) {
  return (
    <article className="group min-w-0">
      <Link
        to={`/books/${book.id}`}
        state={{ book }}
        className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
        aria-label={`View details for ${book.title}`}
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-burgundy/10 shadow-[0_12px_30px_rgba(61,61,61,0.12)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_38px_rgba(61,61,61,0.2)]">
          <BookCover coverId={book.coverId} title={book.title} className="h-full w-full" />
          {book.firstPublished && (
            <span className="absolute bottom-3 right-3 rounded-full bg-ivory/95 px-2.5 py-1 text-xs font-extrabold text-charcoal shadow-sm">
              {book.firstPublished}
            </span>
          )}
        </div>
        <h3 className="mt-4 line-clamp-2 font-display text-xl leading-tight text-primary transition group-hover:text-highlight sm:text-2xl">
          {book.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm font-semibold text-charcoal/75">
          {book.authors.join(', ')}
        </p>
      </Link>
    </article>
  )
}

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    authors: PropTypes.arrayOf(PropTypes.string).isRequired,
    coverId: PropTypes.number,
    firstPublished: PropTypes.number,
  }).isRequired,
}

export default BookCard
