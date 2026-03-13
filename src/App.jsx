import { useState } from 'react'
import { useCalorieStore } from './hooks/useCalorieStore'
import { todayKey, fmtDate, calColor, sumCal } from './utils/helpers'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import FoodLog from './components/FoodLog'
import FriendScreen from './components/FriendScreen'
import History from './components/History'
import NavBar from './components/NavBar'

const HEADER_TITLE = {
  dashboard: (name) => `Hi, ${name} 👋`,
  log: () => 'Food Log',
  friend: () => 'Friend',
  history: () => 'History',
}

export default function App() {
  const {
    profile,
    logs,
    friend,
    setupProfile,
    updateProfile,
    addEntry,
    deleteEntry,
    importFriend,
    clearFriend,
  } = useCalorieStore()
  const [tab, setTab] = useState('dashboard')

  if (!profile) return <Onboarding onDone={setupProfile} />

  const today = todayKey()
  const consumed = sumCal(logs[today] || [])
  const pct = consumed / profile.goal
  console.log('today', today)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header className="header">
        <div>
          <div className="header-title">{HEADER_TITLE[tab](profile.name)}</div>
          {tab === 'dashboard' && (
            <div className="header-sub">{fmtDate(today)}</div>
          )}
        </div>
        {tab === 'dashboard' && (
          <div style={{ textAlign: 'right' }}>
            <div
              style={{ fontWeight: 700, fontSize: 18, color: calColor(pct) }}
            >
              {consumed.toLocaleString()} cal
            </div>
            <div className="muted" style={{ fontSize: 12 }}>
              of {profile.goal.toLocaleString()}
            </div>
          </div>
        )}
        {tab === 'friend' && (
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: friend ? 'var(--green)' : 'var(--muted)',
            }}
          >
            {friend ? `● ${friend.name}` : '○ No friend'}
          </div>
        )}
      </header>

      <main className="screen">
        {tab === 'dashboard' && (
          <Dashboard profile={profile} logs={logs} friend={friend} />
        )}
        {tab === 'log' && (
          <FoodLog logs={logs} onAdd={addEntry} onDelete={deleteEntry} />
        )}
        {tab === 'friend' && (
          <FriendScreen
            profile={profile}
            logs={logs}
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
