export default function FormInput({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">

      {/* Label */}
      <label
        htmlFor={props.id || props.name}
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}
      >
        {label}
      </label>

      {/* Input */}
      <input
        id={props.id || props.name}
        {...props}
        className={`
          glow-input
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
      />

      {/* Error */}
      {error && (
        <p
          role="alert"
          style={{
            color: '#f87171',
            fontSize: '0.7rem',
            fontFamily: "'Share Tech Mono', monospace",
            marginTop: '2px',
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}