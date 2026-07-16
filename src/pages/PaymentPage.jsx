import { useState } from 'react'
import { Link } from 'react-router-dom'
import { processMockPayment } from '../api/payment'
import BookCover from '../components/BookCover'
import Button from '../components/Button'
import useCart from '../hooks/useCart'

const SAVED_PAYMENT = {
  cardholder: 'Jamie Morgan',
  cardNumber: '4242 4242 4242 4242',
  expiration: '08/29',
  cvv: '123',
  billingAddress: '140 Library Lane, Portland, OR 97205',
}

const fieldClassName = 'mt-2 h-12 w-full rounded-xl border border-charcoal/60 bg-white px-4 font-semibold text-charcoal outline-none transition placeholder:text-charcoal/75 focus:border-teal focus:ring-4 focus:ring-teal/20 disabled:cursor-default disabled:bg-charcoal/[0.04] disabled:text-charcoal/75'

function PaymentPage() {
  const { items, confirmReservation } = useCart()
  const [payment, setPayment] = useState(SAVED_PAYMENT)
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [confirmationId, setConfirmationId] = useState('')

  const updateField = (field, value) => {
    setPayment((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const result = await processMockPayment(payment)
      confirmReservation(result.confirmationId)
      setConfirmationId(result.confirmationId)
      setStatus('success')
    } catch (paymentError) {
      setError(paymentError.message)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-5 pb-32 pt-10">
        <section className="w-full max-w-xl rounded-3xl border border-teal/15 bg-white/60 px-6 py-14 text-center shadow-sm sm:px-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal text-3xl text-ivory">✓</div>
          <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.18em] text-teal">Payment confirmed</p>
          <h1 className="mt-2 font-display text-5xl leading-display text-primary">Reservation complete</h1>
          <p className="mx-auto mt-4 max-w-md leading-7 text-charcoal/75">Your payment was approved and your books are now reserved.</p>
          <p className="mt-4 text-sm font-bold text-charcoal/75">Confirmation {confirmationId}</p>
          <Link to="/reservations" className="mt-8 inline-flex h-button items-center justify-center rounded-button bg-highlight px-button font-bold text-on-primary transition hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight">
            View reservations
          </Link>
        </section>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-5 pb-32 pt-10">
        <section className="w-full max-w-xl rounded-3xl border border-charcoal/10 bg-white/55 px-6 py-14 text-center">
          <h1 className="font-display text-5xl text-primary">Nothing to pay for</h1>
          <p className="mt-3 text-charcoal/75">Add a book to your reservation cart before continuing to payment.</p>
          <Link to="/" className="mt-7 inline-flex h-button items-center justify-center rounded-button bg-highlight px-button font-bold text-on-primary transition hover:bg-primary">Browse books</Link>
        </section>
      </main>
    )
  }

  const total = (items.length * 2).toFixed(2)

  return (
    <main className="min-h-screen bg-background px-5 pb-32 pt-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 rounded-lg font-bold text-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal">
          <span aria-hidden="true">←</span> Back to library
        </Link>

        <header className="mt-8 max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal">Secure checkout</p>
          <h1 className="mt-2 font-display text-5xl leading-display text-primary sm:text-7xl">Confirm payment</h1>
          <p className="mt-4 leading-7 text-charcoal/75">Review your saved payment method before completing this reservation.</p>
        </header>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-charcoal/10 bg-white/60 p-5 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-teal">
                  <span className="h-2 w-2 rounded-full bg-teal" /> Saved payment method
                </span>
                <h2 className="mt-4 font-display text-3xl text-primary">Credit card</h2>
              </div>
              <button type="button" onClick={() => setIsEditing((value) => !value)} disabled={status === 'loading'} className="text-sm font-extrabold text-teal underline-offset-4 hover:underline disabled:opacity-50">
                {isEditing ? 'Done editing' : 'Edit'}
              </button>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2 text-sm font-bold text-charcoal">
                Cardholder name
                <input value={payment.cardholder} onChange={(event) => updateField('cardholder', event.target.value)} disabled={!isEditing || status === 'loading'} className={fieldClassName} autoComplete="cc-name" />
              </label>
              <label className="sm:col-span-2 text-sm font-bold text-charcoal">
                Card number
                <input value={isEditing ? payment.cardNumber : '•••• •••• •••• 4242'} onChange={(event) => updateField('cardNumber', event.target.value)} disabled={!isEditing || status === 'loading'} className={fieldClassName} inputMode="numeric" autoComplete="cc-number" />
              </label>
              <label className="text-sm font-bold text-charcoal">
                Expiration date
                <input value={payment.expiration} onChange={(event) => updateField('expiration', event.target.value)} disabled={!isEditing || status === 'loading'} className={fieldClassName} placeholder="MM/YY" autoComplete="cc-exp" />
              </label>
              <label className="text-sm font-bold text-charcoal">
                CVV <span className="font-normal text-charcoal/75">(optional)</span>
                <input value={isEditing ? payment.cvv : '•••'} onChange={(event) => updateField('cvv', event.target.value)} disabled={!isEditing || status === 'loading'} className={fieldClassName} inputMode="numeric" autoComplete="cc-csc" />
              </label>
              <label className="sm:col-span-2 text-sm font-bold text-charcoal">
                Billing address <span className="font-normal text-charcoal/75">(optional)</span>
                <input value={payment.billingAddress} onChange={(event) => updateField('billingAddress', event.target.value)} disabled={!isEditing || status === 'loading'} className={fieldClassName} autoComplete="street-address" />
              </label>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-burgundy/15 bg-burgundy/10 p-4 text-sm font-bold text-burgundy" role="alert">{error}</div>
            )}

            <Button type="submit" disabled={status === 'loading'} className="mt-8 w-full">
              {status === 'loading' ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" aria-hidden="true" />
                  Processing payment…
                </span>
              ) : `Confirm payment · $${total}`}
            </Button>
            <p className="mt-3 text-center text-xs font-semibold text-charcoal/75">Prototype only. No real payment will be processed.</p>
          </form>

          <aside className="rounded-3xl bg-primary p-6 text-ivory lg:sticky lg:top-8" aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="font-display text-3xl">Reservation summary</h2>
            <ul className="mt-5 divide-y divide-ivory/15">
              {items.map((book) => (
                <li key={book.id} className="flex gap-3 py-4 first:pt-0">
                  <BookCover coverId={book.coverId} title={book.title} size="S" className="h-20 w-14 shrink-0 overflow-hidden rounded-md" />
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 font-display text-lg leading-tight">{book.title}</h3>
                    <p className="mt-1 line-clamp-1 text-xs font-semibold text-ivory/70">{book.authors.join(', ')}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-ivory/20 pt-5 font-bold">
              <span>Reservation fee</span>
              <span>${total}</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default PaymentPage
