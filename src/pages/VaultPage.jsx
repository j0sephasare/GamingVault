import { useAuth } from '../context/AuthContext'

export default function VaultPage() {
  const { currentUser, logout } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-white">Vault — logged in as {currentUser?.email}</p>
      <button onClick={logout} className="btn-ghost">Log out</button>
    </div>
  )
}