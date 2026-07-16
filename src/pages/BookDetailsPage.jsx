import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getBookDetails } from '../api/openLibrary'
import BookCover from '../components/BookCover'
import Button from '../components/Button'
import CartButton from '../components/CartButton'
import Toast from '../components/Toast'
import useCart from '../hooks/useCart'

function BookDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const summary = location.state?.book
  const { items, addItem, removeItem } = useCart()
  const [book, setBook] = useState(null)
  const [status, setStatus] = useState('loading')
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    getBookDetails(id, { signal: controller.signal })
      .then((details) => {
        setBook(details)
        setStatus('success')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setStatus('error')
      })

    return () => controller.abort()
  }, [id])

  const title = book?.title ?? summary?.title ?? 'Book details'
  const coverId = book?.coverId ?? summary?.coverId
  const isInCart = items.some((item) => item.id === id)

  const handleReserve = () => {
    addItem({
      id,
      title,
      coverId: coverId ?? null,
      authors: summary?.authors ?? ['Unknown author'],
      firstPublished: summary?.firstPublished ?? null,
    })
    setToastMessage('Book added to your reservation cart.')
  }

  const handleRemove = () => {
    removeItem(id)
    setToastMessage('Book removed from your reservation cart.')
  }

  return (
    <main className="min-h-screen bg-background px-5 pb-48 pt-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 rounded-lg font-bold text-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal">
            <span aria-hidden="true">←</span> Back to the library
          </Link>
          <CartButton />
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-[260px_1fr] lg:gap-14">
          <BookCover coverId={coverId} title={title} className="mx-auto aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-2xl shadow-[0_18px_42px_rgba(61,61,61,0.18)] md:max-w-[260px]" />

          <section className="self-center">
            {summary?.firstPublished && <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-highlight">First published {summary.firstPublished}</p>}
            <h1 className="mt-3 font-display text-5xl leading-display text-primary sm:text-7xl">{title}</h1>
            {summary?.authors && <p className="mt-4 text-lg font-bold text-charcoal/75">by {summary.authors.join(', ')}</p>}

            {status === 'loading' && (
              <div className="mt-10 space-y-3" aria-label="Loading book details" aria-busy="true">
                <div className="h-4 w-full animate-pulse rounded bg-charcoal/10" />
                <div className="h-4 w-11/12 animate-pulse rounded bg-charcoal/10" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-charcoal/10" />
              </div>
            )}

            {status === 'error' && (
              <p className="mt-10 rounded-2xl bg-burgundy/10 p-5 font-semibold text-burgundy" role="alert">We could not load the full description for this book.</p>
            )}

            {status === 'success' && (
              <>
                <p className="mt-10 max-w-2xl whitespace-pre-line text-base leading-8 text-charcoal/80">{book.description}</p>
                {book.subjects.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2" aria-label="Book subjects">
                    {book.subjects.map((subject) => (
                      <span key={subject} className="rounded-full bg-teal/10 px-3 py-1.5 text-sm font-bold text-teal">{subject}</span>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-20 z-20 border-t border-charcoal/10 bg-background/95 px-5 py-4 shadow-[0_-10px_30px_rgba(61,61,61,0.08)] backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-6xl justify-end">
          <Button
            variant={isInCart ? 'secondary' : 'primary'}
            onClick={isInCart ? handleRemove : handleReserve}
            className="w-full sm:w-auto sm:min-w-56"
          >
            {isInCart ? 'Remove book' : 'Reserve book'}
          </Button>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}
    </main>
  )
}

export default BookDetailsPage
