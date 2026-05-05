import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    try { await logout(); navigate('/login') }
    catch (err) { console.error('Logout failed:', err) }
  }

  const initial = currentUser?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 40,
      borderBottom: '1px solid #1e2235',
      background: 'rgba(7,8,15,0.92)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Accent line across the very top */}
      <div style={{
        height: 2,
        background: 'linear-gradient(90deg, #6366f1, #a855f7, #6366f100)',
      }} />

      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '0 1.5rem',
        height: 58,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* ── WORDMARK ─────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Hex icon — stylised lock */}
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>

          {/* Text wordmark */}
          <div>
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: 'linear-gradient(90deg, #e2e4f0, #a8b0c8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
            }}>
              Gaming
            </span>
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: 'linear-gradient(90deg, #6366f1, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginLeft: '0.35rem',
              lineHeight: 1,
            }}>
              Vault
            </span>
          </div>

          {/* Status pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '2px 8px', borderRadius: 99,
            border: '1px solid rgba(34,197,94,0.3)',
            background: 'rgba(34,197,94,0.08)',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%', background: '#22c55e',
              boxShadow: '0 0 6px #22c55e',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.65rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#22c55e',
            }}>Secure</span>
          </div>
        </div>

        {/* ── USER MENU ─────────────────────────────────────── */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '5px 10px 5px 5px',
              borderRadius: 8,
              border: '1px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#1e2235'
              e.currentTarget.style.background = '#0e1018'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'transparent'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.9rem', fontWeight: 700, color: '#fff',
              flexShrink: 0,
            }}>
              {initial}
            </div>

            <span style={{
              fontSize: '0.8rem', color: '#6b7280',
              maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              display: window.innerWidth > 500 ? 'block' : 'none',
            }}>
              {currentUser?.email}
            </span>

            {/* Chevron */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                 stroke="#4b5368" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                 style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {/* Overlay to close */}
          {open && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                 onClick={() => setOpen(false)} />
          )}

          {/* Dropdown */}
          {open && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 220, zIndex: 50,
              background: '#0e1018',
              border: '1px solid #1e2235',
              borderRadius: 10,
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
              animation: 'fadeUp 0.15s ease',
            }}>
              <div style={{
                padding: '12px 14px',
                borderBottom: '1px solid #1e2235',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.06), transparent)',
              }}>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#4b5368',
                            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.08em',
                            textTransform: 'uppercase' }}>Signed in as</p>
                <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#e2e4f0',
                            fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' }}>
                  {currentUser?.email}
                </p>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', background: 'transparent', border: 'none',
                  cursor: 'pointer', color: '#6b7280',
                  fontFamily: "'Rajdhani', sans-serif", fontSize: '0.85rem',
                  fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                  textAlign: 'left', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#13161f'; e.currentTarget.style.color = '#ef4444' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}