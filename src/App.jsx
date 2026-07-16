import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BottomNavigation from './components/BottomNavigation'
import CartModal from './components/CartModal'
import CartProvider from './context/CartProvider'
import BookDetailsPage from './pages/BookDetailsPage'
import HomePage from './pages/HomePage'
import PaymentPage from './pages/PaymentPage'
import ReservationsPage from './pages/ReservationsPage'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetailsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNavigation />
        <CartModal />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
