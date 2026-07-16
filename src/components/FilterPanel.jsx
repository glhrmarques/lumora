import PropTypes from 'prop-types'
import FILTER_GROUPS from '../config/filterOptions'

function FilterPanel({ filters, onToggle, onClear, activeCount }) {
  const genre = FILTER_GROUPS[0]

  return (
    <section className="mt-3 flex flex-wrap items-center gap-2" aria-label="Genre filters">
      {genre.options.map((option) => {
        const checked = filters.genre.includes(option.value)
        const inputId = `genre-${option.value}`

        return (
          <label
            key={option.value}
            htmlFor={inputId}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-bold transition focus-within:ring-2 focus-within:ring-teal focus-within:ring-offset-2 ${checked ? 'border-teal bg-teal text-ivory' : 'border-charcoal/60 bg-background text-charcoal hover:border-teal'}`}
          >
            <input
              id={inputId}
              type="checkbox"
              checked={checked}
              onChange={() => onToggle('genre', option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        )
      })}
      {activeCount > 0 && (
        <button type="button" onClick={onClear} className="ml-1 text-sm font-bold text-teal underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal">
          Clear
        </button>
      )}
    </section>
  )
}

FilterPanel.propTypes = {
  filters: PropTypes.shape({
    genre: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  activeCount: PropTypes.number.isRequired,
}

export default FilterPanel
