import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VaultPage from './pages/VaultPage'

/*
  App.jsx only handles routing — nothing else.
  
  Why AuthProvider wraps everything:
  Firebase auth state (is the user logged in?) needs to be accessible from
  any component in the app — the route guard, the navbar, the vault page.
  Putting AuthProvider at the top of the tree achieves this via React Context.
  
  Route structure:
  /login    → LoginPage (public)
  /register → RegisterPage (public)
  /         → VaultPage (private — redirects to /login if not authenticated)
  *         → any unknown URL redirects to /
*/
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes — accessible without being logged in */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 
          Private route — PrivateRoute checks if the user is authenticated.
          If yes, renders VaultPage. If no, redirects to /login.
          This is your security gate at the routing level.
        */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <VaultPage />
            </PrivateRoute>
          }
        />

        {/* Catch-all: any other URL goes to home (which checks auth itself) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}