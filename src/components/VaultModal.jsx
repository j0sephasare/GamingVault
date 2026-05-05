import { useState, useEffect, useRef } from 'react'
import { GAMES, getGameById, getGameImageSrc } from '../utils/games'

export default function VaultModal({ mode, entry, presetGame, onClose, onSave, saving }) {
  const isReadOnly = mode === 'view'
  const presetGameObj = presetGame ? getGameById(presetGame) : null

  const [formData, setFormData] = useState({
    game:     presetGame ?? entry?.game ?? GAMES[0].id,
    username: entry?.username ?? '',
    email:    entry?.email    ?? '',
    password: entry?.password ?? '',
    notes:    entry?.notes    ?? '',
  })
  const [errors, setErrors]             = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied]             = useState('')
  const firstRef                        = useRef(null)

  const selectedGame = getGameById(formData.game)

  useEffect(() => {
    const t = setTimeout(() => firstRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !saving) onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, saving])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!formData.game)                        e.game = 'Select a game'
    if (!formData.username && !formData.email) e.username = 'Enter a username or email'
    if (!formData.password)                    e.password = 'Password is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) { setErrors(v); return }
    onSave(formData)
  }

  const copy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(field)
      setTimeout(() => setCopied(''), 2000)
    } catch {}
  }

  const titles = { view: 'Account Details', add: 'Add Account', edit: 'Edit Account' }

  const accentColor = selectedGame?.color ?? '#6366f1'

  return (
    <div
      onClick={() => !saving && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease',
      }}
      role="dialog" aria-modal="true"
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 460,
          maxHeight: '90vh', overflowY: 'auto',
          background: 'var(--surface)',
          borderRadius: 14,
          border: `1px solid ${accentColor}44`,
          boxShadow: `0 0 60px ${accentColor}20, 0 24px 48px rgba(0,0,0,0.7)`,
          animation: 'fadeUp 0.25s cubic-bezier(0.4,0,0.2,1)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Top accent line in game colour */}
        <div style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }} />

        {/* Game banner — full bleed image if available */}
        {selectedGame && selectedGame.id !== 'other' && (
          <div style={{ position: 'relative', height: 80, overflow: 'hidden' }}>
            <img
              src={getGameImageSrc(selectedGame)}
              alt={selectedGame.name}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                objectPosition: 'center 30%',
                filter: 'brightness(0.45) saturate(1.2)',
              }}
              onError={e => { e.target.style.display = 'none' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(14,16,24,0.9) 0%, rgba(14,16,24,0.4) 100%)',
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 1.25rem',
            }}>
              <div style={{ flex: 1 }}>
                <p style={{
                  margin: 0,
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '1.15rem', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: '#fff',
                }}>{selectedGame.name}</p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: accentColor,
                             fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.1em',
                             textTransform: 'uppercase' }}>
                  {titles[mode]}
                </p>
              </div>
              <button
                onClick={onClose} disabled={saving}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#8892a4', transition: 'all 0.15s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.color = '#8892a4' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Header — shown when no game banner (other/unknown) */}
        {(!selectedGame || selectedGame.id === 'other') && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <p style={{ margin: 0, fontFamily: "'Rajdhani', sans-serif",
                          fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.06em',
                          textTransform: 'uppercase', color: 'var(--text)' }}>
                {titles[mode]}
              </p>
            </div>
            <button onClick={onClose} disabled={saving}
              style={{ padding: 6, borderRadius: 6, background: 'transparent',
                       border: '1px solid var(--border)', cursor: 'pointer',
                       color: 'var(--muted2)', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted2)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '1.25rem' }}>
          {isReadOnly ? (
            <ViewContent entry={entry} showPassword={showPassword}
                         setShowPassword={setShowPassword}
                         copied={copied} onCopy={copy} accentColor={accentColor} />
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Game selector — only show in add mode */}
              {mode === 'add' && (
                <div>
                  <label className="field-label">Platform</label>
                  <select
                    ref={firstRef}
                    name="game" value={formData.game}
                    onChange={handleChange} disabled={saving}
                    className="glow-input"
                    style={{ cursor: 'pointer' }}
                  >
                    {GAMES.map(g => (
                      <option key={g.id} value={g.id}
                              style={{ background: '#0e1018', color: '#e2e4f0' }}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                  {errors.game && <ErrMsg>{errors.game}</ErrMsg>}
                </div>
              )}

              {/* Username */}
              <div>
                <label className="field-label">
                  Username <Opt />
                </label>
                <input
                  ref={mode !== 'add' ? firstRef : null}
                  name="username" type="text"
                  placeholder="YourGamertag"
                  value={formData.username} onChange={handleChange}
                  disabled={saving} autoComplete="off"
                  className={`glow-input ${errors.username ? 'error' : ''}`}
                />
                {errors.username && <ErrMsg>{errors.username}</ErrMsg>}
              </div>

              {/* Email */}
              <div>
                <label className="field-label">Email <Opt /></label>
                <input
                  name="email" type="email"
                  placeholder="account@example.com"
                  value={formData.email} onChange={handleChange}
                  disabled={saving} autoComplete="off"
                  className="glow-input"
                />
              </div>

              {/* Password */}
              <div>
                <label className="field-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password} onChange={handleChange}
                    disabled={saving} autoComplete="new-password"
                    className={`glow-input ${errors.password ? 'error' : ''}`}
                    style={{ paddingRight: 42 }}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    style={{
                      position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--muted2)', padding: 4,
                    }}>
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && <ErrMsg>{errors.password}</ErrMsg>}
              </div>

              {/* Notes */}
              <div>
                <label className="field-label">Notes <Opt /></label>
                <textarea
                  name="notes"
                  placeholder="e.g. 2FA enabled, linked to Battle.net account..."
                  value={formData.notes} onChange={handleChange}
                  disabled={saving} rows={3}
                  className="glow-input"
                  style={{ resize: 'none', lineHeight: 1.5 }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.625rem', marginTop: '0.25rem' }}>
                <button type="button" onClick={onClose} disabled={saving}
                        className="btn-ghost" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                        className="btn-primary" style={{ flex: 1 }}>
                  {saving ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.3"/>
                        <path fill="currentColor" opacity="0.9"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Saving...
                    </>
                  ) : mode === 'add' ? 'Save Account' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* View mode footer — edit button */}
        {isReadOnly && (
          <div style={{ padding: '0 1.25rem 1.25rem' }}>
            <button
              onClick={() => onSave && onClose()}
              className="btn-ghost"
              style={{ width: '100%' }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── View mode content ──────────────────────────────────────── */
function ViewContent({ entry, showPassword, setShowPassword, copied, onCopy, accentColor }) {
  const fields = [
    { key: 'username', label: 'Username',      value: entry?.username },
    { key: 'email',    label: 'Email',          value: entry?.email    },
    { key: 'password', label: 'Password',       value: entry?.password, secret: true },
    { key: 'notes',    label: 'Notes',          value: entry?.notes    },
  ].filter(f => f.value)

  if (!fields.length) return (
    <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '1rem 0', fontSize: '0.875rem' }}>
      No details saved.
    </p>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {fields.map(({ key, label, value, secret }) => (
        <div key={key}>
          <p style={{ margin: '0 0 5px',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: '0.68rem', fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'var(--muted2)' }}>
            {label}
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--bg)', borderRadius: 8,
            border: '1px solid var(--border-glow)',
            padding: '9px 12px',
          }}>
            <span style={{
              flex: 1, fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.85rem', color: 'var(--text)', wordBreak: 'break-all',
            }}>
              {secret && !showPassword
                ? '•'.repeat(Math.min((value ?? '').length, 14))
                : value}
            </span>
            {secret && (
              <button onClick={() => setShowPassword(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer',
                         color: 'var(--muted2)', padding: '2px 4px', flexShrink: 0 }}>
                <EyeIcon open={showPassword} />
              </button>
            )}
            <button onClick={() => onCopy(value, key)}
              style={{
                background: copied === key ? '#22c55e22' : 'none',
                border: `1px solid ${copied === key ? '#22c55e55' : 'transparent'}`,
                borderRadius: 5, cursor: 'pointer',
                color: copied === key ? '#22c55e' : 'var(--muted2)',
                padding: '3px 6px', flexShrink: 0, transition: 'all 0.2s',
              }}>
              {copied === key ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 12.75l6 6 9-13.5"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

const Opt = () => (
  <span style={{ fontWeight: 400, fontSize: '0.65rem',
                 color: 'var(--muted)', marginLeft: 4, letterSpacing: '0.05em' }}>
    optional
  </span>
)

const ErrMsg = ({ children }) => (
  <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--red)' }} role="alert">
    {children}
  </p>
)

function EyeIcon({ open }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </>
      )}
    </svg>
  )
}