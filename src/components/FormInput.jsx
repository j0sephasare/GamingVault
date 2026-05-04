export default function FormInput({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
 
      {/* Label — htmlFor links it to the input for accessibility.
          Screen readers announce the label when the input is focused.
          Clicking the label also focuses the input — standard UX. */}
      <label
        htmlFor={props.id || props.name}
        className="text-sm font-medium text-vault-muted"
      >
        {label}
      </label>
 
      {/* 
        {...props} spreads everything else (type, value, onChange, placeholder,
        required, disabled, etc.) directly onto the native input.
        This makes FormInput a thin, flexible wrapper — it doesn't need to
        know about every possible input attribute.
      */}
      <input
        id={props.id || props.name}
        className={`input-field ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
 
      {/* Error message — only rendered when the error prop has a value.
          The role="alert" makes screen readers announce it immediately
          when it appears, without the user needing to navigate to it. */}
      {error && (
        <p className="text-red-400 text-xs mt-0.5" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}