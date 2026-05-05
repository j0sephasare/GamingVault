import { getGameById } from '../utils/games'

/*
  GameCard.jsx
  ============
  Displays a single vault entry as a clickable card.

  Shows:
  - Game logo image (or a letter fallback if image fails to load)
  - Game name
  - Username/email (masked — just to confirm an entry exists)
  - Edit and delete buttons


*/
export default function GameCard({ entry, onView, onEdit, onDelete }) {
  const game = getGameById(entry.game)

  // Mask the identifier — show first 2 chars, then ***, then domain if email
  const maskIdentifier = (str) => {
    if (!str) return '—'
    if (str.includes('@')) {
      const [local, domain] = str.split('@')
      const visible = local.slice(0, 2)
      return `${visible}***@${domain}`
    }
    return str.slice(0, 2) + '***'
  }

  // The display identifier — prefer username, fall back to email
  const displayIdentifier = maskIdentifier(entry.username || entry.email)

  return (
    <div
      className="card group relative flex flex-col overflow-hidden
                 transition-all duration-300 hover:border-vault-accent/50
                 hover:shadow-lg hover:shadow-vault-accent/10 cursor-pointer"
      style={{
        // Subtle top border accent in the game's brand colour
        borderTop: `2px solid ${game?.color ?? '#6366f1'}22`
      }}
    >
      {/* Clickable main area — opens view modal */}
      <div
        onClick={onView}
        className="flex flex-col items-center p-6 gap-4 flex-1"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onView()}
        aria-label={`View credentials for ${game?.name ?? entry.game}`}
      >
        {/* Game logo with colour glow on hover */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center
                     bg-vault-bg border border-vault-border
                     group-hover:border-opacity-0 transition-all duration-300
                     overflow-hidden shadow-md"
          style={{
            // On hover, glow in the game's brand colour
            boxShadow: `0 0 0 0 ${game?.color ?? '#6366f1'}00`,
          }}
        >
          <GameLogo game={game} />
        </div>

        {/* Game name + platform */}
        <div className="text-center">
          <h3 className="font-semibold text-white text-sm leading-tight">
            {game?.name ?? entry.game}
          </h3>
          <p className="text-vault-muted text-xs mt-1">
            {game?.platform ?? 'Gaming'}
          </p>
        </div>

        {/* Masked account identifier */}
        <div className="w-full bg-vault-bg rounded-lg px-3 py-2 text-center">
          <p className="text-vault-muted text-xs mb-0.5">Account</p>
          <p className="text-white text-xs font-mono truncate">
            {displayIdentifier}
          </p>
        </div>
      </div>

      {/*
        Action buttons — appear on hover using group-hover.
        They sit at the bottom of the card always, but the edit/delete
        icons become more visible on hover.
      */}
      <div className="flex border-t border-vault-border divide-x divide-vault-border">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit() }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5
                     text-vault-muted hover:text-vault-accent hover:bg-vault-accent/5
                     transition-colors text-xs font-medium"
          aria-label={`Edit ${game?.name} credentials`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652
                 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6
                 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
          Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5
                     text-vault-muted hover:text-red-400 hover:bg-red-500/5
                     transition-colors text-xs font-medium"
          aria-label={`Delete ${game?.name} credentials`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107
                 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244
                 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456
                 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114
                 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18
                 -.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037
                 -2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  )
}

/*
  GameLogo — renders the game's logo image with a text fallback.
  If the image fails to load (e.g. missing file), it shows the
  first letter of the game name in the brand colour instead.
  This prevents broken image icons on screen.
*/
function GameLogo({ game }) {
  if (!game || game.id === 'other') {
    return (
      <span className="text-3xl font-bold" style={{ color: game?.color ?? '#6366f1' }}>
        {game?.name?.[0] ?? '?'}
      </span>
    )
  }

  return (
    <img
      src={`/games/${game.imageKey}.png`}
      alt={game.name}
      className="w-12 h-12 object-contain"
      onError={(e) => {
        // If image doesn't load, hide it and show the letter fallback
        e.target.style.display = 'none'
        e.target.nextSibling?.style.removeProperty('display')
      }}
    />
  )
}