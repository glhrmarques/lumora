const API_BASE_URL = 'https://openlibrary.org'
const COVER_BASE_URL = 'https://covers.openlibrary.org/b/id'

const escapeQueryValue = (value) => value.replace(/[\\"]/g, '\\$&').trim()

const makeGroup = (field, values) => {
  if (!values.length) return null
  return `(${values.map((value) => `${field}:${value}`).join(' OR ')})`
}

export function buildSearchQuery(searchTerm, filters) {
  const clauses = []
  const title = escapeQueryValue(searchTerm)

  if (title) clauses.push(`title:"${title}"`)

  const genre = makeGroup('subject_key', filters.genre)

  if (genre) clauses.push(genre)

  return clauses.length ? clauses.join(' AND ') : 'subject_key:fiction'
}

export async function searchBooks(query, { signal, limit = 20 } = {}) {
  const params = new URLSearchParams({
    q: query,
    fields: 'key,title,author_name,cover_i,first_publish_year,edition_count',
    limit: String(limit),
  })

  const response = await fetch(`${API_BASE_URL}/search.json?${params}`, { signal })

  if (!response.ok) {
    throw new Error(`Open Library request failed with status ${response.status}`)
  }

  const data = await response.json()

  return {
    total: data.numFound ?? data.num_found ?? 0,
    books: (data.docs ?? []).map((book) => ({
      id: book.key.replace('/works/', ''),
      title: book.title,
      authors: book.author_name ?? ['Unknown author'],
      coverId: book.cover_i ?? null,
      firstPublished: book.first_publish_year ?? null,
      editionCount: book.edition_count ?? null,
    })),
  }
}

export async function getBookDetails(id, { signal } = {}) {
  const response = await fetch(`${API_BASE_URL}/works/${id}.json`, { signal })

  if (!response.ok) {
    throw new Error(`Unable to load this book (${response.status})`)
  }

  const book = await response.json()
  const description = typeof book.description === 'string'
    ? book.description
    : book.description?.value

  return {
    id,
    title: book.title,
    description: description ?? 'No description is available for this title yet.',
    coverId: book.covers?.find((cover) => cover > 0) ?? null,
    subjects: book.subjects?.slice(0, 8) ?? [],
  }
}

export function getCoverUrl(coverId, size = 'L') {
  return coverId ? `${COVER_BASE_URL}/${coverId}-${size}.jpg` : null
}
