import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'

/*
  RegisterPage.jsx
  ================
  New account creation with:
  - Email + password registration
  - Google sign-up (same flow as login — Firebase handles both)
  - Password strength indicator
  - Confirm password check
  - All the same validation patterns as LoginPage
*/
export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: ''
  })
  const [errors, setErrors]       = useState({})
  const [authError, setAuthError] = useState('')
  const [loading, setLoading]     = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (authError) setAuthError('')
  }

  // Password strength — returns 0-4
  // This gives users real-time feedback and nudges them toward stronger passwords.
  const getPasswordStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8)              score++ // Length
    if (/[A-Z]/.test(pwd))            score++ // Uppercase
    if (/[0-9]/.test(pwd))            score++ // Number
    if (/[^A-Za-z0-9]/.test(pwd))    score++ // Special character
    return score
  }

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = [
    '',
    'bg-red-500',
    'bg-amber-500',
    'bg-yellow-400',
    'bg-green-500',
  ]

  const passwordStrength = getPasswordStrength(formData.password)

  const validate = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (passwordStrength < 2) {
      newErrors.password = 'Password is too weak — add uppercase letters, numbers, or symbols'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      await register(formData.email, formData.password)
      navigate('/') // New account created — go straight to the vault
    } catch (err) {
      setAuthError(getFriendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
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
      title="Create your vault"
      subtitle="Store your gaming credentials securely"
    >
      {authError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30
                        rounded-lg text-red-400 text-sm" role="alert">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

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

        {/* Password with strength indicator */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password"
                 className="text-sm font-medium text-vault-muted">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={loading}
              className={`input-field pr-12
                ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         text-vault-muted hover:text-white transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={2}>
                {showPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244
                       19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228
                       6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162
                       10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228
                       6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21
                       21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242
                       4.242L9.88 9.88" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36
                         4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431
                         0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638
                         0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </>
                )}
              </svg>
            </button>
          </div>

          {/* 
            Password strength bar — shows once the user starts typing.
            4 segments, coloured based on score. Gives instant feedback
            without requiring the user to read a list of rules.
          */}
          {formData.password && (
            <div className="mt-1">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all duration-300
                      ${passwordStrength >= level
                        ? strengthColors[passwordStrength]
                        : 'bg-vault-border'}`}
                  />
                ))}
              </div>
              <p className={`text-xs transition-colors ${
                passwordStrength <= 1 ? 'text-red-400' :
                passwordStrength === 2 ? 'text-amber-400' :
                passwordStrength === 3 ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {strengthLabels[passwordStrength]}
              </p>
            </div>
          )}

          {errors.password && (
            <p className="text-red-400 text-xs" role="alert">{errors.password}</p>
          )}
        </div>

        <FormInput
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-1"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Creating vault...
            </>
          ) : (
            'Create vault'
          )}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-vault-border" />
        <span className="text-vault-muted text-xs">or continue with</span>
        <div className="flex-1 h-px bg-vault-border" />
      </div>

      <button
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="btn-ghost w-full flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign up with Google
      </button>

      <p className="text-center text-sm text-vault-muted mt-6">
        Already have an account?{' '}
        <Link to="/login"
              className="text-vault-accent hover:text-vault-accent-hover
                         font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

function getFriendlyError(code) {
  const messages = {
    'auth/email-already-in-use':   'An account with this email already exists.',
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/weak-password':          'Password is too weak. Please choose a stronger one.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-blocked':          'Popup was blocked. Please allow popups for this site.',
  }
  return messages[code] ?? 'Something went wrong. Please try again.'
}