import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getCoverUrl } from '../api/openLibrary'

function CoverPlaceholder({ title }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-burgundy to-primary px-4 text-center text-ivory">
      <svg aria-hidden="true" viewBox="0 0 48 48" fill="none" className="h-10 w-10 opacity-80">
        <path d="M10 9.5A4.5 4.5 0 0 1 14.5 5H40v34H14.5A4.5 4.5 0 0 0 10 43.5v-34Z" stroke="currentColor" strokeWidth="2.5" />
        <path d="M10 39.5A4.5 4.5 0 0 1 14.5 35H40M17 13h15" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      <span className="mt-4 line-clamp-3 font-display text-xl leading-tight">{title}</span>
    </div>
  )
}

CoverPlaceholder.propTypes = { title: PropTypes.string.isRequired }

function BookCover({ coverId, title, size = 'L', className = '' }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [coverId])

  if (!coverId || failed) {
    return <div className={className}><CoverPlaceholder title={title} /></div>
  }

  return (
    <div className={className}>
      <img
        src={getCoverUrl(coverId, size)}
        alt={`Cover of ${title}`}
        onError={() => setFailed(true)}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  )
}

BookCover.propTypes = {
  coverId: PropTypes.number,
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['S', 'M', 'L']),
  className: PropTypes.string,
}

export default BookCover
