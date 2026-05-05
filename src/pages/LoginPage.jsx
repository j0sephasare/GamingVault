import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (authError) setAuthError('')
  }

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
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setLoading(true)
      setAuthError('')
      await login(formData.email, formData.password)
      navigate('/')
    } catch (err) {
      setAuthError(getFriendlyError(err.code))
    } finally {
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
        setAuthError(getFriendlyError(err.code))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your vault"
    >
      {/* System label */}
      <div style={{ marginBottom: '0.5rem' }}>
        <span style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--muted)'
        }}>
           Authentication Required
        </span>
      </div>

      {/* Auth error */}
      {authError && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            borderRadius: 8,
            border: '1px solid rgba(239,68,68,0.4)',
            background: 'rgba(239,68,68,0.08)',
            color: '#f87171',
            fontSize: '0.85rem'
          }}
        >
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

        {/* Email */}
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
          className="glow-input"
        />

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              style={{
                fontSize: '0.8rem',
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--muted)'
              }}
            >
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs text-vault-accent hover:text-vault-accent-hover"
            >
              Forgot?
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
              className="glow-input pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-vault-muted hover:text-white"
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>

          {errors.password && (
            <p style={{ color: '#f87171', fontSize: '0.75rem' }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-1"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-vault-border" />
        <span className="text-vault-muted text-xs">or continue with</span>
        <div className="flex-1 h-px bg-vault-border" />
      </div>

      {/* Google */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="btn-primary w-full"
      >
        Continue with Google
      </button>

      {/* Register */}
      <p className="text-center text-sm text-vault-muted mt-6">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-vault-accent hover:text-vault-accent-hover"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}

/* Error helper */
function getFriendlyError(code) {
  const messages = {
    'auth/user-not-found': 'Incorrect email or password.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Try later.',
    'auth/user-disabled': 'Account disabled.',
    'auth/network-request-failed': 'Network error.',
    'auth/popup-blocked': 'Popup blocked.',
    'auth/invalid-email': 'Invalid email.',
  }

  return messages[code] ?? 'Something went wrong.'
}