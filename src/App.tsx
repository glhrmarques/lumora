import { useEffect, useMemo, useState } from 'react'

type Book = {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number
  first_publish_year?: number
}

type SearchResponse = {
  docs: Book[]
  numFound: number
}

type Work = {
  title: string
  description?: string | { value: string }
  covers?: number[]
  first_publish_date?: string
  subjects?: string[]
}

const SEARCH_FIELDS = 'key,title,author_name,cover_i,first_publish_year'
const DEFAULT_QUERY = 'subject:fiction'

function coverUrl(coverId: number | undefined, size: 'M' | 'L' = 'L') {
  return coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg?default=false`
    : undefined
}

function workIdFromPath() {
  const match = window.location.pathname.match(/^\/books\/([^/]+)$/)
  return match ? decodeURIComponent(match[1]) : null
}

function useDebouncedValue(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay)
    return () => window.clearTimeout(timeout)
  }, [delay, value])

  return debouncedValue
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function BookCover({ book, eager = false }: { book: Book; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  const src = coverUrl(book.cover_i)

  return (
    <div className="relative aspect-[2/3] overflow-hidden rounded-[0.35rem] bg-secondary/12 shadow-[0_10px_28px_rgba(61,61,61,0.14)]">
      {src && !failed ? (
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          src={src}
          alt={`Cover of ${book.title}`}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center bg-[linear-gradient(145deg,var(--color-deep-burgundy),var(--color-burnt-sienna))] p-4 text-center text-warm-ivory">
          <span className="font-display text-4xl" aria-hidden="true">{book.title.charAt(0)}</span>
          <span className="mt-3 line-clamp-3 text-xs font-bold tracking-wide uppercase">{book.title}</span>
        </div>
      )}
    </div>
  )
}

function BookCard({ book, onSelect, eager }: { book: Book; onSelect: (book: Book) => void; eager: boolean }) {
  return (
    <button
      className="group min-w-0 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      type="button"
      onClick={() => onSelect(book)}
      aria-label={`View ${book.title}`}
    >
      <BookCover book={book} eager={eager} />
      <h3 className="mt-3 line-clamp-2 font-display text-lg leading-[1.12] font-bold text-primary sm:text-2xl">
        {book.title}
      </h3>
      {book.author_name?.[0] && (
        <p className="mt-1 truncate text-xs font-semibold text-foreground/65 sm:text-sm">
          {book.author_name[0]}
        </p>
      )}
    </button>
  )
}

function BookSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="aspect-[2/3] rounded-[0.35rem] bg-foreground/10" />
      <div className="mt-3 h-5 w-4/5 rounded bg-foreground/10" />
      <div className="mt-2 h-3 w-2/5 rounded bg-foreground/10" />
    </div>
  )
}

function HomePage({ onSelect }: { onSelect: (book: Book) => void }) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query.trim(), 400)
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resultCount, setResultCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const searchTerm = debouncedQuery || DEFAULT_QUERY
    const params = new URLSearchParams({
      q: searchTerm,
      fields: SEARCH_FIELDS,
      limit: '30',
    })

    async function searchBooks() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`https://openlibrary.org/search.json?${params}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('The library could not be reached.')
        const data = (await response.json()) as SearchResponse
        setBooks(data.docs.filter((book) => book.key && book.title))
        setResultCount(data.numFound)
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setError(requestError instanceof Error ? requestError.message : 'Something went wrong.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void searchBooks()
    return () => controller.abort()
  }, [debouncedQuery])

  const heading = debouncedQuery ? `Results for “${debouncedQuery}”` : 'This week’s picks'

  return (
    <main>
      <header className="border-b border-primary/12 bg-background">
        <div className="mx-auto max-w-5xl px-5 pt-8 pb-7 sm:px-10 sm:pt-12 sm:pb-10">
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-accent">Open a new chapter</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <h1 className="font-display text-[2.75rem] leading-none font-bold tracking-[-0.035em] text-primary sm:text-6xl">
              Lumora
            </h1>
            <p className="mb-1 hidden max-w-xs text-right text-sm leading-relaxed text-foreground/65 sm:block">
              Stories chosen for curious minds and quiet moments.
            </p>
          </div>

          <label className="relative mt-7 block sm:mt-9">
            <span className="sr-only">Search books by title or author</span>
            <span className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-foreground/45">
              <SearchIcon />
            </span>
            <input
              className="h-13 w-full rounded-full border border-primary/15 bg-white/55 pr-12 pl-12 text-base shadow-[0_8px_28px_rgba(107,39,55,0.06)] outline-none transition placeholder:text-foreground/45 focus:border-primary/45 focus:bg-white sm:h-14"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title or author"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer rounded-full px-2 py-1 text-xs font-bold text-primary hover:bg-primary/8"
                onClick={() => setQuery('')}
              >
                Clear
              </button>
            )}
          </label>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-9 sm:px-10 sm:py-12" aria-busy={loading}>
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-secondary">Fiction · Poetry · Memoir · Kids</p>
            <h2 className="mt-2 font-display text-3xl leading-tight font-bold text-primary sm:text-4xl">{heading}</h2>
          </div>
          {!loading && !error && (
            <p className="shrink-0 pb-1 text-xs font-bold text-foreground/45">
              {resultCount.toLocaleString()} found
            </p>
          )}
        </div>

        {error ? (
          <div className="rounded-2xl border border-accent/25 bg-accent/8 p-7 text-center">
            <p className="font-bold text-primary">We lost the page for a moment.</p>
            <p className="mt-1 text-sm text-foreground/65">{error} Try another search.</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-8 sm:gap-y-12">
            {Array.from({ length: 8 }, (_, index) => <BookSkeleton key={index} />)}
          </div>
        ) : books.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-8 sm:gap-y-12">
            {books.map((book, index) => (
              <BookCard key={`${book.key}-${index}`} book={book} onSelect={onSelect} eager={index < 4} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-display text-3xl font-bold text-primary">No books found</p>
            <p className="mt-2 text-sm text-foreground/60">Try a title, author, or a broader search.</p>
          </div>
        )}
      </section>
    </main>
  )
}

