import { useRef } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import useCategoryBooks from '../hooks/useCategoryBooks'
import BookCover from './BookCover'

function CategoryCarousel({ category, onBookClick }) {
  const { books, status } = useCategoryBooks(category.subject)
  const trackRef = useRef(null)

  const scroll = (direction) => {
    trackRef.current?.scrollBy({
      left: direction * trackRef.current.clientWidth * 0.75,
      behavior: 'smooth',
    })
  }

  if (status === 'error') return null

  return (
    <section className="py-4" aria-labelledby={`${category.subject}-heading`}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-highlight">Featured shelf</p>
          <h2 id={`${category.subject}-heading`} className="mt-1 font-display text-3xl text-primary sm:text-4xl">{category.name}</h2>
        </div>
        <div className="flex gap-2" aria-label={`${category.name} carousel controls`}>
          <button type="button" onClick={() => scroll(-1)} className="grid h-10 w-10 place-items-center rounded-full border border-charcoal/60 bg-white/60 text-xl text-primary transition hover:border-teal hover:text-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal" aria-label={`Previous ${category.name} books`}>←</button>
          <button type="button" onClick={() => scroll(1)} className="grid h-10 w-10 place-items-center rounded-full border border-charcoal/60 bg-white/60 text-xl text-primary transition hover:border-teal hover:text-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal" aria-label={`Next ${category.name} books`}>→</button>
        </div>
      </div>

      <div ref={trackRef} className="grid snap-x snap-mandatory grid-flow-col auto-cols-[44%] gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[calc((100%-3rem)/4)]">
        {status === 'loading'
          ? Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="snap-start animate-pulse">
              <div className="aspect-[2/3] rounded-2xl bg-charcoal/10" />
              <div className="mt-3 h-5 w-4/5 rounded bg-charcoal/10" />
              <div className="mt-2 h-3 w-3/5 rounded bg-charcoal/10" />
            </div>
          ))
          : books.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              state={{ book }}
              onClick={onBookClick}
              className="group min-w-0 snap-start rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
            >
              <BookCover coverId={book.coverId} title={book.title} className="aspect-[2/3] w-full overflow-hidden rounded-2xl bg-burgundy/10 transition duration-300 group-hover:-translate-y-1" />
              <h3 className="mt-3 line-clamp-2 font-display text-lg leading-tight text-primary group-hover:text-highlight sm:text-xl">{book.title}</h3>
              <p className="mt-1 line-clamp-1 text-xs font-semibold text-charcoal/75 sm:text-sm">{book.authors.join(', ')}</p>
            </Link>
          ))}
      </div>
    </section>
  )
}

CategoryCarousel.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
  }).isRequired,
  onBookClick: PropTypes.func,
}

export default CategoryCarousel
