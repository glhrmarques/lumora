import PropTypes from 'prop-types'

const variants = {
  primary:
    'border-transparent bg-highlight text-on-primary shadow-sm hover:bg-primary focus-visible:outline-highlight',
  secondary:
    'border-highlight bg-transparent text-highlight hover:bg-highlight hover:text-on-primary focus-visible:outline-highlight',
}

function Button({ variant = 'primary', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex h-button items-center justify-center rounded-button border-button px-button font-body text-button font-bold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary']),
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
}

export default Button
