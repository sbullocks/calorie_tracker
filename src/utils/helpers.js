export const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const uid = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36)

export const timeStr = () =>
  new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

export function fmtDate(s) {
  const [year, month, day] = s.split('-').map(Number)
  const d = new Date(year, month - 1, day) // month is 0-indexed
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

export function dayLabel(s) {
  const d = new Date(s + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = Math.round((now - d) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yest'
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}

export function calColor(pct) {
  if (pct >= 1) return 'var(--red)'
  if (pct >= 0.85) return 'var(--orange)'
  return 'var(--green)'
}

export function sumCal(entries) {
  return entries.reduce((s, e) => s + e.cal, 0)
}

export function last7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}
