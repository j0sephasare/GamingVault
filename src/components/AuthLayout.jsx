export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4
                    bg-vault-bg relative overflow-hidden">
 
      {/*
        Decorative background glow blobs — pure CSS, no images needed.
        position: absolute means they don't affect layout of the card above.
        pointer-events-none means they can't be accidentally clicked.
        These are a common modern UI technique — simple but effective.
      */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96
                      bg-vault-accent opacity-10 rounded-full blur-3xl
                      pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96
                      bg-purple-600 opacity-10 rounded-full blur-3xl
                      pointer-events-none" />
 
      {/* The card itself — centered, max width so it doesn't stretch on wide screens */}
      <div className="card w-full max-w-md p-8 relative z-10 animate-fade-in">
 
        {/* Logo / brand mark at the top */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-vault-accent
                          flex items-center justify-center shadow-lg">
            {/* SVG shield icon — represents security, fits the theme */}
            <svg className="w-8 h-8 text-white" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0
                   013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824
                   10.29 9 11.623 5.176-1.332 9-6.03 9-11.622
                   0-1.31-.21-2.571-.598-3.751h-.152c-3.196
                   0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
        </div>
 
        {/* Title and subtitle passed in as props — differ per page */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-vault-muted text-sm">{subtitle}</p>
        </div>
 
        {/* The actual form content — different for Login vs Register */}
        {children}
      </div>
    </div>
  )
}
 