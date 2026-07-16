import { useMemo, useState } from 'react'
import BookGallery from '../components/BookGallery'
import CartButton from '../components/CartButton'
import CategoryCarousel from '../components/CategoryCarousel'
import FilterPanel from '../components/FilterPanel'
import SearchBar from '../components/SearchBar'
import FEATURED_CATEGORIES from '../config/featuredCategories'
import useBooks from '../hooks/useBooks'
import useDebouncedValue from '../hooks/useDebouncedValue'
import useMediaQuery from '../hooks/useMediaQuery'

const EMPTY_FILTERS = { genre: [] }

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const debouncedSearch = useDebouncedValue(searchTerm, 400)
  const { books, total, status, retry } = useBooks(debouncedSearch, filters)
  const isDesktop = useMediaQuery('(min-width: 1280px)')
  const twoRowSize = isDesktop ? 8 : 4
  const firstBooks = books.slice(0, twoRowSize)
  const secondBooks = books.slice(twoRowSize, twoRowSize * 2)
  const remainingBooks = books.slice(twoRowSize * 2)

  const activeCount = useMemo(
    () => Object.values(filters).reduce((sum, values) => sum + values.length, 0),
    [filters],
  )

  const toggleFilter = (group, value) => {
    setFilters((current) => ({
      ...current,
      [group]: current[group].includes(value)
        ? current[group].filter((item) => item !== value)
        : [...current[group], value],
    }))
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <div className="relative z-0 border-b border-charcoal/10 bg-primary text-ivory">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-highlight/35 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-teal/50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <nav className="flex items-center justify-between" aria-label="Main navigation">
            <a href="/" className="font-display text-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory">Lumora Books</a>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-ivory/25 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-ivory/80 md:inline-flex">Open Library</span>
              <CartButton inverse />
            </div>
          </nav>
          <div className="mt-14 max-w-3xl sm:mt-20">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-highlight-on-dark">Find your next chapter</p>
            <h1 className="mt-4 font-display text-5xl leading-display sm:text-7xl lg:text-8xl">A library made for wandering.</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-32 sm:px-8 lg:px-12">
        <section className="relative z-10 -mt-8" aria-label="Search and filters">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            isDebouncing={searchTerm !== debouncedSearch}
          />
          <FilterPanel
            filters={filters}
            onToggle={toggleFilter}
            onClear={() => setFilters(EMPTY_FILTERS)}
            activeCount={activeCount}
          />
        </section>

        <section className="mt-12" aria-labelledby="gallery-heading" aria-live="polite">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-teal">The collection</p>
              <h2 id="gallery-heading" className="mt-1 font-display text-4xl text-primary sm:text-5xl">
                {debouncedSearch ? `Results for “${debouncedSearch}”` : 'Books worth opening'}
              </h2>
            </div>
            {status === 'success' && (
              <p className="hidden shrink-0 text-sm font-bold text-charcoal/75 sm:block">
                {total.toLocaleString()} {total === 1 ? 'match' : 'matches'}
              </p>
            )}
          </div>
          {status !== 'success' || books.length === 0 ? (
            <BookGallery books={books} status={status} onRetry={retry} />
          ) : (
            <div className="space-y-12">
              <BookGallery books={firstBooks} status="success" onRetry={retry} />

              <CategoryCarousel category={FEATURED_CATEGORIES[0]} />

              {secondBooks.length > 0 && (
                <BookGallery books={secondBooks} status="success" onRetry={retry} />
              )}

              <CategoryCarousel category={FEATURED_CATEGORIES[1]} />

              {remainingBooks.length > 0 && (
                <BookGallery books={remainingBooks} status="success" onRetry={retry} />
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default HomePage
