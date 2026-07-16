import { useEffect, useMemo, useState } from 'react'
import { buildSearchQuery, searchBooks } from '../api/openLibrary'

export default function useBooks(searchTerm, filters) {
  const [result, setResult] = useState({ books: [], total: 0 })
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [requestVersion, setRequestVersion] = useState(0)

  const query = useMemo(
    () => buildSearchQuery(searchTerm, filters),
    [filters, searchTerm],
  )

  useEffect(() => {
    const controller = new AbortController()

    async function loadBooks() {
      setStatus('loading')
      setError(null)

      try {
        const nextResult = await searchBooks(query, { signal: controller.signal })
        setResult(nextResult)
        setStatus('success')
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError)
          setStatus('error')
        }
      }
    }

    loadBooks()
    return () => controller.abort()
  }, [query, requestVersion])

  return {
    ...result,
    status,
    error,
    retry: () => setRequestVersion((version) => version + 1),
  }
}
