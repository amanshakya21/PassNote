import { NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function AppLayout() {
  const lock = useAuthStore((s) => s.lock)
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-r border-white/10 bg-slate-950/70 p-4">
        <h1 className="mb-4 text-xl font-bold">PassNote</h1>
        <nav className="space-y-2 text-sm">
          <NavLink className="block rounded-lg px-3 py-2 hover:bg-white/10" to="/dashboard">All Items</NavLink>
          <NavLink className="block rounded-lg px-3 py-2 hover:bg-white/10" to="/dashboard/favorites">Favorites</NavLink>
          <NavLink className="block rounded-lg px-3 py-2 hover:bg-white/10" to="/dashboard/trash">Trash</NavLink>
          <NavLink className="block rounded-lg px-3 py-2 hover:bg-white/10" to="/settings">Settings</NavLink>
        </nav>
        <button type="button" className="mt-6 rounded-lg bg-white/10 px-3 py-2 text-sm" onClick={lock}>Lock Vault</button>
      </aside>
      <main className="p-4 md:p-6"><Outlet /></main>
    </div>
  )
}
