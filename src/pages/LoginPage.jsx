import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'

/*
  LoginPage.jsx
  =============
  Handles two sign-in methods:
  1. Email + password (Firebase Email Auth)
  2. Google (Firebase Google Auth — one-click)


  We use separate state variables for each concern:
  - formData:    the controlled input values
  - errors:      per-field validation errors (shown inline)
  - authError:   Firebase error after submission (shown at the top)
  - loading:     disables the button while Firebase is working

  VALIDATION STRATEGY:
  We validate on submit (not on every keystroke) to avoid annoying the user
  while they're still typing. The only exception is the confirm-password
  check which only makes sense after both fields are filled.
*/
export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors]     = useState({})
  const [authError, setAuthError] = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Single handler for all inputs — uses the input's name attribute
  // to know which field to update. Clears the field error as the user types.
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (authError)    setAuthError('')
  }

  // Client-side validation — runs before we even touch Firebase
  const validate = () => {
    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent browser's default form submission (page reload)

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return // Stop here — don't call Firebase with invalid data
    }

    try {
      setLoading(true)
      setAuthError('')
      await login(formData.email, formData.password)
      navigate('/') // Success — go to the vault
    } catch (err) {
      // Firebase returns error codes like "auth/user-not-found"
      // We translate these into friendly messages for the user
      setAuthError(getFriendlyError(err.code))
    } finally {
      // Always runs — re-enables the button whether login succeeded or failed
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setAuthError('')
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        // Don't show an error if the user just closed the popup — that's intentional
        setAuthError(getFriendlyError(err.code))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your gaming vault"
    >
      {/* Firebase / network error — shown at the top of the form */}
      {authError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30
                        rounded-lg text-red-400 text-sm" role="alert">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/*
          noValidate: disables the browser's built-in validation bubbles.
          We're doing our own validation with better UX, so we don't want both.
        */}

        <FormInput
          label="Email address"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          disabled={loading}
        />

        {/* Password field with show/hide toggle */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password"
                   className="text-sm font-medium text-vault-muted">
              Password
            </label>
            {/* Forgot password link — we'll wire this up with Firebase's
                sendPasswordResetEmail in a future enhancement */}
            <Link to="/forgot-password"
                  className="text-xs text-vault-accent hover:text-vault-accent-hover
                             transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={loading}
              className={`input-field pr-12
                ${errors.password
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : ''}`}
            />
            {/* Toggle button — sits inside the input using absolute positioning */}
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         text-vault-muted hover:text-white transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                // Eye-off icon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226
                       16.338 7.244 19.5 12 19.5c.993 0 1.953-.138
                       2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756
                       0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293
                       5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894
                       7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0
                       10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                // Eye icon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423
                       7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007
                       9.963 7.178.07.207.07.431 0 .639C20.577
                       16.49 16.64 19.5 12 19.5c-4.638
                       0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs" role="alert">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-1"
        >
          {loading ? (
            <>
              {/* Spinner — pure CSS, no library needed */}
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      {/* Divider between email and Google login */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-vault-border" />
        <span className="text-vault-muted text-xs">or continue with</span>
        <div className="flex-1 h-px bg-vault-border" />
      </div>

      {/* Google sign-in button */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="btn-ghost w-full flex items-center justify-center gap-3"
      >
        {/* Official Google "G" logo colours */}
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign in with Google
      </button>

      {/* Link to register — uses React Router Link (no page reload) */}
      <p className="text-center text-sm text-vault-muted mt-6">
        Don't have an account?{' '}
        <Link to="/register"
              className="text-vault-accent hover:text-vault-accent-hover
                         font-medium transition-colors">
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}

/*
  getFriendlyError(code)
  ----------------------
  Firebase error codes are technical strings like "auth/user-not-found".
  We translate these into human-readable messages.
  
  
*/
function getFriendlyError(code) {
  const messages = {
    'auth/user-not-found':       'Incorrect email or password.',
    'auth/wrong-password':       'Incorrect email or password.',
    // ^ Same message for both — don't confirm whether an email exists
    'auth/invalid-credential':   'Incorrect email or password.',
    'auth/too-many-requests':    'Too many failed attempts. Please try again later or reset your password.',
    'auth/user-disabled':        'This account has been disabled.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-blocked':        'Popup was blocked. Please allow popups for this site.',
    'auth/invalid-email':        'Please enter a valid email address.',
  }
  return messages[code] ?? 'Something went wrong. Please try again.'
}