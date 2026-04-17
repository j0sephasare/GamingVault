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

  The { replace } prop on Navigate means the /login URL *replaces* the current
  history entry rather than pushing a new one. So when the user logs in and gets
  sent back, pressing Back won't loop them back to /login again.

  This is your first line of defence. Even if someone knows the URL of the vault,
  they can't access it without being authenticated.
*/
export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}