export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* NEW: Animated grid + scanlines */}
      <div className="auth-grid-bg" />
      <div className="scanlines" />

      {/* Ambient glow blobs */}
      <div
        style={{
          position: 'fixed',
          top: '-15%',
          left: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-10%',
          right: '-5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
  style={{
    position: 'absolute',
    top: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
    textAlign: 'center',
  }}
>
  <h1
    style={{
      margin: 0,
      fontFamily: "'Rajdhani', sans-serif",
      fontSize: '5.2rem',
      fontWeight: 700,
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      background: 'linear-gradient(90deg, #6366f1, #a855f7)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  >
    Gamer Vault
  </h1>

  <span
    style={{
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '0.65rem',
      color: 'var(--muted)',
      letterSpacing: '0.2em',
    }}
  >
    secure credential system
  </span>
</div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          padding: '2rem',
          borderRadius: 12,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* System label */}
        <div style={{ marginBottom: '1rem' }}>
          <span
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
           
          </span>
        </div>

       <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
  <div
    style={{
      width: 56,
      height: 56,
      borderRadius: 14,
      background: 'linear-gradient(135deg, #6366f1, #a855f7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 20px rgba(99,102,241,0.5)',
    }}
  >
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0
           013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824
           10.29 9 11.623 5.176-1.332 9-6.03 9-11.622
           0-1.31-.21-2.571-.598-3.751h-.152c-3.196
           0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  </div>
</div>



        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '1.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: 'linear-gradient(90deg, #e2e4f0, #a8b0c8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  )
}