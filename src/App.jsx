import { useEffect, useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useCalorieStore } from './hooks/useCalorieStore'
import { todayKey, fmtDate, calColor, sumCal } from './utils/helpers'
import LoginScreen from './components/LoginScreen'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import FoodLog from './components/FoodLog'
import FriendScreen from './components/FriendScreen'
import History from './components/History'
import NavBar from './components/NavBar'
import ThemeToggle from './components/ThemeToggle'
import UserMenu from './components/UserMenu'

const HEADER_TITLE = {
  dashboard: (name) => `Hi, ${name} 👋`,
  log: () => 'Food Log',
  friend: () => 'Friend',
  history: () => 'History',
}

export default function App() {
  const [isDark, setIsDark] = useState(false)
  const toggleTheme = () => setIsDark(p => !p)

  const user = useAuth() // undefined = loading | null = logged out | User = logged in

  const {
    profile,
    logs,
    friend,
    friendUid,
    setupProfile,
    updateProfile,
    addEntry,
    deleteEntry,
    importFriend,
    clearFriend,
    syncFriend,
  } = useCalorieStore(user?.uid ?? null)

  const [tab, setTab] = useState('dashboard')

  // Sync friend data on app open and whenever the window regains focus
  useEffect(() => {
    if (!user || !friendUid) return
    syncFriend()
    const onFocus = () => syncFriend()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [user, friendUid, syncFriend])

  // --- Loading state (Firebase auth resolving) ---
  if (user === undefined) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="muted">Loading…</div>
      </div>
    )
  }

  // --- Not logged in ---
  if (user === null) return <LoginScreen />

  // --- Logged in but no profile yet ---
  if (!profile) return <Onboarding onDone={setupProfile} />

  const today = todayKey()
  const consumed = sumCal(logs[today] || [])
  const pct = consumed / profile.goal

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: isDark ? '#121212' : '#ffffff', transition: 'background-color 0.3s ease' }}>
      <header className="header">
        <div>
          <div className="header-title">{HEADER_TITLE[tab](profile.name)}</div>
          {tab === 'dashboard' && (
            <div className="header-sub">{fmtDate(today)}</div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {tab === 'dashboard' && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: calColor(pct) }}>
                {consumed.toLocaleString()} cal
              </div>
              <div className="muted" style={{ fontSize: 12 }}>
                of {profile.goal.toLocaleString()}
              </div>
            </div>
          )}
          {tab === 'friend' && (
            <div style={{ fontSize: 12, fontWeight: 600, color: friend ? 'var(--green)' : 'var(--muted)' }}>
              {friend ? `● ${friend.name}` : '○ No friend'}
            </div>
          )}
          <UserMenu email={user.email} />
        </div>
      </header>

      <main className="screen">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        {tab === 'dashboard' && (
          <Dashboard profile={profile} logs={logs} friend={friend} />
        )}
        {tab === 'log' && (
          <FoodLog logs={logs} onAdd={addEntry} onDelete={deleteEntry} />
        )}
        {tab === 'friend' && (
          <FriendScreen
            profile={profile}
            userId={user.uid}
            friend={friend}
            onImport={importFriend}
            onClear={clearFriend}
            onUpdateProfile={updateProfile}
          />
        )}
        {tab === 'history' && (
          <History profile={profile} logs={logs} friend={friend} />
        )}
      </main>

      <NavBar tab={tab} setTab={setTab} />
    </div>
  )
}
