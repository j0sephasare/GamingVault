import { useState } from 'react'
import Navbar from '../components/Navbar'
import VaultModal from '../components/VaultModal'
import DeleteConfirmDialog from '../components/DeleteConfirmDialog'
import { useVault } from '../hooks/useVault'
import { GAMES, getGameById, getGameImageSrc } from '../utils/games'

export default function VaultPage() {
  const { entries, loading, saving, error, addEntry, editEntry, removeEntry } = useVault()
  const [modal, setModal]       = useState({ type: null })
  const [search, setSearch]     = useState('')
  const [deleting, setDeleting] = useState(false)

  const entryByGame = Object.fromEntries(entries.map(e => [e.game, e]))

  const filteredEntries = entries.filter(entry => {
    if (!search.trim()) return true
    const game = getGameById(entry.game)
    const q = search.toLowerCase()
    return (
      game?.name.toLowerCase().includes(q) ||
      entry.username?.toLowerCase().includes(q) ||
      entry.email?.toLowerCase().includes(q)
    )
  })

  const openAdd    = (gameId) => setModal({ type: 'add',    presetGame: gameId })
  const openView   = (entry)  => setModal({ type: 'view',   entry })
  const openEdit   = (entry)  => setModal({ type: 'edit',   entry })
  const openDelete = (entry)  => setModal({ type: 'delete', entry })
  const closeModal = ()       => setModal({ type: null })

  const handleGameTileClick = (gameId) => {
    const existing = entryByGame[gameId]
    existing ? openView(existing) : openAdd(gameId)
  }

  const handleSave = async (formData) => {
    let success
    if (modal.type === 'add')  success = await addEntry(formData)
    if (modal.type === 'edit') success = await editEntry(modal.entry.id, formData)
    if (success) closeModal()
  }

  const handleDelete = async () => {
    setDeleting(true)
    const success = await removeEntry(modal.entry.id)
    setDeleting(false)
    if (success) closeModal()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
                  background: 'var(--bg)', position: 'relative' }}>

      {/* Ambient background glow blobs */}
      <div style={{
        position: 'fixed', top: '-15%', left: '-10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', right: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <Navbar />

      <main style={{
        flex: 1, position: 'relative', zIndex: 1,
        maxWidth: 1100, margin: '0 auto', width: '100%',
        padding: '2.5rem 1.5rem',
      }}>

        {/* ── PAGE HEADER ─────────────────────────────────── */}
        <div style={{ marginBottom: '2.5rem' }} className="animate-fade-up">
          <div style={{ display: 'flex', alignItems: 'flex-end',
                        justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <div style={{
                  width: 3, height: 28,
                  background: 'linear-gradient(180deg, #6366f1, #a855f7)',
                  borderRadius: 2, flexShrink: 0,
                }} />
                <h1 style={{
                  margin: 0,
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '2rem', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: 'linear-gradient(90deg, #e2e4f0 0%, #a8b0c8 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  Credential Vault
                </h1>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '0.9rem' }}>
                <StatBadge
                  value={entries.length}
                  label={entries.length !== 1 ? 'accounts' : 'account'}
                  color="#6366f1"
                />
                <StatBadge value="AES-256" label="encrypted" color="#22c55e" />
                <StatBadge value="E2E" label="secured" color="#f0b429" />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION LABEL ────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}
             className="animate-fade-up stagger-1">
          <span style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--muted)',
          }}>
            // Select Platform
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--border), transparent)' }} />
        </div>

        {/* ── GAME GRID ────────────────────────────────────── */}
        {loading ? (
          <div style={gridStyle}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                borderRadius: 12, background: 'var(--surface)',
                aspectRatio: '4/3', animation: 'fadeIn 1s ease infinite alternate',
              }} />
            ))}
          </div>
        ) : (
          <div style={gridStyle} className="animate-fade-up stagger-2">
            {GAMES.map((game, i) => (
              <GameTile
                key={game.id}
                game={game}
                hasAccount={!!entryByGame[game.id]}
                onClick={() => handleGameTileClick(game.id)}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Empty hint */}
        {!loading && entries.length === 0 && (
          <p style={{
            textAlign: 'center', color: 'var(--muted)',
            fontSize: '0.85rem', marginTop: '1.5rem',
            fontFamily: "'Barlow', sans-serif",
          }}>
            Select a platform above to add your first account
          </p>
        )}

        {/* ── SAVED ACCOUNTS LIST ──────────────────────────── */}
        {entries.length > 0 && (
          <div style={{ marginTop: '3rem' }} className="animate-fade-up stagger-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.68rem', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--muted)',
              }}>
                // Saved Accounts
              </span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--border), transparent)' }} />
              {entries.length > 2 && (
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                       style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    type="search" placeholder="Search accounts..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="glow-input"
                    style={{ paddingLeft: 32, width: 200, fontSize: '0.82rem' }}
                  />
                </div>
              )}
            </div>

            {error && (
              <p style={{ color: 'var(--red)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filteredEntries.map((entry, i) => (
                <AccountRow
                  key={entry.id}
                  entry={entry}
                  index={i}
                  onView={() => openView(entry)}
                  onEdit={() => openEdit(entry)}
                  onDelete={() => openDelete(entry)}
                />
              ))}
            </div>

            {filteredEntries.length === 0 && search && (
              <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', padding: '2rem 0' }}>
                No accounts match "{search}"
              </p>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {(modal.type === 'view' || modal.type === 'add' || modal.type === 'edit') && (
        <VaultModal
          mode={modal.type}
          entry={modal.entry}
          presetGame={modal.presetGame}
          onClose={closeModal}
          onSave={handleSave}
          saving={saving}
        />
      )}
      {modal.type === 'delete' && (
        <DeleteConfirmDialog
          gameName={getGameById(modal.entry?.game)?.name ?? 'this account'}
          onConfirm={handleDelete}
          onCancel={closeModal}
          deleting={deleting}
        />
      )}
    </div>
  )
}

/* ── Stat badge ─────────────────────────────────────────────── */
function StatBadge({ value, label, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 4,
      border: `1px solid ${color}33`,
      background: `${color}0f`,
    }}>
      <span style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: '0.78rem', fontWeight: 700,
        color, letterSpacing: '0.04em',
      }}>{value}</span>
      <span style={{ fontSize: '0.72rem', color: 'var(--muted2)', fontWeight: 500 }}>{label}</span>
    </div>
  )
}

