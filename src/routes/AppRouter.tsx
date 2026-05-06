import { type ReactNode, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'
import { SettingsPage } from '../pages/SettingsPage'
import { SetupPage } from '../pages/SetupPage'
import { LockScreenPage } from '../pages/LockScreenPage'

function Protected({ children }: { children: ReactNode }) {
  const authed = useAuthStore((s) => s.isAuthenticated)
  return authed ? children : <Navigate to="/lock" replace />
}

export function AppRouter() {
  const { isInitialized, isSetup, bootstrap, lock, isAuthenticated } = useAuthStore()
  const loadSettings = useSettingsStore((s) => s.loadSettings)
  const autoLockMinutes = useSettingsStore((s) => s.settings.autoLockMinutes)
  const location = useLocation()

  useEffect(() => { void bootstrap(); void loadSettings() }, [bootstrap, loadSettings])

  useEffect(() => {
    if (!isAuthenticated) return
    let timer: number
    const reset = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => lock(), autoLockMinutes * 60 * 1000)
    }
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart']
    events.forEach((event) => window.addEventListener(event, reset, { passive: true }))
    reset()
    return () => {
      window.clearTimeout(timer)
      events.forEach((event) => window.removeEventListener(event, reset))
    }
  }, [isAuthenticated, lock, autoLockMinutes, location.pathname])

  if (!isInitialized) return null

  return (
    <Routes>
      {!isSetup ? (
        <>
          <Route path="/setup" element={<SetupPage />} />
          <Route path="*" element={<Navigate to="/setup" replace />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/lock" element={<LockScreenPage />} />
          <Route element={<Protected><AppLayout /></Protected>}>
            <Route path="/dashboard" element={<DashboardPage mode="all" />} />
            <Route path="/dashboard/favorites" element={<DashboardPage mode="favorites" />} />
            <Route path="/dashboard/trash" element={<DashboardPage mode="trash" />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
        </>
      )}
    </Routes>
  )
}
