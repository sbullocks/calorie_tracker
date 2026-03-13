import { useEffect, useMemo, useRef, useState } from 'react'
import { FOODS, VEGAN_FOODS } from '../constants/foods'
import { todayKey, sumCal } from '../utils/helpers'

export default function FoodLog({ logs, onAdd, onDelete }) {
  const [query, setQuery] = useState('')
  const [calInput, setCalInput] = useState('')
  const [showDrop, setShowDrop] = useState(false)
  const [flash, setFlash] = useState('')
  const [veganOnly, setVeganOnly] = useState(false)
  const wrapRef = useRef(null)

  const today = todayKey()
  const entries = logs[today] || []
  const consumed = sumCal(entries)

  const foodPool = veganOnly ? VEGAN_FOODS : FOODS

  const filtered = useMemo(
    () =>
      query.trim().length === 0
        ? []
        : foodPool
            .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 7),
    [query, foodPool],
  )

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setShowDrop(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectFood = (f) => {
    setQuery(f.name)
    setCalInput(f.cal.toString())
    setShowDrop(false)
  }

  const doAdd = (name, cal) => {
    if (!name?.trim() || !cal || parseInt(cal) < 1) return
    onAdd(name.trim(), parseInt(cal))
    setQuery('')
    setCalInput('')
    setShowDrop(false)
    setFlash(`Added ${name.trim()} (${cal} cal)`)
    setTimeout(() => setFlash(''), 2500)
  }

  const quickAdd = (f) => {
    onAdd(f.name, f.cal)
    setFlash(`Added ${f.name} (${f.cal} cal)`)
    setTimeout(() => setFlash(''), 2500)
  }

  return (
    <div>
      {flash && <div className="alert alert-ok">✓ {flash}</div>}

      <div className="card">
        <div className="row" style={{ marginBottom: 14 }}>
          <div className="card-title" style={{ margin: 0 }}>
            Add Food
          </div>
          <button
            className={`btn btn-sm ${veganOnly ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: 12 }}
            onClick={() => setVeganOnly((v) => !v)}
          >
            🌱 Vegan{veganOnly ? ' ✓' : ''}
          </button>
        </div>

        <div
          className="input-group"
          style={{ position: 'relative' }}
          ref={wrapRef}
        >
          <label className="lbl">Search or type food name</label>
          <input
            className="input"
            placeholder="e.g. Pizza, oatmeal, chickpeas…"
            value={query}
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value)
              setShowDrop(e.target.value.length > 0)
            }}
            onFocus={() => query.length > 0 && setShowDrop(true)}
          />
          {showDrop && filtered.length > 0 && (
            <div className="dropdown">
              {filtered.map((f) => (
                <div
                  key={f.name}
                  className="dd-item"
                  onMouseDown={() => selectFood(f)}
                >
                  <span>
                    {f.name}
                    {f.vegan && (
                      <span
                        style={{
                          marginLeft: 5,
                          fontSize: 11,
                          color: 'var(--green-dark)',
                        }}
                      >
                        🌱
                      </span>
                    )}
                  </span>
                  <span style={{ color: 'var(--muted)', fontWeight: 600 }}>
                    {f.cal} cal
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="input-group">
          <label className="lbl">Calories</label>
          <input
            className="input"
            type="number"
            placeholder="e.g. 350"
            value={calInput}
            onChange={(e) => setCalInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && doAdd(query, parseInt(calInput))
            }
          />
        </div>

        <button
          className="btn btn-primary btn-full"
          disabled={!query.trim() || !calInput || parseInt(calInput) < 1}
          onClick={() => doAdd(query, parseInt(calInput))}
        >
          + Add Entry
        </button>

        <div style={{ marginTop: 18 }}>
          <div className="lbl">Quick Add {veganOnly ? '· Vegan' : ''}</div>
          <div className="chips">
            {foodPool.slice(0, 14).map((f) => (
              <span key={f.name} className="chip" onClick={() => quickAdd(f)}>
                {f.name} <span style={{ opacity: 0.65 }}>· {f.cal}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row" style={{ marginBottom: 12 }}>
          <div className="card-title" style={{ margin: 0 }}>
            Today's Entries
          </div>
          <span style={{ fontWeight: 700, color: 'var(--orange)' }}>
            {consumed.toLocaleString()} cal
          </span>
        </div>
        {entries.length === 0 ? (
          <div
            className="muted"
            style={{ textAlign: 'center', padding: '16px 0' }}
          >
            No entries yet today
          </div>
        ) : (
          [...entries].reverse().map((e) => (
            <div className="food-item" key={e.id}>
              <div>
                <div className="food-name">{e.name}</div>
                <div className="food-time">{e.time}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="food-cals">{e.cal} cal</span>
                <button
                  className="del-btn"
                  onClick={() => onDelete(e.id, today)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