/* ── Grid style ─────────────────────────────────────────────── */
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  gap: '1rem',
}

/* ── GameTile ───────────────────────────────────────────────── */
function GameTile({ game, hasAccount, onClick, index }) {
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered]   = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={hasAccount ? `Manage ${game.name}` : `Add ${game.name} account`}
      style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end',
        padding: 0,
        borderRadius: 12,
        border: `1px solid ${hovered
          ? game.color + 'bb'
          : hasAccount ? game.color + '55' : '#1e2235'}`,
        background: 'var(--surface)',
        boxShadow: hovered
          ? `0 0 32px ${game.color}40, 0 8px 24px rgba(0,0,0,0.4)`
          : hasAccount
            ? `0 0 16px ${game.color}20`
            : '0 2px 8px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        outline: 'none',
        overflow: 'hidden',
        aspectRatio: '3/2',
        width: '100%',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Full-bleed game image */}
      {!imgError ? (
        <img
          src={getGameImageSrc(game)}
          alt={game.name}
          onError={() => setImgError(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            transition: 'transform 0.4s ease, filter 0.3s ease',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            filter: hovered
              ? 'brightness(0.85) saturate(1.3)'
              : hasAccount ? 'brightness(0.7) saturate(1.1)' : 'brightness(0.55) saturate(0.8)',
          }}
        />
      ) : (
        /* Fallback when image missing */
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${game.color}22, #13161f)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '3rem', fontWeight: 700,
            color: game.color, opacity: 0.8,
          }}>{game.name[0]}</span>
        </div>
      )}

      {/* Gradient overlay — darkens bottom for text readability */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(
          to bottom,
          transparent 20%,
          rgba(7,8,15,0.5) 60%,
          rgba(7,8,15,0.92) 100%
        )`,
        transition: 'opacity 0.3s',
      }} />

      {/* Game colour accent on hover — top edge glow */}
      {hovered && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${game.color}, transparent)`,
        }} />
      )}

      {/* Name label at the bottom */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', padding: '0.6rem 0.75rem',
        textAlign: 'left',
      }}>
        <p style={{
          margin: 0,
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '0.82rem', fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: hovered ? '#fff' : '#c8cde0',
          transition: 'color 0.2s',
          lineHeight: 1.2,
        }}>{game.name}</p>
        <p style={{
          margin: '1px 0 0',
          fontFamily: "'Barlow', sans-serif",
          fontSize: '0.65rem', color: 'var(--muted2)',
        }}>{game.platform}</p>
      </div>

      {/* Saved tick — top right */}
      {hasAccount && (
        <div style={{
          position: 'absolute', top: 8, right: 8, zIndex: 3,
          width: 22, height: 22, borderRadius: '50%',
          background: '#16a34a',
          border: '2px solid rgba(7,8,15,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 10px rgba(34,197,94,0.5)',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
               stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 12.75l6 6 9-13.5"/>
          </svg>
        </div>
      )}

      {/* Add badge on hover when no account */}
      {!hasAccount && hovered && (
        <div style={{
          position: 'absolute', top: 8, right: 8, zIndex: 3,
          width: 22, height: 22, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 10px rgba(99,102,241,0.5)',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
               stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
        </div>
      )}
    </button>
  )
}

/* ── AccountRow ─────────────────────────────────────────────── */
function AccountRow({ entry, onView, onEdit, onDelete, index }) {
  const game = getGameById(entry.game)
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered]   = useState(false)

  const maskId = (str) => {
    if (!str) return '—'
    if (str.includes('@')) {
      const [local, domain] = str.split('@')
      return `${local.slice(0, 2)}***@${domain}`
    }
    return str.slice(0, 2) + '***'
  }

  return (
    <div
      onClick={onView}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.875rem',
        padding: '0.7rem 1rem',
        borderRadius: 8,
        border: `1px solid ${hovered ? game?.color + '44' : 'var(--border)'}`,
        background: hovered ? 'var(--surface2)' : 'var(--surface)',
        cursor: 'pointer', transition: 'all 0.15s ease',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Left colour indicator */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 2,
        background: hovered
          ? `linear-gradient(180deg, ${game?.color}, transparent)`
          : 'transparent',
        transition: 'all 0.2s',
      }} />

      {/* Thumbnail */}
      <div style={{
        width: 44, height: 32, borderRadius: 6, overflow: 'hidden',
        flexShrink: 0, background: 'var(--bg)',
        border: '1px solid var(--border)',
      }}>
        {game && !imgError ? (
          <img src={getGameImageSrc(game)} alt={game.name}
               onError={() => setImgError(true)}
               style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${game?.color}22`,
          }}>
            <span style={{ color: game?.color, fontWeight: 700, fontSize: '0.9rem',
                           fontFamily: "'Rajdhani', sans-serif" }}>
              {game?.name[0]}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontWeight: 600, fontSize: '0.875rem',
          color: hovered ? '#fff' : 'var(--text)',
          fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: '0.04em', textTransform: 'uppercase',
          transition: 'color 0.15s',
        }}>{game?.name}</p>
        <p style={{
          margin: 0, fontSize: '0.72rem', color: 'var(--muted2)',
          fontFamily: "'Share Tech Mono', monospace",
        }}>
          {maskId(entry.username || entry.email)}
        </p>
      </div>

      {/* Platform badge */}
      <div style={{
        padding: '2px 8px', borderRadius: 4,
        background: `${game?.color}18`,
        border: `1px solid ${game?.color}33`,
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: '0.65rem', color: game?.color,
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>{game?.platform}</span>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', gap: '0.25rem',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.15s', flexShrink: 0,
      }}>
        <RowBtn onClick={e => { e.stopPropagation(); onEdit() }}
                label="Edit" color="#6366f1">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582
               16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0
               011.13-1.897l8.932-8.931z"/>
        </RowBtn>
        <RowBtn onClick={e => { e.stopPropagation(); onDelete() }}
                label="Delete" color="#ef4444">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107
               1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244
               2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456
               0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114
               1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18
               -.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037
               -2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
        </RowBtn>
      </div>

      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
      </svg>
    </div>
  )
}

function RowBtn({ onClick, label, color, children }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} aria-label={label}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: '5px', borderRadius: 6, border: 'none', cursor: 'pointer',
        background: hov ? color + '22' : 'transparent',
        color: hov ? color : 'var(--muted)', transition: 'all 0.15s',
      }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2">{children}</svg>
    </button>
  )
}