import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/*
  PrivateRoute is a "wrapper component" — it receives children (another component)
  and decides whether to render it or redirect.

  Usage in App.jsx:
    <Route path="/" element={<PrivateRoute><VaultPage /></PrivateRoute>} />

  Logic:
  - If user IS logged in  → render the children (VaultPage)
  - If user is NOT logged in → redirect to /login

*/
export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}