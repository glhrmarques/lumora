import PropTypes from 'prop-types'

function SearchBar({ value, onChange, isDebouncing }) {
  return (
    <div className="relative z-20">
      <label htmlFor="book-search" className="sr-only">Search books by title</label>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/60"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
      <input
        id="book-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title..."
        autoComplete="off"
        className="h-16 w-full rounded-2xl border border-charcoal/60 bg-white pl-14 pr-14 text-base shadow-none outline-none transition placeholder:text-charcoal/75 focus:border-teal focus:shadow-none focus:ring-4 focus:ring-teal/20"
      />
      {isDebouncing && (
        <span className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin rounded-full border-2 border-teal/20 border-t-teal" aria-label="Preparing search" />
      )}
    </div>
  )
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isDebouncing: PropTypes.bool.isRequired,
}

export default SearchBar
