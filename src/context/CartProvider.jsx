import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import CartContext from './CartContext'

const STORAGE_KEY = 'lumora-reservation-cart'
const RESERVATIONS_STORAGE_KEY = 'lumora-confirmed-reservations'
const createReservationCode = () => `LUM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

function getSavedItems(key) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(key))

    if (!Array.isArray(saved)) return []

    return saved
      .filter((item) => item && (typeof item.id === 'string' || typeof item.id === 'number'))
      .map((item) => ({
        ...item,
        id: String(item.id),
        title: typeof item.title === 'string' && item.title.trim() ? item.title : 'Untitled book',
        authors: Array.isArray(item.authors) && item.authors.length
          ? item.authors.filter((author) => typeof author === 'string')
          : ['Unknown author'],
        coverId: typeof item.coverId === 'number' ? item.coverId : null,
      }))
  } catch {
    return []
  }
}

function CartProvider({ children }) {
  const [items, setItems] = useState(() => getSavedItems(STORAGE_KEY))
  const [reservations, setReservations] = useState(() => (
    getSavedItems(RESERVATIONS_STORAGE_KEY).map((item) => ({
      ...item,
      reservationCode: item.reservationCode ?? createReservationCode(),
    }))
  ))
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    window.localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations))
  }, [reservations])

  const value = useMemo(() => ({
    items,
    reservations,
    isOpen,
    addItem: (book) => setItems((current) => (
      current.some((item) => item.id === book.id) ? current : [...current, book]
    )),
    removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    clearCart: () => setItems([]),
    confirmReservation: (reservationCode = createReservationCode()) => {
      setReservations((current) => [
        ...current,
        ...items
          .filter((item) => !current.some((reservation) => reservation.id === item.id))
          .map((item) => ({ ...item, reservationCode })),
      ])
      setItems([])
    },
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  }), [isOpen, items, reservations])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default CartProvider