function BookDetail({ workId, initialBook, onBack }: { workId: string; initialBook?: Book; onBack: () => void }) {
  const [work, setWork] = useState<Work | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadWork() {
      setLoading(true)
      try {
        const response = await fetch(`https://openlibrary.org/works/${workId}.json`, { signal: controller.signal })
        if (!response.ok) throw new Error('Book details are unavailable.')
        setWork((await response.json()) as Work)
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setError(requestError instanceof Error ? requestError.message : 'Something went wrong.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadWork()
    return () => controller.abort()
  }, [workId])

  const description = useMemo(() => {
    if (!work?.description) return null
    return typeof work.description === 'string' ? work.description : work.description.value
  }, [work])

  const displayBook: Book = {
    key: `/works/${workId}`,
    title: work?.title || initialBook?.title || 'Book details',
    author_name: initialBook?.author_name,
    cover_i: work?.covers?.find((cover) => cover > 0) || initialBook?.cover_i,
    first_publish_year: initialBook?.first_publish_year,
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-primary/12">
        <div className="mx-auto flex h-20 max-w-5xl items-center px-5 sm:px-10">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-full py-2 pr-4 text-sm font-bold text-primary hover:bg-primary/7"
            onClick={onBack}
          >
            <span className="h-5 w-5"><ArrowIcon /></span>
            Back to books
          </button>
        </div>
      </header>

      <article className="mx-auto max-w-5xl px-5 py-10 sm:px-10 sm:py-16">
        {error && !initialBook ? (
          <div className="py-24 text-center">
            <h1 className="font-display text-4xl font-bold text-primary">Book not found</h1>
            <p className="mt-3 text-foreground/60">{error}</p>
          </div>
        ) : (
          <div className="grid gap-9 sm:grid-cols-[minmax(220px,0.75fr)_1.25fr] sm:gap-14">
            <div className="mx-auto w-full max-w-[320px] sm:max-w-none">
              <BookCover book={displayBook} eager />
            </div>
            <div className="self-center">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
                {displayBook.first_publish_year ? `First published ${displayBook.first_publish_year}` : 'From Open Library'}
              </p>
              <h1 className="mt-3 font-display text-4xl leading-[1.02] font-bold tracking-tight text-primary sm:text-6xl">
                {displayBook.title}
              </h1>
              {displayBook.author_name?.length && (
                <p className="mt-4 text-lg font-bold text-secondary">by {displayBook.author_name.join(', ')}</p>
              )}
              {loading ? (
                <div className="mt-8 space-y-3 animate-pulse" aria-label="Loading book details">
                  <div className="h-4 rounded bg-foreground/10" />
                  <div className="h-4 rounded bg-foreground/10" />
                  <div className="h-4 w-2/3 rounded bg-foreground/10" />
                </div>
              ) : description ? (
                <p className="mt-8 max-w-2xl whitespace-pre-line text-base leading-7 text-foreground/75">
                  {description.length > 900 ? `${description.slice(0, 900)}…` : description}
                </p>
              ) : (
                <p className="mt-8 text-foreground/55">No description is available for this edition yet.</p>
              )}
              {work?.subjects?.length && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {work.subjects.slice(0, 5).map((subject) => (
                    <span key={subject} className="rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-bold text-secondary">
                      {subject}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </article>
    </main>
  )
}

export default function App() {
  const [workId, setWorkId] = useState(workIdFromPath)
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(() => window.history.state?.book)

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      setWorkId(workIdFromPath())
      setSelectedBook(event.state?.book)
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function openBook(book: Book) {
    const keyParts = book.key.split('/').filter(Boolean)
    const id = keyParts[keyParts.length - 1]
    if (!id) return
    window.history.pushState({ book }, '', `/books/${encodeURIComponent(id)}`)
    setSelectedBook(book)
    setWorkId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goHome() {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.history.pushState({}, '', '/')
      setWorkId(null)
      setSelectedBook(undefined)
    }
  }

  return workId
    ? <BookDetail workId={workId} initialBook={selectedBook} onBack={goHome} />
    : <HomePage onSelect={openBook} />
}
