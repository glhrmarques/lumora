import { useEffect, useState } from 'react'
import { searchBooks } from '../api/openLibrary'

const categoryCache = new Map()

function fetchCategoryBooks(subject) {
  if (!categoryCache.has(subject)) {
    categoryCache.set(
      subject,
      searchBooks(`subject_key:${subject}`, { limit: 4 })
        .then((result) => result.books.slice(0, 4))
        .catch((error) => {
          categoryCache.delete(subject)
          throw error
        }),
    )
  }

  return categoryCache.get(subject)
}

export default function useCategoryBooks(subject) {
  const [books, setBooks] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let isActive = true
    setStatus('loading')

    fetchCategoryBooks(subject)
      .then((result) => {
        if (isActive) {
          setBooks(result)
          setStatus('success')
        }
      })
      .catch(() => {
        if (isActive) setStatus('error')
      })

    return () => {
      isActive = false
    }
  }, [subject])

  return { books, status }
}
