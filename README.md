# 🎮 Gaming Vault
 
> A secure, full-stack credential manager for gaming accounts — built with React, Firebase, and AES-256 client-side encryption.
 
**[🔴 Live Demo](https://gaming-vault-psi.vercel.app)** &nbsp;·&nbsp; Built as a personal portfolio project
 
---
 
## What it does
 
Gaming Vault lets users securely store login credentials for their gaming accounts (League of Legends, Valorant, Steam, Overwatch, and more) behind a personal authenticated account.
 
Every password is **encrypted in the browser before it ever leaves the device** — meaning even the database administrator cannot read stored credentials.
 
---
 
## Features
 
- 🔐 **Firebase Authentication** — email/password and Google OAuth sign-in
- 🔒 **AES-256 client-side encryption** — credentials encrypted before Firestore write
- 🎮 **Game logo grid** — click any platform to add or view credentials
- ✏️ **Full CRUD** — add, view, edit, and delete vault entries
- 📋 **One-click copy** — copy usernames, emails, and passwords to clipboard
- 🔎 **Live search** — filter saved accounts by game or username
- 📱 **Responsive** — works on mobile and desktop
- 🛡️ **Firestore security rules** — server-enforced owner-only data access
---
 
## Security architecture
 
This was the most interesting engineering challenge in the project. The threat model I designed against:
 
| Threat | Mitigation |
|---|---|
| Unauthorised database access | Firestore rules enforce `uid == userId` — cross-user reads are blocked at the server |
| Database breach | AES-256 encryption applied client-side; ciphertext stored, never plaintext |
| Key compromise | Encryption key = user UID + server secret; neither alone is sufficient to decrypt |
| Credential exposure | Secrets in `.env.local`, gitignored; Vercel environment variables for production |
| Accidental deletion | Two-step delete confirmation dialog before any destructive action |
 
The key insight: **two independent security layers**. Firebase rules prevent unauthorised access. Client-side encryption means that even with access, stored data is unreadable without the encryption key.
 
---
 
## Tech stack
 
| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast dev server, modern build tooling |
| Styling | Tailwind CSS + inline styles | Utility-first with custom gaming aesthetic |
| Auth | Firebase Authentication | Handles sessions, Google OAuth, password reset |
| Database | Cloud Firestore | Real-time, serverless, scales automatically |
| Encryption | crypto-js (AES-256) | Industry-standard symmetric encryption |
| Routing | React Router v6 | Declarative routing with protected routes |
| Deployment | Vercel | Git-push CI/CD, automatic HTTPS, global CDN |
 
---
 
## Architecture decisions
 
**Why client-side encryption?**
Server-side encryption protects data at rest but the server can still decrypt it. Client-side encryption means the server only ever receives ciphertext — the decryption key never leaves the user's browser.
 
**Why Firestore over a traditional database?**
For a personal project with unpredictable traffic, Firestore's serverless model means zero infrastructure to manage. Security rules replace a backend auth layer entirely.
 
**Why a custom hook (`useVault`) instead of putting logic in the page?**
Separation of concerns — the page handles rendering, the hook handles data. This makes the data layer independently testable and keeps components readable.
 
**Why optimistic local state updates?**
After a Firestore write, updating local state directly avoids a second network round-trip to re-fetch data. The UI feels instant without sacrificing data integrity (we only update state after a confirmed write).
 
---
 
## Running locally
 
```bash
# Clone
git clone https://github.com/YOUR_USERNAME/gaming-vault.git
cd gaming-vault
 
# Install dependencies
npm install
 
# Create environment file
cp .env.example .env.local
# Fill in your Firebase project values in .env.local
 
# Start dev server
npm run dev
```
 
**Firebase setup required** — you'll need a Firebase project with:
- Authentication enabled (Email/Password + Google)
- Firestore database created in production mode
- Security rules deployed (see `firestore.rules`)
---
 
## Project structure
 
```
src/
├── components/
│   ├── AuthLayout.jsx        # Shared login/register page wrapper
│   ├── DeleteConfirmDialog.jsx
│   ├── FormInput.jsx
│   ├── GameCard.jsx
│   ├── Navbar.jsx
│   ├── PrivateRoute.jsx      # Route-level auth guard
│   └── VaultModal.jsx        # View/add/edit credentials modal
├── config/
│   └── firebase.js           # Firebase initialisation
├── context/
│   └── AuthContext.jsx       # Global auth state via React Context
├── hooks/
│   └── useVault.js           # Vault data fetching and mutations
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── VaultPage.jsx         # Main vault dashboard
└── utils/
    ├── crypto.js             # AES-256 encrypt/decrypt helpers
    ├── games.js              # Supported games registry
    └── vaultService.js       # Firestore CRUD operations
```
 
---
 
## Patterns demonstrated
 
- **React Context + custom hook** for global auth state
- **Service layer pattern** — all Firestore logic isolated in `vaultService.js`
- **Route guards** via wrapper components (`PrivateRoute`)
- **Modal state machine** — single state object replaces multiple boolean flags
- **Optimistic UI updates** — local state updated after confirmed writes
- **Defence in depth** — two independent security layers (rules + encryption)
- **Environment variable management** — secrets never committed to version control
---
 
## What I'd add next
 
- Password generator built into the add form
- Export vault as encrypted JSON backup
- Auto-lock after inactivity timeout
- Browser extension for auto-fill
---
 
*Built by [Joseph Asare] · [1josephasare1@gmail.com] · [https://www.linkedin.com/in/joseph-asare-844036295/]*