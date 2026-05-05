/*
  DeleteConfirmDialog.jsx
  =======================
  A focused confirmation dialog before deleting a vault entry.

*/
export default function DeleteConfirmDialog({ gameName, onConfirm, onCancel, deleting }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={() => !deleting && onCancel()}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-title"
      aria-describedby="delete-desc"
    >
      <div
        className="card w-full max-w-sm shadow-2xl p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning icon */}
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30
                        flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374
                 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949
                 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h3 id="delete-title"
            className="text-lg font-semibold text-white text-center mb-2">
          Delete account?
        </h3>

        <p id="delete-desc" className="text-vault-muted text-sm text-center mb-6">
          This will permanently delete your{' '}
          <span className="text-white font-medium">{gameName}</span>{' '}
          credentials. This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="btn-ghost flex-1"
            autoFocus
            // autoFocus on Cancel: the safe default — pressing Enter cancels
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50
                       disabled:cursor-not-allowed text-white font-semibold
                       py-2.5 px-5 rounded-lg transition-colors duration-200
                       flex items-center justify-center gap-2
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                       focus:ring-offset-vault-bg"
          >
            {deleting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}