import { useEffect } from 'react'
import PropTypes from 'prop-types'

function Toast({ message, onClose, duration = 3500 }) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(timeout)
  }, [duration, message, onClose])

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-5 top-5 z-[60] flex w-[calc(100%-2.5rem)] max-w-sm items-center gap-3 rounded-2xl border border-teal/20 bg-background px-4 py-3 text-charcoal shadow-[0_16px_45px_rgba(61,61,61,0.2)] sm:right-7 sm:top-7"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal text-lg font-bold text-ivory" aria-hidden="true">✓</span>
      <p className="min-w-0 flex-1 text-sm font-bold">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xl text-charcoal/75 transition hover:bg-charcoal/10 hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  )
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
}

export default Toast
